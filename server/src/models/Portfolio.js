const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assets: [
    {
      symbol: { type: String, required: true },
      amount: { type: Number, required: true },
      avgBuyPrice: { type: Number, required: true }
    }
  ],
  totalValue: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
