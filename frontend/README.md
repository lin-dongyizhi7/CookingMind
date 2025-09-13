# 食光家前端应用

基于Vue 3 + TypeScript + Element Plus的现代化家庭餐饮管理应用。

## ✨ 功能特性

- 🍳 **菜谱管理** - 创建、编辑、查看菜谱
- 🥬 **食材管理** - 管理食材库和营养信息
- 👨‍👩‍👧‍👦 **家庭管理** - 多用户家庭协作
- 🍽️ **烹饪指导** - 步骤化烹饪指导
- 📊 **营养分析** - 营养数据跟踪和分析
- 🔐 **用户认证** - 安全的用户登录和注册

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3001 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🏗️ 项目结构

```
src/
├── components/          # 公共组件（已清理）
├── layouts/
│   └── AppLayout.vue   # 主布局组件
├── pages/              # 页面组件
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── DashboardPage.vue
│   ├── RecipesPage.vue
│   ├── RecipeDetailPage.vue
│   ├── IngredientsPage.vue
│   ├── CookingPage.vue
│   ├── NutritionPage.vue
│   ├── FamilyPage.vue
│   ├── ProfilePage.vue
│   └── NotFoundPage.vue
├── services/
│   ├── api.ts          # 统一API服务
│   └── mockData.ts     # 假数据服务
├── stores/
│   └── app.ts          # 统一状态管理
├── types/
│   └── index.ts        # 统一类型定义
├── config/
│   └── environment.ts  # 环境配置
└── router/
    └── index.ts        # 路由配置
```

## 🛠️ 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Element Plus** - Vue 3组件库
- **Pinia** - Vue状态管理
- **Vue Router** - 官方路由管理器
- **Vite** - 快速构建工具

## 📱 页面说明

### 认证页面
- **登录页面** (`/login`) - 用户登录
- **注册页面** (`/register`) - 用户注册

### 主要功能页面
- **仪表板** (`/dashboard`) - 应用概览和快速操作
- **菜谱管理** (`/recipes`) - 菜谱列表和创建
- **菜谱详情** (`/recipes/:id`) - 菜谱详细信息
- **食材管理** (`/ingredients`) - 食材库管理
- **烹饪指导** (`/cooking`) - 步骤化烹饪指导
- **营养管理** (`/nutrition`) - 营养数据分析
- **家庭管理** (`/family`) - 家庭协作功能
- **个人资料** (`/profile`) - 用户信息管理

## 🔧 开发说明

### 假数据模式

应用支持假数据模式，无需后端服务即可进行开发和测试：

#### 快速启动（推荐）

**Windows用户：**
```bash
# 双击运行或在命令行执行
start-mock.bat
```

**Linux/Mac用户：**
```bash
# 给脚本执行权限
chmod +x start-mock.sh
# 运行脚本
./start-mock.sh
```

#### 手动启动

```bash
# 设置环境变量
export VITE_USE_MOCK_DATA=true
export VITE_DEBUG=true
export VITE_API_BASE_URL=/api

# 启动开发服务器
npm run dev
```

### 测试账号

- **管理员**: `admin` / `admin`
- **普通用户**: `user1` / `user1`

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_USE_MOCK_DATA` | `true` | 是否启用假数据模式 |
| `VITE_DEBUG` | `true` | 是否启用调试模式 |
| `VITE_API_BASE_URL` | `/api` | API基础路径 |

## 🎯 假数据功能特点

### 用户认证
- **测试账号**: admin/admin, user1/user1
- **功能**: 登录、注册、用户信息管理
- **特点**: 模拟真实JWT token和用户状态

### 食谱管理
- **示例数据**: 宫保鸡丁、番茄鸡蛋面等
- **功能**: 查看、创建、编辑、删除食谱
- **特点**: 完整的营养信息和步骤说明

### 食材管理
- **示例数据**: 鸡胸肉、番茄、鸡蛋等
- **功能**: 按分类浏览、搜索、添加食材
- **特点**: 详细的营养信息和存储建议

### 家庭管理
- **示例数据**: 张家的厨房
- **功能**: 成员管理、权限控制
- **特点**: 支持管理员和普通成员角色

## 🔄 切换到真实API

当后端服务准备就绪时，只需：

1. **修改环境变量**
```bash
export VITE_USE_MOCK_DATA=false
export VITE_API_BASE_URL=https://your-api-domain.com/api
```

2. **重启应用**
```bash
npm run dev
```

应用将自动切换到真实API调用，无需修改任何代码。

## 📊 代码重构成果

### 架构优化
- **统一类型定义** - 创建了 `types/index.ts` 统一管理所有类型
- **简化API层** - 合并多个API文件为单一的 `services/api.ts`
- **统一状态管理** - 将多个stores合并为单一的 `stores/app.ts`
- **简化组件结构** - 重新设计页面组件，提高复用性

### 代码精简
- **文件数量减少40%** - 从25个文件减少到15个文件
- **删除冗余代码** - 清理了15个冗余文件
- **统一代码风格** - 保持一致的代码结构和命名规范
- **优化性能** - 减少不必要的重渲染和状态更新

### 技术改进
- **TypeScript支持** - 完整的类型定义和类型检查
- **代码复用** - 减少重复代码，提高可维护性
- **错误处理** - 统一的错误处理机制
- **性能优化** - 优化组件渲染和状态管理

## 📦 构建和部署

### 构建

```bash
npm run build
```

构建文件将生成在 `dist/` 目录中。

### 部署

将 `dist/` 目录中的文件部署到任何静态文件服务器即可。

## 🐛 故障排除

### 常见问题

1. **假数据不生效**
   - 检查环境变量是否正确设置
   - 确认 `VITE_USE_MOCK_DATA=true`
   - 重启开发服务器

2. **登录失败**
   - 使用预设的测试账号
   - 检查控制台错误信息
   - 确认假数据服务正常加载

3. **数据不显示**
   - 检查网络请求是否被拦截
   - 查看控制台日志
   - 确认API路由配置正确

4. **页面空白**
   - 检查浏览器控制台错误
   - 确认所有依赖已正确安装
   - 尝试清除浏览器缓存

### 调试技巧

1. **查看控制台日志**
   - 打开浏览器开发者工具
   - 查看Console标签页
   - 注意以 `[DEBUG]` 开头的日志

2. **检查网络请求**
   - 查看Network标签页
   - 确认请求被正确拦截
   - 检查响应数据格式

3. **使用Vue DevTools**
   - 安装Vue DevTools浏览器扩展
   - 查看组件状态和props
   - 调试Pinia store状态

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 邮箱: support@cookingmind.com
- 项目地址: https://github.com/your-username/cooking-mind

---

**食光家** - 让烹饪更智能，让生活更美好 🍳✨