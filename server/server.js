require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const app = require('./app');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const answerRoutes = require('./routes/answerRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message');

app.use('/api/auth', authRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Real-time Chat Logic
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
    io.emit('userStatus', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, text } = data;

    try {
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text
      });

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
      }

      // Also send back to sender for confirmation/sync if needed (though client usually manages local state)
      socket.emit('messageSent', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
    io.emit('userStatus', Array.from(onlineUsers.keys()));
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

