import db from '../config/db.js';

const PRODUCT_SELECT = `
  SELECT
    id,
    department,
    name,
    price,
    old_price,
    rating,
    reviews_count,
    color,
    image_url,
    images_json,
    description,
    created_at
  FROM products
`;

const mapProductRow = (row) => {
  let images = [];

  if (Array.isArray(row.images_json)) {
    images = row.images_json;
  } else if (typeof row.images_json === 'string' && row.images_json.trim()) {
    try {
      const parsed = JSON.parse(row.images_json);
      images = Array.isArray(parsed) ? parsed : [];
    } catch {
      images = [];
    }
  }

  return {
    id: row.id,
    department: row.department,
    name: row.name,
    price: Number(row.price || 0),
    oldPrice: row.old_price === null ? null : Number(row.old_price),
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews_count || 0),
    color: row.color,
    image: row.image_url,
    images,
    description: row.description,
    created_at: row.created_at,
  };
};

const getProducts = (req, res) => {
  const { department } = req.query;

  const validDepartments = ['electronics', 'groceries', 'clothing', 'home-kitchen'];
  if (department && !validDepartments.includes(department)) {
    return res.status(400).json({ message: 'Invalid department filter' });
  }

  const query = department
    ? `${PRODUCT_SELECT} WHERE department = ? ORDER BY id DESC`
    : `${PRODUCT_SELECT} ORDER BY id DESC`;
  const params = department ? [department] : [];

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
    return res.status(200).json({ success: true, data: results.map(mapProductRow) });
  });
};

const getProductById = (req, res) => {
  const productId = Number(req.params.id);
  if (!productId || Number.isNaN(productId)) {
    return res.status(400).json({ message: 'Valid product id is required' });
  }

  db.query(`${PRODUCT_SELECT} WHERE id = ?`, [productId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch product', error: err.message });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: mapProductRow(rows[0]) });
  });
};

const createProduct = (req, res) => {
  const {
    department,
    name,
    price,
    oldPrice,
    rating,
    reviews,
    color,
    image,
    images,
    description,
  } = req.body;

  const validDepartments = ['electronics', 'groceries', 'clothing', 'home-kitchen'];
  if (!department || !validDepartments.includes(department)) {
    return res.status(400).json({ message: 'Department must be electronics, groceries, clothing, or home-kitchen' });
  }

  if (!name || price === undefined || price === null || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'Name and valid price are required' });
  }

  if (!image || !String(image).trim()) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  const normalizedDescription = description?.trim() || null;
  const normalizedImages = Array.isArray(images)
    ? images.filter((url) => typeof url === 'string' && url.trim()).map((url) => url.trim())
    : [];

  const payload = [
    department,
    name.trim(),
    Number(price),
    oldPrice === undefined || oldPrice === null || oldPrice === '' ? null : Number(oldPrice),
    rating === undefined || rating === null || rating === '' ? 0 : Number(rating),
    reviews === undefined || reviews === null || reviews === '' ? 0 : Number(reviews),
    color?.trim() || null,
    String(image).trim(),
    normalizedImages.length ? JSON.stringify(normalizedImages) : null,
    normalizedDescription,
  ];

  db.query(
    `INSERT INTO products (
      department, name, price, old_price, rating, reviews_count, color, image_url, images_json, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    payload,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to create product', error: err.message });
      }

      db.query(
        `${PRODUCT_SELECT} WHERE id = ?`,
        [result.insertId],
        (fetchErr, rows) => {
          if (fetchErr) {
            return res.status(500).json({ message: 'Product created, but failed to fetch created record', error: fetchErr.message });
          }
          return res.status(201).json({ success: true, message: 'Product created successfully', data: mapProductRow(rows[0]) });
        }
      );
    }
  );
};

const updateProduct = (req, res) => {
  const productId = Number(req.params.id);
  if (!productId || Number.isNaN(productId)) {
    return res.status(400).json({ message: 'Valid product id is required' });
  }

  const {
    department,
    name,
    price,
    oldPrice,
    rating,
    reviews,
    color,
    image,
    images,
    description,
  } = req.body;

  const validDepartments = ['electronics', 'groceries', 'clothing', 'home-kitchen'];
  if (!department || !validDepartments.includes(department)) {
    return res.status(400).json({ message: 'Department must be electronics, groceries, clothing, or home-kitchen' });
  }

  if (!name || price === undefined || price === null || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'Name and valid price are required' });
  }

  if (!image || !String(image).trim()) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  const normalizedDescription = description?.trim() || null;
  const normalizedImages = Array.isArray(images)
    ? images.filter((url) => typeof url === 'string' && url.trim()).map((url) => url.trim())
    : [];

  const payload = [
    department,
    name.trim(),
    Number(price),
    oldPrice === undefined || oldPrice === null || oldPrice === '' ? null : Number(oldPrice),
    rating === undefined || rating === null || rating === '' ? 0 : Number(rating),
    reviews === undefined || reviews === null || reviews === '' ? 0 : Number(reviews),
    color?.trim() || null,
    String(image).trim(),
    normalizedImages.length ? JSON.stringify(normalizedImages) : null,
    normalizedDescription,
    productId,
  ];

  db.query(
    `UPDATE products
      SET department = ?,
          name = ?,
          price = ?,
          old_price = ?,
          rating = ?,
          reviews_count = ?,
          color = ?,
          image_url = ?,
          images_json = ?,
          description = ?
      WHERE id = ?`,
    payload,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update product', error: err.message });
      }

      if (!result.affectedRows) {
        return res.status(404).json({ message: 'Product not found' });
      }

      db.query(`${PRODUCT_SELECT} WHERE id = ?`, [productId], (fetchErr, rows) => {
        if (fetchErr) {
          return res.status(500).json({ message: 'Product updated, but failed to fetch updated record', error: fetchErr.message });
        }
        return res.status(200).json({ success: true, message: 'Product updated successfully', data: mapProductRow(rows[0]) });
      });
    }
  );
};

const deleteProduct = (req, res) => {
  const productId = Number(req.params.id);
  if (!productId || Number.isNaN(productId)) {
    return res.status(400).json({ message: 'Valid product id is required' });
  }

  db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  });
};

export { getProducts, createProduct, getProductById, updateProduct, deleteProduct };
