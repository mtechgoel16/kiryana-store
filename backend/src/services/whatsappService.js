const db = require('../config/db');
async function triggerWhatsAppLowStockAlert() {
  try {
    const res = await db.query(`SELECT p.name, p.base_unit, SUM(b.current_stock) as total_stock FROM products p JOIN product_batches b ON p.id = b.product_id GROUP BY p.id, p.name, p.base_unit, p.reorder_threshold HAVING SUM(b.current_stock) <= p.reorder_threshold;`);
    res.rows.forEach(i => console.log(`[WHATSAPP ALERT] Stock low for ${i.name} (${i.total_stock} ${i.base_unit} left). Reorder within 2 days!`));
  } catch(e) {}
}
module.exports = { triggerWhatsAppLowStockAlert };
