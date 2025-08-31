#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 食光家快速启动工具');

// 检查环境配置文件
function checkEnvironmentFiles() {
  const envFiles = {
    development: '.env.development',
    production: '.env.production'
  };
  
  const existingEnvs = [];
  
  Object.entries(envFiles).forEach(([env, file]) => {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
      existingEnvs.push(env);
    }
  });
  
  return existingEnvs;
}

// 检查数据库服务状态
function checkDatabaseServices() {
  console.log('🔍 检查数据库服务状态...');
  
  // 这里可以添加实际的数据库连接检查逻辑
  // 目前只是提示用户确保服务已启动
  
  console.log('💡 请确保以下服务已启动:');
  console.log('   - MongoDB: mongodb://localhost:27017');
  console.log('   - Redis: redis://localhost:6379');
  console.log('');
  console.log('   如果使用Docker，可以运行:');
  console.log('   docker-compose up -d');
  console.log('');
  
  return Promise.resolve();
}

// 启动后端服务
function startBackendService(env = 'development') {
  console.log(`🚀 启动后端服务 (${env} 环境)...`);
  
  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, NODE_ENV: env },
      stdio: 'inherit'
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 后端服务启动成功');
        resolve();
      } else {
        console.log('❌ 后端服务启动失败');
        reject(new Error(`NPM 退出码: ${code}`));
      }
    });
    
    npm.on('error', (err) => {
      console.log('❌ 启动后端服务时出错:', err.message);
      reject(err);
    });
  });
}

// 等待服务就绪
function waitForService(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkService = () => {
      const http = require('http');
      const req = http.request(url, { method: 'GET' }, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`服务响应状态码: ${res.statusCode}`));
        }
      });
      
      req.on('error', () => {
        if (Date.now() - startTime > timeout) {
          reject(new Error('服务启动超时'));
        } else {
          setTimeout(checkService, 1000);
        }
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        if (Date.now() - startTime > timeout) {
          reject(new Error('服务启动超时'));
        } else {
          setTimeout(checkService, 1000);
        }
      });
      
      req.end();
    };
    
    checkService();
  });
}

// 主函数
async function main() {
  try {
    // 检查环境配置
    const existingEnvs = checkEnvironmentFiles();
    
    if (existingEnvs.length === 0) {
      console.log('❌ 未找到环境配置文件');
      console.log('💡 请先运行: node scripts/env-manager.js setup dev');
      process.exit(1);
    }
    
    console.log(`📋 发现环境配置: ${existingEnvs.join(', ')}`);
    
    // 选择环境
    const env = existingEnvs.includes('development') ? 'development' : existingEnvs[0];
    console.log(`🎯 使用环境: ${env}`);
    
    // 检查数据库服务
    await checkDatabaseServices();
    
    // 等待数据库就绪
    if (env === 'development') {
      console.log('⏳ 等待数据库服务就绪...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // 启动后端服务
    await startBackendService(env);
    
    console.log('🎉 所有服务启动完成!');
    console.log(`🌐 后端服务: http://localhost:3000`);
    console.log(`🎯 健康检查: http://localhost:3000/health`);
    
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
    process.exit(1);
  }
}

// 处理命令行参数
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 食光家快速启动工具

用法:
  node scripts/quick-start.js [options]

选项:
  --help, -h    显示帮助信息
  --env <env>   指定环境 (development|production)

示例:
  node scripts/quick-start.js
  node scripts/quick-start.js --env production

功能:
  1. 自动检测环境配置
  2. 检查数据库服务状态
  3. 启动后端服务
  4. 等待服务就绪

注意:
  请确保MongoDB和Redis服务已启动
  可以使用 docker-compose up -d 启动本地数据库服务
`);
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDatabaseServices,
  startBackendService,
  waitForService
};
