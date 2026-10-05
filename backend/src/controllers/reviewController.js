const db = require('../config/db');
exports.submitReview = async (req, res) => {
  const { order_id, rating, customer_name, feedback_text } = req.body;
  await db.query(`INSERT INTO store_reviews (order_id, rating, customer_name, feedback_text) VALUES ($1, $2, $3, $4)`, [order_id || null, rating, customer_name || 'Anonymous', feedback_text]);
  res.json({ success: true, message: 'Rating saved!' });
};
exports.getStoreReviews = async (req, res) => {
  const r = await db.query(`SELECT * FROM store_reviews ORDER BY created_at DESC LIMIT 20;`);
  res.json({ success: true, reviews: r.rows });
};
