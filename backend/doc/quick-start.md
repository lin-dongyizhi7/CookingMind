# 🚀 食光家后端快速启动指南

## 📋 前置要求

- Node.js 16+ 
- MongoDB 5+
- Redis 6+

## ⚡ 快速启动步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 运行配置向导
```bash
node setup-config.js
```

### 3. 启动数据库服务

#### 方式一：使用Docker（推荐）
```bash
# 启动MongoDB和Redis
docker-compose up -d mongo redis

# 查看服务状态
docker-compose ps
```

#### 方式二：本地安装
- **MongoDB**: 下载并安装 [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Redis**: 下载并安装 [Redis for Windows](https://github.com/microsoftarchive/redis/releases)

### 4. 启动后端服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 🔍 验证服务状态

启动成功后，您应该看到以下日志：
```
✅ MongoDB 连接成功: localhost
✅ Redis 连接成功
🔑 文心API配置检查通过
🚀 服务器启动成功，端口: 3000
```

## 🌐 测试API接口

访问以下地址测试服务：
- 健康检查: http://localhost:3000/api/health
- API文档: http://localhost:3000/api/docs

## 🐛 常见问题解决

### MongoDB连接失败
```bash
# 检查MongoDB服务状态
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### Redis连接失败
```bash
# 检查Redis服务状态
# Windows
redis-cli ping

# macOS/Linux
sudo systemctl status redis
```

### 端口被占用
```bash
# 查看端口占用
netstat -ano | findstr :3000

# 修改端口（在.env文件中）
PORT=3001
```

## 📱 前端连接

前端开发服务器默认运行在 `http://localhost:5173`，确保后端API地址配置正确。

## 🔧 开发工具推荐

- **MongoDB**: MongoDB Compass
- **Redis**: Another Redis Desktop Manager
- **API测试**: Postman 或 Insomnia
- **代码编辑**: VS Code

## 📞 获取帮助

如果遇到问题：
1. 检查环境变量配置
2. 确认数据库服务状态
3. 查看控制台错误日志
4. 参考完整README文档
