const db = require('../config/db');
exports.loginWithPhone = async (req, res) => {
  const { phone_number, full_name } = req.body;
  let user = await db.query(`SELECT * FROM customers WHERE phone_number = $1`, [phone_number]);
  if (!user.rows.length) {
    const cr = await db.query(`INSERT INTO customers (phone_number, full_name) VALUES ($1, $2) RETURNING *`, [phone_number, full_name || 'Customer']);
    return res.json({ success: true, user: cr.rows[0] });
  }
  res.json({ success: true, user: user.rows[0] });
};
