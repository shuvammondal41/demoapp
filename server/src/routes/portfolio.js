const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const authMiddleware = require('../middleware/auth');

// GET user portfolio
router.get('/', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE portfolio: add/update asset
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { symbol, amount, avgBuyPrice } = req.body;

    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user.id, assets: [] });
    }

    const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol.toUpperCase());

    if (assetIndex > -1) {
      // Update existing asset
      portfolio.assets[assetIndex].amount = amount;
      portfolio.assets[assetIndex].avgBuyPrice = avgBuyPrice;
    } else {
      // Add new asset
      portfolio.assets.push({ symbol: symbol.toUpperCase(), amount, avgBuyPrice });
    }

    await portfolio.save();
    res.json({ message: 'Portfolio updated', portfolio });
  } catch (err) {
    console.error('Error updating portfolio:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
