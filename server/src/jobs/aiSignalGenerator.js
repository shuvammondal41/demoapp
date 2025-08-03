const technicalAnalyzer = require('../utils/technicalAnalyzer');
const sentimentAnalyzer = require('../utils/sentimentAnalyzer');
const fs = require('fs');
const path = require('path');

class AISignalJob {
  constructor(io) {
    this.io = io;
    this.symbols = ['BTC', 'ETH', 'SOL']; // Add more if needed
    this.outputPath = path.join(__dirname, '..', 'data', 'ai-signals.json');
    this.start();
  }

  async start() {
    setInterval(async () => {
      const results = [];

      for (const symbol of this.symbols) {
        const technical = await technicalAnalyzer.analyze(symbol);
        const sentiment = await sentimentAnalyzer.analyze(symbol);

        const finalSignal = this.combine(technical, sentiment);

        results.push({ symbol, signal: finalSignal, timestamp: Date.now() });
      }

      fs.writeFileSync(this.outputPath, JSON.stringify(results, null, 2));

      // 🔥 Emit via WebSocket
      this.io.to('ai-signals').emit('ai-signals-update', results);
      console.log('[AI Job] Broadcasted AI signals');
    }, 15000); // Every 15 seconds
  }

  combine(technical, sentiment) {
    const combined = technical === sentiment ? technical : 'hold';
    return combined;
  }
}

module.exports = AISignalJob;
