const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Message = require('./models/ProcessedMessage');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const messageRoutes = require('./routes/messageRoutes')(io);
app.use('/api/messages', messageRoutes);

// 🔄 Socket.io connection
io.on('connection', (socket) => {
  console.log('🟢 New client connected');

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// 🔍 Real-time MongoDB Change Stream for status updates
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected. Listening for changes...');

  const changeStream = Message.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'update') {
      const updatedFields = change.updateDescription.updatedFields;

      if (updatedFields && updatedFields.status) {
        const messageId = change.documentKey._id;
        const newStatus = updatedFields.status;

        console.log(`🔄 Status update: Message ${messageId} => ${newStatus}`);

        // Emit the status update to all connected clients
        io.emit('statusUpdate', {
          _id: messageId,
          status: newStatus,
        });
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
