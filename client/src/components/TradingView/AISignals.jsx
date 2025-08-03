import React from 'react';
import useAISignals from '../../hooks/useAISignals';
import './AISignals.css';

const AISignals = ({ symbol = 'BTC' }) => {
  const { signals, loading } = useAISignals(symbol);

  if (loading) {
    return <div className="ai-signals-loading">Loading AI signals...</div>;
  }

  return (
    <div className="ai-signals">
      <h3>🤖 AI Trading Signals</h3>
      {signals.length === 0 ? (
        <div className="no-signals">No signals available</div>
      ) : (
        signals.map((signal, index) => (
          <div key={index} className={`signal ${signal.signal.toLowerCase()}`}>
            <div className="signal-header">
              <span className={`signal-type ${signal.signal.toLowerCase()}`}>
                {signal.signal}
              </span>
              <span className="confidence">
                {Math.round(signal.confidence * 100)}% confidence
              </span>
            </div>
            
            <div className="signal-details">
              <div className="risk-level">
                Risk: <span className={`risk ${signal.riskLevel.toLowerCase()}`}>
                  {signal.riskLevel}
                </span>
              </div>
              
              {signal.targetPrice && (
                <div className="price-targets">
                  <div>Target: ${signal.targetPrice.toLocaleString()}</div>
                  {signal.stopLoss && (
                    <div>Stop Loss: ${signal.stopLoss.toLocaleString()}</div>
                  )}
                </div>
              )}
              
              <div className="reasoning">{signal.reasoning}</div>
              
              <div className="timestamp">
                {new Date(signal.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AISignals;