// /server/src/utils/sentimentAnalyzer.js

async function analyze(symbol) {
  const sentiments = ['positive', 'neutral', 'negative'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

  return {
    sentiment,
    score: Math.random().toFixed(2),
  };
}

module.exports = {
  analyze,
};
