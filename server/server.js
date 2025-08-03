const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/trading', require('./src/routes/trading'));
app.use('/api/portfolio', require('./src/routes/portfolio'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/prices', require('./src/routes/prices'));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe-prices', (symbols) => {
    socket.join('price-updates');
  });

  socket.on('subscribe-ai-signals', (symbols) => {
    socket.join('ai-signals');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start AI Signal background job
const AISignalJob = require('./src/jobs/aiSignalGenerator');
const aiJob = new AISignalJob(io);

//AISignalJob
const PriceUpdater = require('./src/jobs/priceUpdater');
const priceJob = new PriceUpdater(io);

//server.js
const aiSignalRoutes = require('./src/routes/aiSignals');
app.use('/api/signals', aiSignalRoutes);


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
