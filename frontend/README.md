# 食光家前端应用

基于Vue 3的现代化前端应用，为食光家家庭餐饮制作多模态应用提供用户界面。

## 功能特性

- 🎨 **现代化UI设计** - 基于Ant Design Vue的优雅界面
- 📱 **响应式布局** - 完美适配各种设备尺寸
- 🔐 **用户认证** - 完整的登录注册系统
- 🧭 **智能导航** - 直观的侧边栏导航
- 📊 **数据可视化** - 丰富的图表和统计展示
- 🎯 **状态管理** - 基于Pinia的响应式状态管理
- 🚀 **性能优化** - Vite构建，快速热重载

## 技术栈

- **框架**: Vue 3.3+
- **构建工具**: Vite 4.4+
- **语言**: TypeScript 5.1+
- **UI组件库**: Ant Design Vue 4.0+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **HTTP客户端**: Axios 1.6+
- **图表库**: Chart.js 4.4+ + Vue-Chartjs 5.2+
- **动画**: Framer Motion 10.16+
- **图标**: Ant Design Icons Vue 7.0+

## 快速开始

### 环境要求

- Node.js 16.0+
- npm 8.0+ 或 yarn 1.22+

### 安装依赖

```bash
cd frontend
npm install
# 或
yarn install
```

### 开发环境运行

```bash
npm run dev
# 或
yarn dev
```

应用将在 `http://localhost:3001` 启动

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 类型检查

```bash
npm run type-check
# 或
yarn type-check
```

### 代码检查

```bash
npm run lint
# 或
yarn lint
```

## 项目结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   │   ├── client.ts      # HTTP客户端配置
│   │   └── authAPI.ts     # 认证相关API
│   ├── components/        # 通用组件
│   │   └── common/        # 基础组件
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.vue # 主布局
│   ├── pages/             # 页面组件
│   │   ├── auth/          # 认证页面
│   │   ├── DashboardPage.vue
│   │   └── ...
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义
│   ├── stores/            # 状态管理
│   │   └── authStore.ts   # 认证状态
│   ├── types/             # TypeScript类型定义
│   │   └── auth.ts        # 认证相关类型
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口
│   └── index.css          # 全局样式
├── .env                   # 环境变量
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── README.md              # 项目说明
```

## 主要页面

### 认证页面
- **登录页面** (`/login`) - 用户登录界面
- **注册页面** (`/register`) - 新用户注册界面

### 主应用页面
- **仪表板** (`/dashboard`) - 应用概览和快速操作
- **食材管理** (`/ingredients`) - 食材库存管理
- **菜谱管理** (`/recipes`) - 菜谱收藏和AI生成
- **烹饪指导** (`/cooking`) - 步骤指导和视频教学
- **营养管理** (`/nutrition`) - 营养分析和健康建议
- **家庭管理** (`/family`) - 家庭成员协作
- **个人资料** (`/profile`) - 用户信息设置

## 组件说明

### 通用组件
- **LoadingSpinner** - 加载状态指示器
- **ErrorBoundary** - 错误边界处理

### 布局组件
- **MainLayout** - 主应用布局，包含侧边栏、头部和内容区域

## 状态管理

使用Pinia进行状态管理，主要包含：

- **authStore** - 用户认证状态管理
  - 用户信息
  - 登录状态
  - 认证令牌
  - 登录/注册/登出操作

## API集成

- **HTTP客户端** - 基于Axios的封装
- **请求拦截器** - 自动添加认证令牌
- **响应拦截器** - 统一错误处理
- **API模块化** - 按功能模块组织API调用

## 样式设计

- **设计系统** - 基于Ant Design Vue的设计规范
- **主题定制** - 支持主题色和组件样式定制
- **响应式设计** - 移动端优先的响应式布局
- **动画效果** - 流畅的页面过渡和交互动画

## 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新的Vue组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/layouts/MainLayout.vue` 中添加导航菜单项

### 添加新组件

1. 在 `src/components/` 目录下创建组件
2. 使用 `<script setup>` 语法编写组件逻辑
3. 添加TypeScript类型定义
4. 编写组件文档和示例

### 状态管理

1. 在 `src/stores/` 目录下创建新的store
2. 使用 `defineStore` 定义store
3. 使用组合式API编写store逻辑
4. 在组件中使用 `useStore` 访问状态

## 部署说明

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录

### 部署到服务器

1. 将 `dist/` 目录内容上传到Web服务器
2. 配置服务器支持SPA路由（所有路由都返回index.html）
3. 配置环境变量和API地址

### 环境变量配置

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=食光家
```

## 测试

### 运行测试

```bash
npm run test
# 或
yarn test
```

### 测试覆盖率

```bash
npm run test:coverage
# 或
yarn test:coverage
```

## 常见问题

### 开发环境问题

1. **端口冲突** - 修改 `vite.config.ts` 中的端口配置
2. **热重载不工作** - 检查文件保存和编辑器配置
3. **类型错误** - 运行 `npm run type-check` 检查类型

### 构建问题

1. **构建失败** - 检查TypeScript类型错误
2. **依赖缺失** - 重新安装依赖 `npm install`
3. **环境变量** - 确保 `.env` 文件配置正确

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交代码变更
4. 创建Pull Request

## 许可证

MIT License

## 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 功能建议: [Discussions]
