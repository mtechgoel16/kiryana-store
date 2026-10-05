require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const aiRoutes = require('./routes/aiRoutes');
const { runInventoryAudit } = require('./ai/inventoryAiAgent');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Kiryana Backend running on port ${PORT}`);
  runInventoryAudit();
});
