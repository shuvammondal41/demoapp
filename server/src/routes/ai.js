const express = require('express');
const router = express.Router();
const AISignal = require('../models/AISignal');

// GET latest signals
router.get('/', async (req, res) => {
  try {
    const signals = await AISignal.find().sort({ generatedAt: -1 });
    res.json(signals);
  } catch (err) {
    console.error('Error fetching AI signals:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
