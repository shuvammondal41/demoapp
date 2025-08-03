import React from 'react';
import TradingView from './components/TradingView/TradingView';
import AISignalFeed from './components/AISignalFeed'; // ✅ import AI signal component
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Crypto AI Trader</h1>
        <nav>
          <button className="nav-btn">Dashboard</button>
          <button className="nav-btn">Portfolio</button>
          <button className="nav-btn">Wallet</button>
        </nav>
      </header>

      <main className="app-main">
        <TradingView />
        <AISignalFeed /> {/* ✅ AI signal feed right below chart */}
      </main>
    </div>
  );
}

export default App;
