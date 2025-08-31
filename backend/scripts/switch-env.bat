@echo off
chcp 65001 >nul
echo 🌍 食光家环境切换工具

if "%1"=="" (
    echo.
    echo 用法: switch-env.bat [dev^|prod]
    echo.
    echo 环境:
    echo   dev   - 开发环境 (本地数据库)
    echo   prod  - 生产环境
    echo.
    echo 示例:
    echo   switch-env.bat dev
    echo   switch-env.bat prod
    echo.
    goto :end
)

if "%1"=="dev" (
    echo 🔧 切换到开发环境...
    set NODE_ENV=development
    echo ✅ 环境变量已设置: NODE_ENV=%NODE_ENV%
    echo.
    echo 💡 现在可以运行以下命令启动开发环境:
    echo   npm run dev
    echo   docker-compose up -d
    echo.
) else if "%1"=="prod" (
    echo 🚀 切换到生产环境...
    set NODE_ENV=production
    echo ✅ 环境变量已设置: NODE_ENV=%NODE_ENV%
    echo.
    echo 💡 现在可以运行以下命令启动生产环境:
    echo   npm run prod
    echo.
) else (
    echo ❌ 无效的环境参数: %1
    echo 请使用 dev 或 prod
    goto :end
)

echo 📋 当前环境配置:
echo   环境: %NODE_ENV%
echo   端口: 3000
echo   数据库: 根据环境自动选择
echo.

:end
pause
