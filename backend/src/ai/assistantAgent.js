const db = require('../config/db');
exports.processUserMessage = async (msg) => {
  const q = msg.toLowerCase().trim();
  if (q.includes('sugar') || q.includes('chini')) {
    const s = await db.query(`SELECT current_stock, selling_price FROM product_batches WHERE product_id = 1 LIMIT 1`);
    return { reply: `Madhur Sugar available hai ₹${s.rows[0].selling_price}/kg. Abhi ${s.rows[0].current_stock} kg stock hai!` };
  }
  return { reply: `Namaste! Main aapka Kiryana AI Assistant hoon. Kisi bhi grocery item ka rate ya stock pooch sakte hain.` };
};
