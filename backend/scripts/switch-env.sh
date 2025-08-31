#!/bin/bash

echo "🌍 食光家环境切换工具"

if [ $# -eq 0 ]; then
    echo ""
    echo "用法: ./switch-env.sh [dev|prod]"
    echo ""
    echo "环境:"
    echo "  dev   - 开发环境 (本地数据库)"
    echo "  prod  - 生产环境"
    echo ""
    echo "示例:"
    echo "  ./switch-env.sh dev"
    echo "  ./switch-env.sh prod"
    echo ""
    exit 1
fi

case $1 in
    "dev")
        echo "🔧 切换到开发环境..."
        export NODE_ENV=development
        echo "✅ 环境变量已设置: NODE_ENV=$NODE_ENV"
        echo ""
        echo "💡 现在可以运行以下命令启动开发环境:"
        echo "  npm run dev"
        echo "  docker-compose up -d"
        echo ""
        ;;
    "prod")
        echo "🚀 切换到生产环境..."
        export NODE_ENV=production
        echo "✅ 环境变量已设置: NODE_ENV=$NODE_ENV"
        echo ""
        echo "💡 现在可以运行以下命令启动生产环境:"
        echo "  npm run prod"
        echo ""
        ;;
    *)
        echo "❌ 无效的环境参数: $1"
        echo "请使用 dev 或 prod"
        exit 1
        ;;
esac

echo "📋 当前环境配置:"
echo "   环境: $NODE_ENV"
echo "   端口: 3000"
echo "   数据库: 根据环境自动选择"
echo ""

# 将环境变量添加到当前shell会话
echo "export NODE_ENV=$NODE_ENV" >> ~/.bashrc
echo "export NODE_ENV=$NODE_ENV" >> ~/.zshrc 2>/dev/null || true
echo "💡 环境变量已添加到shell配置文件，重新打开终端后生效"
