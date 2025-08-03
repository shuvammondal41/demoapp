const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../data/ai-signals.json');

  try {
    if (!fs.existsSync(filePath)) return res.json([]);

    const file = fs.readFileSync(filePath, 'utf-8');
    const signals = JSON.parse(file);
    res.json(signals);
  } catch (err) {
    console.error('[API] Error reading AI signals:', err.message);
    res.status(500).json({ error: 'Failed to load AI signals' });
  }
});

module.exports = router;
