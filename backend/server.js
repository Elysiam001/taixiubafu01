const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const GameEngine = require('./socket/gameEngine');
const GameHistory = require('./models/GameHistory');
const Bet = require('./models/Bet');

const app = express();
const server = http.createServer(app);

// Cấu hình CORS động cho Production
const allowedOrigins = [
  "http://localhost:5173", 
  "https://your-frontend-domain.vercel.app" // Thay bằng domain Vercel của bạn sau khi deploy
];

const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả để test nhanh
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "*", // Cho phép tất cả để test nhanh
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-auth-token"]
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taixiu')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const gameEngine = new GameEngine(io);

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username: user.username, balance: user.balance, role: user.role } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username: user.username, balance: user.balance, role: user.role } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/api/user/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

app.get('/api/game/history', async (req, res) => {
  const history = await GameHistory.find().sort({ createdAt: -1 }).limit(20);
  res.json(history);
});

// Admin Routes
app.get('/api/admin/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const users = await User.find().select('-password');
  res.json(users);
});

app.post('/api/admin/update-balance', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { userId, amount } = req.body;
  const user = await User.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true });
  res.json(user);
});

// Socket logic
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private channel`);
  });

  socket.on('place_bet', async (data) => {
    const { userId, amount, choice } = data;
    const result = await gameEngine.placeBet(userId, amount, choice);
    if (result.error) {
      socket.emit('bet_error', result.error);
    } else {
      socket.emit('bet_success', { amount, choice, balance: result.balance });
      // Broadcast total bets for visual feedback
      io.emit('total_bets_update', {
        choice,
        amount
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
