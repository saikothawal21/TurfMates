const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // 👈 wrap the app

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
//app.use('/api/something', someRouter);

// WebSocket logic
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
});

// Final listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
