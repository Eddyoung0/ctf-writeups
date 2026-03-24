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

const getUserCart = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Valid user id is required' });
    }

    const rows = await queryAsync(
      `SELECT
        ci.product_id AS id,
        ci.quantity,
        p.name,
        p.department,
        p.price,
        p.old_price,
        p.rating,
        p.reviews_count,
        p.image_url
      FROM cart_items ci
      INNER JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.updated_at DESC`,
      [userId]
    );

    const data = rows.map((row) => ({
      id: row.id,
      quantity: Number(row.quantity || 0),
      name: row.name,
      department: row.department,
      price: Number(row.price || 0),
      oldPrice: row.old_price === null ? null : Number(row.old_price),
      rating: Number(row.rating || 0),
      reviews: Number(row.reviews_count || 0),
      image: row.image_url,
    }));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

const upsertCartItem = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    const userId = Number(user_id);
    const productId = Number(product_id);
    const qty = Number(quantity);

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Valid user_id is required' });
    }

    if (!productId || Number.isNaN(productId)) {
      return res.status(400).json({ message: 'Valid product_id is required' });
    }

    if (Number.isNaN(qty)) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    if (qty <= 0) {
      await queryAsync('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
      return res.status(200).json({ success: true, message: 'Item removed from cart' });
    }

    await queryAsync(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [userId, productId, qty]
    );

    return res.status(200).json({ success: true, message: 'Cart updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);

    if (!userId || Number.isNaN(userId) || !productId || Number.isNaN(productId)) {
      return res.status(400).json({ message: 'Valid user id and product id are required' });
    }

    await queryAsync('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
    return res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove cart item', error: err.message });
  }
};

const clearUserCart = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Valid user id is required' });
    }

    await queryAsync('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    return res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};

export { getUserCart, upsertCartItem, removeCartItem, clearUserCart };
