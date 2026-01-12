const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
    }
});

// In-memory mapping: userId → socketId
const userSocketMap = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Register user's socket when they authenticate
    socket.on('register', (userId) => {
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        }
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
        // Find and remove the user from the map
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

// Make io and userSocketMap accessible to routes
app.set('io', io);
app.set('userSocketMap', userSocketMap);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Placeholder for Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

app.get('/', (req, res) => {
    res.send('GigFlow API is running...');
});

// Start Server with Socket.IO
connectDB().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
});

