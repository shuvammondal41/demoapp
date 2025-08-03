const { fetchPrices } = require('../services/priceService');

class PriceUpdater {
  constructor(io) {
    this.io = io;
    this.symbols = ['bitcoin', 'ethereum', 'solana'];
    this.start();
  }

  async start() {
    setInterval(async () => {
      try {
        const prices = await fetchPrices(this.symbols);
        this.io.to('price-updates').emit('price-update', prices);
        console.log('[Price Job] Sent price updates:', prices);
      } catch (err) {
        console.error('[Price Job] Error fetching prices:', err.message);
      }
    }, 10000); // Every 10 seconds
  }
}

module.exports = PriceUpdater;
