const mongoose = require('mongoose');

const aiSignalSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  signal: { type: String, enum: ['buy', 'sell', 'hold'], required: true },
  confidence: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AISignal', aiSignalSchema);
