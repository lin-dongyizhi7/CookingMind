# 🌍 食光家后端环境配置指南

本文档介绍如何配置和管理食光家后端的开发和生产环境。

## 📋 目录

- [环境概述](#环境概述)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [数据库配置](#数据库配置)
- [启动服务](#启动服务)
- [环境切换](#环境切换)
- [故障排除](#故障排除)

## 🌍 环境概述

食光家后端支持两种环境：

- **开发环境 (Development)**: 使用本地数据库，适合开发和测试
- **生产环境 (Production)**: 使用生产数据库，适合正式部署

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 设置环境配置

```bash
# 设置开发环境
npm run setup:dev

# 设置生产环境
npm run setup:prod
```

### 3. 编辑配置文件

根据实际情况编辑 `.env.development` 或 `.env.production` 文件。

### 4. 启动服务

```bash
# 开发环境
npm run dev

# 生产环境
npm run prod
```

## ⚙️ 环境配置

### 配置文件结构

```
backend/
├── .env.development          # 开发环境配置
├── .env.production           # 生产环境配置
├── env.development.example   # 开发环境配置示例
├── env.production.example    # 生产环境配置示例
└── config/
    └── environment.js        # 环境配置管理器
```

### 关键配置项

| 配置项 | 说明 | 开发环境 | 生产环境 |
|--------|------|----------|----------|
| `NODE_ENV` | 运行环境 | `development` | `production` |
| `PORT` | 服务端口 | `3000` | `3000` |
| `MONGODB_URI` | MongoDB连接串 | 本地数据库 | 生产数据库 |
| `REDIS_URL` | Redis连接串 | 本地Redis | 生产Redis |
| `JWT_SECRET` | JWT密钥 | 开发密钥 | 强密钥 |
| `FRONTEND_URL` | 前端地址 | `http://localhost:3001` | 生产域名 |

## 🗄️ 数据库配置

### 开发环境数据库

开发环境使用Docker Compose启动本地数据库服务：

```bash
# 启动数据库服务
docker-compose -f docker-compose.dev.yml up -d

# 查看服务状态
docker-compose -f docker-compose.dev.yml ps

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

### 数据库服务

- **MongoDB**: `mongodb://localhost:27017/cooking_mind_dev`
- **Redis**: `redis://localhost:6379`
- **MongoDB Express**: `http://localhost:8081` (数据库管理界面)

### 生产环境数据库

生产环境需要配置实际的数据库连接信息：

1. 修改 `.env.production` 文件
2. 设置正确的数据库连接串
3. 确保数据库服务可访问

## 🚀 启动服务

### 使用NPM脚本

```bash
# 开发环境
npm run dev

# 生产环境
npm run prod

# 本地开发 (明确指定环境)
npm run dev:local
```

### 使用快速启动工具

```bash
# 自动检测环境并启动
node scripts/quick-start.js

# 指定环境启动
node scripts/quick-start.js --env production
```

### 使用环境切换工具

```bash
# Windows
scripts\switch-env.bat dev
scripts\switch-env.bat prod

# Linux/Mac
./scripts/switch-env.sh dev
./scripts/switch-env.sh prod
```

## 🔄 环境切换

### 手动切换

```bash
# 设置环境变量
export NODE_ENV=development  # Linux/Mac
set NODE_ENV=development     # Windows

# 启动服务
npm run dev
```

### 自动切换

使用环境配置管理器：

```bash
# 查看环境状态
node scripts/env-manager.js list

# 设置环境配置
node scripts/env-manager.js setup dev
node scripts/env-manager.js setup production

# 验证环境配置
node scripts/env-manager.js validate dev
node scripts/env-manager.js validate production
```

## 🛠️ 环境配置管理器

环境配置管理器 (`scripts/env-manager.js`) 提供以下功能：

- 自动创建环境配置文件
- 验证配置完整性
- 管理多个环境配置

### 使用方法

```bash
# 显示帮助
node scripts/env-manager.js help

# 设置开发环境
node scripts/env-manager.js setup dev

# 设置生产环境
node scripts/env-manager.js setup production

# 验证配置
node scripts/env-manager.js validate dev
```

## 🔍 健康检查

启动服务后，可以通过以下方式检查服务状态：

```bash
# 健康检查接口
curl http://localhost:3000/health

# 使用NPM脚本
npm run health
```

## 🐛 故障排除

### 常见问题

1. **配置验证失败**
   - 检查必需配置项是否已设置
   - 运行 `node scripts/env-manager.js validate <env>`

2. **数据库连接失败**
   - 检查数据库服务是否运行
   - 验证连接串是否正确
   - 检查网络连接

3. **环境变量未生效**
   - 确认 `NODE_ENV` 设置正确
   - 重启终端或服务
   - 检查配置文件路径

### 日志级别

- **开发环境**: `debug` - 显示详细日志
- **生产环境**: `warn` - 只显示警告和错误

### 调试模式

开发环境下，错误响应会包含详细的错误信息：

```json
{
  "success": false,
  "message": "服务器内部错误",
  "error": "具体错误信息",
  "stack": "错误堆栈"
}
```

## 📚 相关文档

- [快速开始指南](../README.md)
- [API文档](./API.md)
- [部署指南](./DEPLOYMENT.md)

## 🤝 贡献

如有问题或建议，请提交Issue或Pull Request。
