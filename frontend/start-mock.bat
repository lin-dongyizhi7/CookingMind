@echo off
echo 启动食光家前端应用（假数据模式）
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
)

REM 设置环境变量
set VITE_USE_MOCK_DATA=true
set VITE_DEBUG=true
set VITE_API_BASE_URL=/api

echo 环境变量已设置:
echo VITE_USE_MOCK_DATA=true
echo VITE_DEBUG=true
echo VITE_API_BASE_URL=/api
echo.

echo 启动开发服务器...
echo 应用将在 http://localhost:3001 打开
echo 按 Ctrl+C 停止服务器
echo.

npm run dev
