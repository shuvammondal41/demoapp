const express = require('express');
const router = express.Router();

// Dummy price data (replace with real API later)
router.get('/', (req, res) => {
  res.json([
    { symbol: 'BTC', price: 29200.55 },
    { symbol: 'ETH', price: 1800.15 },
    { symbol: 'SOL', price: 24.8 }
  ]);
});

module.exports = router;
