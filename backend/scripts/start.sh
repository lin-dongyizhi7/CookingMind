#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 食光家后端启动脚本${NC}"
echo -e "${BLUE}========================${NC}"
echo

# 检查Node.js环境
echo -e "${YELLOW}📋 检查Node.js环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未检测到Node.js，请先安装Node.js 16+${NC}"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js环境正常${NC}"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未检测到npm，请先安装npm${NC}"
    exit 1
fi

echo
echo -e "${YELLOW}📦 安装依赖包...${NC}"
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖包，请稍候..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ 依赖已安装${NC}"
fi

echo
echo -e "${YELLOW}🔧 检查配置文件...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  未找到.env配置文件，正在运行配置向导...${NC}"
    node setup-config.js
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 配置生成失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 配置文件生成完成${NC}"
else
    echo -e "${GREEN}✅ 配置文件已存在${NC}"
fi

echo
echo -e "${YELLOW}🐳 启动数据库服务...${NC}"
echo "正在启动MongoDB和Redis..."

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker未运行，请先启动Docker${NC}"
    exit 1
fi

# 启动数据库服务
docker-compose up -d mongo redis
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 数据库服务启动失败${NC}"
    echo "请检查Docker是否已安装并运行"
    exit 1
fi
echo -e "${GREEN}✅ 数据库服务启动成功${NC}"

echo
echo -e "${YELLOW}⏳ 等待数据库服务就绪...${NC}"
sleep 10

# 检查服务状态
echo "检查数据库服务状态..."
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}❌ 数据库服务未正常运行${NC}"
    docker-compose ps
    exit 1
fi

echo
echo -e "${GREEN}🚀 启动后端服务...${NC}"
echo "服务将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务"
echo

# 启动后端服务
npm run dev

echo
echo -e "${YELLOW}🛑 服务已停止${NC}"
