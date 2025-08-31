# 🔧 食光家后端配置详解

## 📋 目录
- [环境要求](#环境要求)
- [快速配置](#快速配置)
- [数据库配置](#数据库配置)
- [文心API配置](#文心api配置)
- [手动配置](#手动配置)
- [Docker配置](#docker配置)
- [常见问题](#常见问题)

## 🎯 环境要求

### 必需软件
- **Node.js**: 16.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **MongoDB**: 5.0 或更高版本
- **Redis**: 6.0 或更高版本

### 可选软件
- **Docker**: 20.10 或更高版本（推荐）
- **Docker Compose**: 2.0 或更高版本

## ⚡ 快速配置

### 1. 自动配置（推荐）
```bash
# 进入后端目录
cd backend

# 运行配置向导
node setup-config.js

# 使用启动脚本
# Windows
start.bat

# Linux/macOS
./start.sh
```

### 2. 一键启动
```bash
# 使用Docker Compose启动所有服务
docker-compose up -d

# 启动后端应用
npm run dev
```

## 📊 数据库配置

### MongoDB配置

#### 本地安装
1. **Windows**
   - 下载 [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - 安装并启动服务：`net start MongoDB`

2. **macOS**
   ```bash
   brew install mongodb-community
   brew services start mongodb-community
   ```

3. **Ubuntu/Debian**
   ```bash
   sudo apt update
   sudo apt install mongodb
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

#### 云数据库（推荐）
- **MongoDB Atlas**: 免费层500MB
- **阿里云MongoDB**: 国内访问快
- **腾讯云MongoDB**: 性价比高

#### 连接字符串格式
```bash
# 本地无密码
MONGODB_URI=mongodb://localhost:27017/cooking_mind

# 本地有密码
MONGODB_URI=mongodb://username:password@localhost:27017/cooking_mind

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cooking_mind?retryWrites=true&w=majority

# 阿里云MongoDB
MONGODB_URI=mongodb://username:password@host:port/cooking_mind
```

### Redis配置

#### 本地安装
1. **Windows**
   - 下载 [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
   - 启动服务：`redis-server`

2. **macOS**
   ```bash
   brew install redis
   brew services start redis
   ```

3. **Ubuntu/Debian**
   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

#### 云Redis（推荐）
- **阿里云Redis**: 国内访问快
- **腾讯云Redis**: 性价比高
- **AWS ElastiCache**: 全球部署

#### 连接字符串格式
```bash
# 本地无密码
REDIS_URL=redis://localhost:6379

# 本地有密码
REDIS_URL=redis://:password@localhost:6379

# 云Redis
REDIS_URL=redis://:password@host:port
```

## 🔑 文心API配置

### 1. 获取API密钥
1. 访问 [百度智能云](https://cloud.baidu.com/)
2. 注册/登录账号
3. 开通文心大模型服务
4. 在控制台获取API Key和Secret Key

### 2. 开通服务
确保已开通以下服务：
- ✅ 文心一言对话服务
- ✅ 文心一格图像生成
- ✅ 语音识别服务
- ✅ 图像识别服务

### 3. 配置环境变量
```bash
# 文心API配置
ERNIE_API_KEY=your_ernie_api_key_here
ERNIE_SECRET_KEY=your_ernie_secret_key_here
```

**注意**: 不需要手动设置 `ERNIE_ACCESS_TOKEN`，系统会自动获取。

### 4. 测试API连接
```bash
# 启动服务后检查日志
npm run dev

# 应该看到：
# 🔑 文心API配置检查通过
```

## 🛠️ 手动配置

### 1. 创建环境变量文件
```bash
# 复制示例文件
cp env.example .env

# 编辑配置文件
# Windows
notepad .env

# Linux/macOS
nano .env
```

### 2. 配置内容示例
```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/cooking_mind
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your_super_secret_jwt_key_2024_cooking_mind_app
JWT_EXPIRES_IN=7d

# 文心大模型API配置
ERNIE_API_KEY=your_ernie_api_key_here
ERNIE_SECRET_KEY=your_ernie_secret_key_here

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 3. 生成JWT密钥
```bash
# 使用Node.js生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🐳 Docker配置

### 1. 启动数据库服务
```bash
# 启动MongoDB和Redis
docker-compose up -d mongo redis

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs mongo
docker-compose logs redis
```

### 2. 管理界面访问
- **MongoDB管理**: http://localhost:8081
  - 用户名: admin
  - 密码: password123

- **Redis管理**: http://localhost:8082

### 3. 数据持久化
```bash
# 查看数据卷
docker volume ls

# 备份数据
docker exec cooking_mind_mongo mongodump --out /data/backup
docker cp cooking_mind_mongo:/data/backup ./backup

# 恢复数据
docker exec -i cooking_mind_mongo mongorestore --drop /data/backup
```

## 🔍 常见问题

### 1. MongoDB连接失败
**错误信息**: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**解决方案**:
```bash
# 检查MongoDB服务状态
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod

# 检查端口占用
netstat -an | grep 27017
```

### 2. Redis连接失败
**错误信息**: `Redis connection to 127.0.0.1:6379 failed`

**解决方案**:
```bash
# 检查Redis服务状态
# Windows
redis-cli ping

# macOS/Linux
sudo systemctl status redis-server

# 检查端口占用
netstat -an | grep 6379
```

### 3. 文心API调用失败
**错误信息**: `获取文心API访问令牌失败`

**解决方案**:
1. 检查API Key和Secret Key是否正确
2. 确认服务是否已开通
3. 检查网络连接
4. 验证API调用频率限制

### 4. JWT认证失败
**错误信息**: `JsonWebTokenError: invalid signature`

**解决方案**:
1. 检查JWT_SECRET是否设置
2. 确认密钥长度足够（建议32位以上）
3. 验证token是否过期
4. 重启服务

### 5. 端口被占用
**错误信息**: `EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查看端口占用
netstat -ano | findstr :3000

# 修改端口（在.env文件中）
PORT=3001
```

## 📞 技术支持

### 检查清单
- [ ] Node.js版本 >= 16.0.0
- [ ] MongoDB服务正在运行
- [ ] Redis服务正在运行
- [ ] 环境变量配置正确
- [ ] 文心API密钥有效
- [ ] 网络连接正常
- [ ] 防火墙设置正确

### 获取帮助
1. 查看控制台错误日志
2. 检查服务状态
3. 验证配置文件
4. 参考完整README文档
5. 检查网络连接

## 🚀 下一步

配置完成后，您可以：
1. 启动后端服务：`npm run dev`
2. 测试API接口
3. 连接前端应用
4. 开始使用AI功能

祝您使用愉快！🎉
