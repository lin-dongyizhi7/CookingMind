# 🌍 环境配置说明

## 概述

食光家后端支持开发和生产两种环境，通过环境配置文件自动切换。

## 环境类型

- **开发环境 (development)**: 使用本地数据库，适合开发和测试
- **生产环境 (production)**: 使用生产数据库，适合正式部署

## 快速配置

### 1. 设置开发环境
```bash
npm run setup:dev
```

### 2. 设置生产环境
```bash
npm run setup:prod
```

### 3. 编辑配置文件
根据实际情况编辑生成的 `.env.development` 或 `.env.production` 文件。

## 配置项说明

| 配置项 | 说明 | 开发环境默认值 | 生产环境要求 |
|--------|------|----------------|--------------|
| `NODE_ENV` | 运行环境 | `development` | `production` |
| `PORT` | 服务端口 | `3000` | `3000` |
| `MONGODB_URI` | MongoDB连接串 | `mongodb://localhost:27017/cooking_mind_dev` | 生产数据库地址 |
| `REDIS_URL` | Redis连接串 | `redis://localhost:6379` | 生产Redis地址 |
| `JWT_SECRET` | JWT密钥 | 开发密钥 | 强密钥 |
| `ERNIE_API_KEY` | 文心API密钥 | 需要配置 | 需要配置 |
| `ERNIE_SECRET_KEY` | 文心密钥 | 需要配置 | 需要配置 |
| `FRONTEND_URL` | 前端地址 | `http://localhost:3001` | 生产域名 |

## 启动服务

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm run prod
```

## 环境管理

使用环境配置管理器：

```bash
# 查看环境状态
node scripts/env-manager.js list

# 验证配置
node scripts/env-manager.js validate dev
node scripts/env-manager.js validate production
```

## 注意事项

1. **开发环境**: 确保本地MongoDB和Redis服务已启动
2. **生产环境**: 必须配置强JWT密钥和有效的API密钥
3. **配置文件**: 不要将包含敏感信息的配置文件提交到版本控制
4. **数据库**: 生产环境建议使用云数据库服务

## 故障排除

- 配置验证失败：检查必需配置项是否已设置
- 数据库连接失败：检查数据库服务状态和连接串
- 环境变量未生效：确认NODE_ENV设置正确

