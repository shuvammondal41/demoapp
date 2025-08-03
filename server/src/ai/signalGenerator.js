//const tf = require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const technicalIndicators = require('technicalindicators'); // Correct import
const axios = require('axios');
const Sentiment = require('sentiment');

class AISignalGenerator {
  constructor() {
    this.model = null;
    this.sentiment = new Sentiment();
    this.initializeModel();
  }

  async initializeModel() {
    // Simple neural network for price prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 50, activation: 'relu' }),
        tf.layers.dense({ units: 25, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });
    
    this.model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });
  }

  async generateSignal(symbol, priceData) {
    try {
      // Technical Analysis
      const technicalScore = await this.technicalAnalysis(priceData);
      
      // Sentiment Analysis
      const sentimentScore = await this.sentimentAnalysis(symbol);
      
      // Price Prediction
      const pricePredict = await this.pricePredictor(priceData);
      
      // Risk Assessment
      const riskLevel = this.riskAssessment(priceData);
      
      // Generate combined signal
      const signal = this.combineSignals(technicalScore, sentimentScore, pricePredict);
      
      return {
        symbol,
        signal: signal.type, // 'BUY', 'SELL', 'HOLD'
        confidence: signal.confidence,
        riskLevel,
        targetPrice: signal.targetPrice,
        stopLoss: signal.stopLoss,
        reasoning: signal.reasoning,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error generating AI signal:', error);
      return null;
    }
  }

  async technicalAnalysis(priceData) {
    const closes = priceData.map(d => d.close);
    const highs = priceData.map(d => d.high);
    const lows = priceData.map(d => d.low);

    try {
      // RSI (Relative Strength Index)
      const rsiInput = {
        values: closes,
        period: 14
      };
      const rsi = technicalIndicators.RSI.calculate(rsiInput);

      // MACD
      const macdInput = {
        values: closes,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
      };
      const macd = technicalIndicators.MACD.calculate(macdInput);

      // Simple Moving Average
      const smaInput = {
        period: 20,
        values: closes
      };
      const sma = technicalIndicators.SMA.calculate(smaInput);

      // Calculate technical score
      const latestRSI = rsi[rsi.length - 1] || 50;
      const latestMACD = macd[macd.length - 1];
      const latestSMA = sma[sma.length - 1];
      const currentPrice = closes[closes.length - 1];

      let score = 0;
      
      // RSI signals
      if (latestRSI < 30) score += 0.3; // Oversold - Buy signal
      if (latestRSI > 70) score -= 0.3; // Overbought - Sell signal
      
      // MACD signals
      if (latestMACD && latestMACD.MACD > latestMACD.signal) score += 0.2;
      if (latestMACD && latestMACD.MACD < latestMACD.signal) score -= 0.2;
      
      // SMA trend
      if (currentPrice > latestSMA) score += 0.1; // Above SMA - bullish
      if (currentPrice < latestSMA) score -= 0.1; // Below SMA - bearish

      return Math.max(-1, Math.min(1, score)); // Normalize between -1 and 1
    } catch (error) {
      console.error('Technical analysis error:', error);
      return 0; // Neutral if error
    }
  }

  async sentimentAnalysis(symbol) {
    try {
      // Simple sentiment analysis using mock news data
      // In production, integrate with news APIs
      const mockNews = [
        `${symbol} shows strong bullish momentum`,
        `Positive outlook for ${symbol} cryptocurrency`,
        `${symbol} adoption continues to grow`
      ];

      let totalSentiment = 0;
      let count = 0;

      mockNews.forEach(text => {
        const result = this.sentiment.analyze(text);
        totalSentiment += result.score;
        count++;
      });

      return count > 0 ? Math.max(-1, Math.min(1, totalSentiment / count / 5)) : 0;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return 0;
    }
  }

  async pricePredictor(priceData) {
    // Simple prediction based on recent trend
    const closes = priceData.map(d => d.close);
    const recentPrices = closes.slice(-10);
    const currentPrice = closes[closes.length - 1];
    
    // Calculate simple moving average
    const sma = recentPrices.reduce((a, b) => a + b) / recentPrices.length;
    
    // Predict direction based on current price vs SMA
    const prediction = currentPrice > sma ? 0.1 : -0.1;
    
    return prediction;
  }

  riskAssessment(priceData) {
    const closes = priceData.map(d => d.close);
    const returns = [];
    
    for (let i = 1; i < closes.length; i++) {
      returns.push((closes[i] - closes[i-1]) / closes[i-1]);
    }
    
    // Calculate volatility (standard deviation of returns)
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    
    if (volatility < 0.02) return 'LOW';
    if (volatility < 0.05) return 'MEDIUM';
    return 'HIGH';
  }

  combineSignals(technical, sentiment, prediction) {
    const combined = (technical * 0.5) + (sentiment * 0.3) + (prediction * 0.2);
    const confidence = Math.abs(combined);
    
    let signalType = 'HOLD';
    let reasoning = 'Neutral market conditions';
    
    if (combined > 0.3) {
      signalType = 'BUY';
      reasoning = 'Strong bullish signals detected';
    } else if (combined < -0.3) {
      signalType = 'SELL';
      reasoning = 'Strong bearish signals detected';
    }
    
    return {
      type: signalType,
      confidence: Math.min(confidence * 2, 1), // Scale confidence
      reasoning,
      targetPrice: null, // Calculate based on analysis
      stopLoss: null     // Calculate based on risk
    };
  }
}

module.exports = AISignalGenerator;