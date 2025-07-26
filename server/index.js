const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const queueService = require('./services/queueService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());

// Routes
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teammaker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start matching engine
  queueService.startMatchingEngine();
})
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Update player's socket ID
  socket.on('registerPlayer', async (playerId) => {
    await Player.findByIdAndUpdate(playerId, { socketId: socket.id });
  });

  // Notify player when matched
  socket.on('joinQueue', (playerId) => {
    socket.join(`player_${playerId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});