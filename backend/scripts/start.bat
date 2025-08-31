@echo off
chcp 65001 >nul
echo 🚀 食光家后端启动脚本

echo.
echo 📋 选择运行环境:
echo   1. 开发环境 (本地数据库)
echo   2. 生产环境
echo   3. 退出
echo.

set /p choice="请选择 (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🔧 启动开发环境...
    call scripts\start-dev.bat
) else if "%choice%"=="2" (
    echo.
    echo 🚀 启动生产环境...
    set NODE_ENV=production
    call npm run prod
    pause
) else if "%choice%"=="3" (
    echo 退出...
    exit /b 0
) else (
    echo ❌ 无效选择，请重新运行脚本
    pause
    exit /b 1
)
