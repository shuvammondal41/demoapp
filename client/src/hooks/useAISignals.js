import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const useAISignals = (symbol) => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    // Join AI signals room
    newSocket.emit('subscribe-ai-signals', [symbol]);
    
    // Listen for real-time signals
    newSocket.on('ai-signal', (signal) => {
      if (signal.symbol === symbol) {
        setSignals(prev => [signal, ...prev.slice(0, 9)]); // Keep last 10 signals
      }
    });

    return () => newSocket.close();
  }, [symbol]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/ai/signals/${symbol}`);
        setSignals([response.data]);
      } catch (error) {
        console.error('Error fetching AI signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
    
    // Refresh signals every 5 minutes
    const interval = setInterval(fetchSignals, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  return { signals, loading };
};

export default useAISignals;