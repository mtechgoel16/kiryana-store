const express = require('express');
const router = express.Router();
const agent = require('../ai/assistantAgent');
router.post('/chat', async (req, res) => {
  const r = await agent.processUserMessage(req.body.message || '');
  res.json({ success: true, ...r });
});
module.exports = router;
