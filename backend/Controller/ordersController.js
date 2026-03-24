import db from '../config/db.js';

const queryAsync = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });

const VALID_DELIVERY_STATUSES = ['processing', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];
const VALID_PAYMENT_METHODS = ['card', 'esewa', 'khalti', 'ime-pay', 'bank-transfer', 'cash-on-delivery'];

const checkoutOrders = async (req, res) => {
  try {
    const { user_id, items, payment_method } = req.body;

    if (!user_id || Number.isNaN(Number(user_id))) {
      return res.status(400).json({ message: 'Valid user_id is required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one cart item is required' });
    }

    const selectedMethod = String(payment_method || 'card').trim().toLowerCase();
    if (!VALID_PAYMENT_METHODS.includes(selectedMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const paymentStatus = selectedMethod === 'cash-on-delivery' ? 'pending' : 'paid';
    const trackingNote =
      selectedMethod === 'cash-on-delivery'
        ? 'Order placed. Payment pending (Cash on Delivery).'
        : 'Order placed successfully';

    const normalizedItems = items
      .map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      }))
      .filter((item) => Number.isFinite(item.product_id) && Number.isFinite(item.quantity) && item.quantity > 0);

    if (!normalizedItems.length) {
      return res.status(400).json({ message: 'Cart items must contain valid product_id and quantity' });
    }

    const userId = Number(user_id);

    const userRows = await queryAsync('SELECT id FROM users WHERE id = ?', [userId]);
    if (!userRows.length) {
      return res.status(400).json({ message: 'user_id does not exist in users table' });
    }

    const productIds = [...new Set(normalizedItems.map((item) => item.product_id))];
    const placeholders = productIds.map(() => '?').join(',');
    const productRows = await queryAsync(`SELECT id, price FROM products WHERE id IN (${placeholders})`, productIds);

    if (productRows.length !== productIds.length) {
      return res.status(400).json({ message: 'One or more product_id values do not exist' });
    }

    const productsMap = new Map(productRows.map((row) => [row.id, Number(row.price || 0)]));

    await queryAsync('START TRANSACTION');

    const insertedOrderIds = [];

    try {
      for (const item of normalizedItems) {
        const unitPrice = productsMap.get(item.product_id) || 0;
        const total = unitPrice * item.quantity;

        const result = await queryAsync(
          `INSERT INTO orders (
            user_id,
            product_id,
            quantity,
            total_price,
            payment_method,
            payment_status,
            delivery_status,
            tracking_note
          ) VALUES (?, ?, ?, ?, ?, ?, 'processing', ?)` ,
          [userId, item.product_id, item.quantity, total, selectedMethod, paymentStatus, trackingNote]
        );

        insertedOrderIds.push(result.insertId);
      }

      await queryAsync('COMMIT');
    } catch (insertErr) {
      await queryAsync('ROLLBACK');
      throw insertErr;
    }

    const idPlaceholders = insertedOrderIds.map(() => '?').join(',');
    const createdOrders = await queryAsync(
      `SELECT
        o.id,
        o.user_id,
        o.product_id,
        p.name AS product_name,
        p.image_url AS product_image,
        o.quantity,
        o.total_price,
        o.payment_method,
        o.payment_status,
        o.delivery_status,
        o.tracking_note,
        o.created_at,
        o.updated_at
      FROM orders o
      INNER JOIN products p ON p.id = o.product_id
      WHERE o.id IN (${idPlaceholders})
      ORDER BY o.id DESC`,
      insertedOrderIds
    );

    return res.status(201).json({
      success: true,
      message: 'Payment completed and orders created',
      data: createdOrders,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to complete checkout', error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Valid user id is required' });
    }

    const rows = await queryAsync(
      `SELECT
        o.id,
        o.user_id,
        o.product_id,
        p.name AS product_name,
        p.image_url AS product_image,
        o.quantity,
        o.total_price,
        o.payment_method,
        o.payment_status,
        o.delivery_status,
        o.tracking_note,
        o.created_at,
        o.updated_at
      FROM orders o
      INNER JOIN products p ON p.id = o.product_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user orders', error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const rows = await queryAsync(
      `SELECT
        o.id,
        o.user_id,
        u.name AS user_name,
        u.email AS user_email,
        o.product_id,
        p.name AS product_name,
        p.image_url AS product_image,
        o.quantity,
        o.total_price,
        o.payment_method,
        o.payment_status,
        o.delivery_status,
        o.tracking_note,
        o.created_at,
        o.updated_at
      FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      INNER JOIN products p ON p.id = o.product_id
      ORDER BY o.created_at DESC`
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch all orders', error: err.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { delivery_status, tracking_note } = req.body;

    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Valid order id is required' });
    }

    if (!delivery_status || !VALID_DELIVERY_STATUSES.includes(delivery_status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    await queryAsync(
      'UPDATE orders SET delivery_status = ?, tracking_note = ? WHERE id = ?',
      [delivery_status, tracking_note?.trim() || null, orderId]
    );

    const rows = await queryAsync(
      `SELECT
        o.id,
        o.user_id,
        o.product_id,
        p.name AS product_name,
        p.image_url AS product_image,
        o.quantity,
        o.total_price,
        o.payment_method,
        o.payment_status,
        o.delivery_status,
        o.tracking_note,
        o.created_at,
        o.updated_at
      FROM orders o
      INNER JOIN products p ON p.id = o.product_id
      WHERE o.id = ?`,
      [orderId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ success: true, message: 'Delivery status updated', data: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update delivery status', error: err.message });
  }
};

const getDashboardOverview = async (req, res) => {
  try {
    const [ordersCountRow] = await queryAsync('SELECT COUNT(*) AS total_orders FROM orders');
    const [revenueRow] = await queryAsync("SELECT COALESCE(SUM(total_price), 0) AS total_revenue FROM orders WHERE payment_status = 'paid'");
    const [customersRow] = await queryAsync("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'user'");
    const [productsRow] = await queryAsync('SELECT COUNT(*) AS total_products FROM products');
    const [pendingDeliveryRow] = await queryAsync("SELECT COUNT(*) AS pending_deliveries FROM orders WHERE delivery_status IN ('processing', 'packed', 'shipped', 'out-for-delivery')");
    const [todayOrdersRow] = await queryAsync('SELECT COUNT(*) AS today_orders FROM orders WHERE DATE(created_at) = CURDATE()');

    const salesSeries = await queryAsync(
      `SELECT
        DATE(created_at) AS day,
        COUNT(*) AS orders,
        COALESCE(SUM(total_price), 0) AS revenue
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY day ASC`
    );

    const topDepartments = await queryAsync(
      `SELECT
        p.department,
        COUNT(o.id) AS orders,
        COALESCE(SUM(o.total_price), 0) AS revenue
      FROM orders o
      INNER JOIN products p ON p.id = o.product_id
      GROUP BY p.department
      ORDER BY orders DESC, revenue DESC
      LIMIT 5`
    );

    const recentOrders = await queryAsync(
      `SELECT
        o.id,
        u.name AS customer,
        p.name AS product,
        o.quantity,
        o.total_price,
        o.delivery_status,
        o.created_at
      FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      INNER JOIN products p ON p.id = o.product_id
      ORDER BY o.created_at DESC
      LIMIT 8`
    );

    const deliveryQueue = await queryAsync(
      `SELECT
        o.id,
        u.name,
        p.name AS product_name,
        o.delivery_status,
        o.tracking_note,
        o.updated_at
      FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      INNER JOIN products p ON p.id = o.product_id
      WHERE o.delivery_status IN ('processing', 'packed', 'shipped', 'out-for-delivery')
      ORDER BY o.updated_at DESC
      LIMIT 8`
    );

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalOrders: Number(ordersCountRow?.total_orders || 0),
          totalRevenue: Number(revenueRow?.total_revenue || 0),
          totalCustomers: Number(customersRow?.total_customers || 0),
          totalProducts: Number(productsRow?.total_products || 0),
          pendingDeliveries: Number(pendingDeliveryRow?.pending_deliveries || 0),
          todayOrders: Number(todayOrdersRow?.today_orders || 0),
        },
        salesSeries,
        topDepartments,
        recentOrders,
        deliveryQueue,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch dashboard overview', error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Valid order id is required' });
    }

    const result = await queryAsync('DELETE FROM orders WHERE id = ?', [orderId]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
};

export {
  checkoutOrders,
  getUserOrders,
  getAllOrders,
  updateDeliveryStatus,
  getDashboardOverview,
  deleteOrder,
  VALID_DELIVERY_STATUSES,
};
