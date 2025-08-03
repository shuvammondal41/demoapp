const axios = require('axios');

async function fetchPrices(symbols = ['bitcoin', 'ethereum', 'solana']) {
  const ids = symbols.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  const res = await axios.get(url);
  return res.data;
}

module.exports = { fetchPrices };
