# 🚀 食光家后端服务

食光家家庭餐饮制作多模态应用的后端服务，支持开发和生产环境配置。

## 🌍 环境配置

### 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **设置环境配置**
   ```bash
   # 设置开发环境
   npm run setup:dev
   
   # 设置生产环境
   npm run setup:prod
   ```

3. **启动服务**
   ```bash
   # 开发环境
   npm run dev
   
   # 生产环境
   npm run prod
   ```

### 环境配置管理

使用环境配置管理器：

```bash
# 查看环境状态
node scripts/env-manager.js list

# 设置环境配置
node scripts/env-manager.js setup dev
node scripts/env-manager.js setup production

# 验证配置
node scripts/env-manager.js validate dev
```

### 快速启动

```bash
# 自动检测环境并启动
node scripts/quick-start.js

# 指定环境启动
node scripts/quick-start.js --env production
```

## 🗄️ 数据库配置

### 开发环境

确保本地数据库服务已启动：

```bash
# 使用Docker启动本地数据库
docker-compose up -d

# 或手动启动MongoDB和Redis服务
```

### 生产环境

在 `.env.production` 文件中配置生产数据库连接信息。

## 🔧 脚本说明

- `scripts/env-manager.js` - 环境配置管理工具
- `scripts/quick-start.js` - 快速启动工具
- `scripts/start-dev.bat` - Windows开发环境启动脚本
- `scripts/switch-env.bat` - Windows环境切换脚本
- `scripts/switch-env.sh` - Linux/Mac环境切换脚本

## 📋 配置项

| 配置项 | 说明 | 必需 |
|--------|------|------|
| `NODE_ENV` | 运行环境 | 是 |
| `PORT` | 服务端口 | 否 |
| `MONGODB_URI` | MongoDB连接串 | 是 |
| `REDIS_URL` | Redis连接串 | 是 |
| `JWT_SECRET` | JWT密钥 | 是 |
| `ERNIE_API_KEY` | 文心API密钥 | 是 |
| `ERNIE_SECRET_KEY` | 文心密钥 | 是 |

## 🚀 启动方式

### 方式1：NPM脚本
```bash
npm run dev      # 开发环境
npm run prod     # 生产环境
```

### 方式2：环境切换脚本
```bash
# Windows
scripts\switch-env.bat dev
scripts\switch-env.bat prod

# Linux/Mac
./scripts/switch-env.sh dev
./scripts/switch-env.sh prod
```

### 方式3：快速启动工具
```bash
node scripts/quick-start.js
```

## 🔍 健康检查

启动服务后，访问 `http://localhost:3000/health` 检查服务状态。

## 📚 相关文档

- `ENVIRONMENT_SETUP.md` - 详细的环境配置指南
- 各脚本文件包含使用说明

## 🤝 贡献

如有问题或建议，请提交Issue或Pull Request。
