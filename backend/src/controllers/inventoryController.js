const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, type } = req.query;
    let queryText = `
      SELECT p.id, p.barcode, p.sku, p.name, p.hindi_name, p.category, p.is_loose, p.base_unit,
             b.id AS batch_id, b.batch_number, b.mrp, b.selling_price, b.current_stock, b.expiry_date, b.is_short_shelf_life
      FROM products p
      JOIN product_batches b ON p.id = b.product_id
      WHERE b.current_stock > 0
    `;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (p.name ILIKE $${params.length} OR p.hindi_name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      queryText += ` AND p.category = $${params.length}`;
    }
    if (type === 'loose') queryText += ` AND p.is_loose = TRUE`;
    else if (type === 'packed') queryText += ` AND p.is_loose = FALSE`;

    queryText += ` ORDER BY p.name ASC;`;
    const result = await db.query(queryText, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, b.id as batch_id, b.batch_number, b.mrp, b.selling_price, b.current_stock, b.expiry_date
      FROM products p
      JOIN product_batches b ON p.id = b.product_id
      WHERE p.id = $1 AND b.current_stock > 0 LIMIT 1;
    `;
    const result = await db.query(query, [id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const nearExpiry = await db.query(`
      SELECT p.name, b.batch_number, b.current_stock, b.expiry_date, (b.expiry_date - CURRENT_DATE) AS days_left
      FROM product_batches b
      JOIN products p ON b.product_id = p.id
      WHERE b.expiry_date BETWEEN CURRENT_DATE + INTERVAL '30 days' AND CURRENT_DATE + INTERVAL '45 days'
        AND b.current_stock > 0;
    `);

    const perishables = await db.query(`
      SELECT p.name, b.batch_number, b.current_stock, b.expiry_date, (b.expiry_date - CURRENT_DATE) AS days_left
      FROM product_batches b
      JOIN products p ON b.product_id = p.id
      WHERE (b.expiry_date <= CURRENT_DATE + INTERVAL '7 days' OR b.is_short_shelf_life = TRUE)
        AND b.current_stock > 0;
    `);

    const deadStock = await db.query(`
      SELECT p.name, p.category, p.base_unit, b.batch_number, b.current_stock, b.inward_date,
             (b.current_stock * b.cost_price) AS capital_blocked
      FROM product_batches b
      JOIN products p ON b.product_id = p.id
      WHERE b.inward_date <= CURRENT_DATE - INTERVAL '1 year' AND b.current_stock > 0;
    `);

    const lowStock = await db.query(`
      SELECT p.name, p.base_unit, p.reorder_threshold, SUM(b.current_stock) as total_stock
      FROM products p
      JOIN product_batches b ON p.id = b.product_id
      GROUP BY p.id, p.name, p.base_unit, p.reorder_threshold
      HAVING SUM(b.current_stock) <= p.reorder_threshold;
    `);

    const salesByDate = await db.query(`
      SELECT sold_at, COUNT(DISTINCT order_id) AS orders_count, SUM(subtotal) AS total_revenue
      FROM order_items
      GROUP BY sold_at
      ORDER BY sold_at DESC
      LIMIT 7;
    `);

    res.json({
      success: true,
      analytics: {
        nearExpiryAlerts: nearExpiry.rows,
        quickSalePerishables: perishables.rows,
        agingStockOverOneYear: deadStock.rows,
        lowStockItems: lowStock.rows,
        dailySalesLedger: salesByDate.rows
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
