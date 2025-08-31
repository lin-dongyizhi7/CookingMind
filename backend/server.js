const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const config = require('./config/environment');

// 加载环境变量
dotenv.config();

// 验证配置
if (!config.validate()) {
  console.warn('⚠️  配置验证失败，但程序继续运行');
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.frontend.URL,
    methods: ["GET", "POST"]
  }
});

// 中间件
app.use(cors({
  origin: config.frontend.URL,
  credentials: true
}));
app.use(express.json({ limit: config.upload.MAX_FILE_SIZE }));
app.use(express.urlencoded({ extended: true, limit: config.upload.MAX_FILE_SIZE }));

// 静态文件服务
app.use('/uploads', express.static(config.upload.PATH));

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
  
  // 根据环境返回不同的错误信息
  const errorResponse = {
    success: false,
    message: '服务器内部错误',
    ...(config.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
  };
  
  res.status(500).json(errorResponse);
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '接口不存在' 
  });
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

const PORT = config.PORT;

server.listen(PORT, () => {
  console.log('🚀 食光家后端服务器启动成功!');
  config.printInfo();
  console.log(`🎯 健康检查: http://localhost:${PORT}/health`);
});

module.exports = { app, io };
