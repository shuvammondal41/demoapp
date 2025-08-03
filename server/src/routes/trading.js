const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const authMiddleware = require('../utils/authMiddleware');

// @route   POST /api/trade
// @desc    Execute a buy/sell trade
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { type, asset, quantity, price } = req.body;

  if (!['buy', 'sell'].includes(type)) {
    return res.status(400).json({ msg: 'Invalid trade type.' });
  }

  try {
    const newTrade = new Trade({
      user: req.user.id,
      type,
      asset,
      quantity,
      price,
      timestamp: new Date(),
    });

    await newTrade.save();
    res.status(201).json(newTrade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/trade/history
// @desc    Get user's trade history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
