const AISignalGenerator = require('../ai/signalGenerator');
const aiGenerator = new AISignalGenerator();

const getAISignals = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Fetch recent price data (mock data for now)
    const priceData = await getMockPriceData(symbol);
    
    // Generate AI signal
    const signal = await aiGenerator.generateSignal(symbol, priceData);
    
    if (!signal) {
      return res.status(500).json({ error: 'Failed to generate signal' });
    }
    
    res.json(signal);
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMockPriceData = async (symbol) => {
  // Mock price data - replace with real API call
  const basePrice = 45000;
  const data = [];
  
  for (let i = 0; i < 100; i++) {
    const price = basePrice + (Math.random() - 0.5) * 5000;
    data.push({
      timestamp: new Date(Date.now() - (100 - i) * 3600000),
      open: price,
      high: price * 1.02,
      low: price * 0.98,
      close: price,
      volume: Math.random() * 1000000
    });
  }
  
  return data;
};

module.exports = {
  getAISignals
};