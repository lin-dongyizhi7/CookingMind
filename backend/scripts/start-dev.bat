@echo off
chcp 65001 >nul
echo 🚀 食光家开发环境启动脚本

echo.
echo 📋 检查环境配置...

REM 检查环境配置文件
if not exist ".env.development" (
    echo ❌ 未找到开发环境配置文件
    echo 💡 正在创建开发环境配置...
    call npm run setup:dev
    if errorlevel 1 (
        echo ❌ 创建配置文件失败
        pause
        exit /b 1
    )
)

echo ✅ 环境配置检查完成

echo.
echo 🔍 检查数据库服务状态...
echo 💡 请确保以下服务已启动:
echo    - MongoDB: mongodb://localhost:27017
echo    - Redis: redis://localhost:6379
echo.
echo    如果使用Docker，可以运行:
echo    docker-compose up -d
echo.

echo ⏳ 等待数据库服务就绪...
timeout /t 3 /nobreak >nul

echo.
echo 🚀 启动后端服务...
set NODE_ENV=development
call npm run dev

pause
