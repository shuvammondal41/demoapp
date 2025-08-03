import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AISignalFeed.css'; // optional styling

const AISignalFeed = () => {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/signals');
        setSignals(res.data.reverse()); // latest first
      } catch (err) {
        console.error('Error fetching AI signals:', err.message);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ai-signal-feed">
      <h2>📡 AI Signal Feed</h2>
      {signals.length === 0 ? (
        <p>No signals yet...</p>
      ) : (
        <ul>
          {signals.map((signal, idx) => (
            <li key={idx} className={`signal ${signal.signal.toLowerCase()}`}>
              <strong>{signal.symbol.toUpperCase()}</strong> → {signal.signal.toUpperCase()} ({signal.sentiment})
              <br />
              <span className="timestamp">
                {new Date(signal.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AISignalFeed;
