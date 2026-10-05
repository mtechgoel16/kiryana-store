const { triggerWhatsAppLowStockAlert } = require('../services/whatsappService');
exports.runInventoryAudit = async () => { await triggerWhatsAppLowStockAlert(); };
