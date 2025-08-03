// /server/src/utils/technicalAnalyzer.js

async function analyze(symbol) {
  const rsi = Math.floor(Math.random() * 100);
  let signal = 'hold';

  if (rsi < 30) signal = 'buy';
  else if (rsi > 70) signal = 'sell';

  return {
    signal,
    rsi,
  };
}

module.exports = {
  analyze,
};
