import React, { useState } from 'react';
import AISignals from './AISignals';
import PriceChart from './PriceChart';
import './TradingView.css';

const TradingView = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'DOT', name: 'Polkadot' }
  ];

  return (
    <div className="trading-view">
      <div className="trading-header">
        <h2>Trading Dashboard</h2>
        <select 
          value={selectedSymbol} 
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="crypto-selector"
        >
          {cryptos.map(crypto => (
            <option key={crypto.symbol} value={crypto.symbol}>
              {crypto.name} ({crypto.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="trading-content">
        <div className="chart-section">
          <PriceChart symbol={selectedSymbol} />
        </div>
        
        <div className="signals-section">
          <AISignals symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
};

export default TradingView;