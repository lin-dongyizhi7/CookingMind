const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const connectRedis = require('./config/redis');

// 加载环境变量
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 连接数据库
connectDB();
connectRedis();

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/cooking', require('./routes/cooking'));
app.use('/api/nutrition', require('./routes/nutrition'));
app.use('/api/family', require('./routes/family'));

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);
  
  socket.on('join-cooking-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`用户 ${socket.id} 加入烹饪会话 ${sessionId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '接口不存在' 
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 食光家后端服务器运行在端口 ${PORT}`);
  console.log(`📱 环境: ${process.env.NODE_ENV}`);
});

module.exports = { app, io };
