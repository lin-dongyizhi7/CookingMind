# 食光家后端服务

这是"食光家"家庭餐饮制作多模态应用的后端服务，基于Node.js + Express + MongoDB构建。

## 功能特性

- 🔐 用户认证与授权（JWT）
- 👨‍👩‍👧‍👦 家庭管理
- 🥕 智能食材管理（支持图片识别）
- 📖 AI食谱生成
- 👨‍🍳 动态烹饪指导
- 📊 营养分析与建议
- 🎥 多模态内容生成（图片、视频、语音）

## 技术栈

- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: MongoDB
- **缓存**: Redis
- **认证**: JWT
- **文件上传**: Multer
- **AI服务**: 文心大模型4.5
- **实时通信**: Socket.io

## 快速开始

### 环境要求

- Node.js 16+
- MongoDB 5+
- Redis 6+

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp env.example .env
```

2. 配置环境变量：
```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/cooking_mind
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 文心大模型API配置
ERNIE_API_KEY=your_ernie_api_key
ERNIE_SECRET_KEY=your_ernie_secret_key
ERNIE_ACCESS_TOKEN=your_ernie_access_token
```

### 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/me` - 更新用户信息

### 家庭管理
- `POST /api/family` - 创建家庭
- `GET /api/family` - 获取家庭信息
- `POST /api/family/invite` - 邀请家庭成员

### 食材管理
- `GET /api/ingredients` - 获取食材列表
- `POST /api/ingredients/recognize` - 图片识别食材
- `POST /api/ingredients` - 手动添加食材
- `PUT /api/ingredients/:id` - 更新食材信息

### 食谱管理
- `GET /api/recipes` - 获取食谱列表
- `POST /api/recipes/generate` - AI生成食谱
- `POST /api/recipes` - 创建食谱
- `GET /api/recipes/:id` - 获取食谱详情

### 烹饪指导
- `GET /api/cooking/:recipeId/steps` - 获取烹饪步骤
- `POST /api/cooking/:recipeId/generate-video` - 生成烹饪视频
- `GET /api/cooking/:recipeId/tips` - 获取烹饪技巧

### 营养管理
- `GET /api/nutrition/overview` - 获取营养概览
- `POST /api/nutrition/calculate-recipe` - 计算食谱营养
- `GET /api/nutrition/recommendations` - 获取营养建议

## 数据模型

### User（用户）
- 基本信息：用户名、邮箱、密码
- 偏好设置：饮食限制、过敏原、烹饪水平
- 营养目标：每日热量、蛋白质等

### Family（家庭）
- 家庭信息：名称、描述、成员
- 设置：餐点提醒、食材过期提醒
- 偏好：菜系偏好、烹饪时间、辣度

### Ingredient（食材）
- 基本信息：名称、分类、数量
- 存储信息：位置、温度、湿度
- 新鲜度：购买日期、过期日期、当前状态
- 营养信息：热量、蛋白质、碳水化合物等

### Recipe（食谱）
- 基本信息：标题、描述、分类、难度
- 时间信息：准备时间、烹饪时间、总时间
- 食材清单：所需食材及数量
- 烹饪步骤：详细步骤说明、视频、图片
- 营养信息：营养成分表
- 评价系统：评分、评论、烹饪历史

## 开发指南

### 项目结构
```
backend/
├── config/          # 配置文件
├── middleware/      # 中间件
├── models/          # 数据模型
├── routes/          # 路由
├── uploads/         # 上传文件
├── server.js        # 主服务器文件
└── package.json     # 项目配置
```

### 添加新功能

1. 创建数据模型（如需要）
2. 添加路由处理
3. 实现业务逻辑
4. 添加错误处理
5. 编写测试用例

### 代码规范

- 使用ES6+语法
- 遵循RESTful API设计原则
- 统一错误处理格式
- 添加适当的注释
- 使用async/await处理异步操作

## 部署

### Docker部署

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量

生产环境需要配置：
- 数据库连接字符串
- Redis连接信息
- JWT密钥
- 文心API密钥
- 文件存储配置

## 测试

```bash
npm test
```

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
