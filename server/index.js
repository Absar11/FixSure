const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Dynamically match the request origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Pass io to request object so it can be used in routes
app.set('io', io);

app.get('/api/ping', (req, res) => res.send('pong'));

// Routes
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.io connection logging
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixsure')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
