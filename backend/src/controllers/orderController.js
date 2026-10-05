const db = require('../config/db');

exports.createOrder = async (req, res) => {
  try {
    const { phone_number, full_name, address, items, confirmation_checked, payment_mode } = req.body;
    if (!confirmation_checked) return res.status(400).json({ success: false, message: 'Checkbox confirmation required.' });
    if (!items || !items.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });

    let cust = await db.query(`SELECT id FROM customers WHERE phone_number = $1`, [phone_number]);
    let cid = cust.rows[0]?.id;
    if (!cid) {
      const nc = await db.query(`INSERT INTO customers (phone_number, full_name, address) VALUES ($1, $2, $3) RETURNING id`, [phone_number, full_name || 'Customer', address || 'Address']);
      cid = nc.rows[0].id;
    }

    const total = items.reduce((acc, i) => acc + (parseFloat(i.price) * parseFloat(i.quantity)), 0);
    const ord = await db.query(`INSERT INTO orders (customer_id, total_amount, payment_mode, confirmation_checked) VALUES ($1, $2, $3, $4) RETURNING id`, [cid, total, payment_mode || 'UPI', true]);
    const orderId = ord.rows[0].id;

    for (const item of items) {
      await db.query(`INSERT INTO order_items (order_id, product_id, batch_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5, $6)`, [orderId, item.product_id, item.batch_id, item.quantity, item.price, item.price * item.quantity]);
      await db.query(`UPDATE product_batches SET current_stock = current_stock - $1 WHERE id = $2`, [item.quantity, item.batch_id]);
    }
    res.json({ success: true, orderId, totalAmount: total });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};
