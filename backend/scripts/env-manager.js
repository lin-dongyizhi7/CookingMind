#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetFiles = {
  development: '.env.development',
  production: '.env.production'
};

function showHelp() {
  console.log(`
🌍 食光家环境配置管理器

用法:
  node scripts/env-manager.js <command> [environment]

命令:
  setup <env>    设置指定环境的配置文件
  list           列出所有环境配置
  validate <env> 验证指定环境的配置
  help           显示此帮助信息

环境:
  dev, development  开发环境
  prod, production 生产环境

示例:
  node scripts/env-manager.js setup dev
  node scripts/env-manager.js setup production
  node scripts/env-manager.js validate dev
`);
}

function createEnvironmentConfig(env) {
  const targetFile = targetFiles[env];
  
  if (!targetFile) {
    console.error(`❌ 不支持的环境: ${env}`);
    return false;
  }
  
  const targetPath = path.join(__dirname, '..', targetFile);
  
  if (fs.existsSync(targetPath)) {
    console.log(`⚠️  目标配置文件已存在: ${targetFile}`);
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('是否覆盖? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        generateConfigFile(targetPath, env);
      } else {
        console.log('操作已取消');
      }
      rl.close();
    });
  } else {
    generateConfigFile(targetPath, env);
  }
  
  return true;
}

function generateConfigFile(filePath, env) {
  try {
    let configContent = '';
    
    if (env === 'development') {
      configContent = `# 开发环境配置
NODE_ENV=development
PORT=3000

# 数据库配置 - 本地开发
MONGODB_URI=mongodb://localhost:27017/cooking_mind_dev
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=dev_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# 文心大模型API配置
ERNIE_API_KEY=your_ernie_api_key
ERNIE_SECRET_KEY=your_ernie_secret_key
ERNIE_ACCESS_TOKEN=your_ernie_access_token

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# 第三方服务配置
QINIU_ACCESS_KEY=your_qiniu_access_key
QINIU_SECRET_KEY=your_qiniu_secret_key
QINIU_BUCKET=your_qiniu_bucket
QINIU_DOMAIN=your_qiniu_domain

# 前端URL配置
FRONTEND_URL=http://localhost:3001

# 日志配置
LOG_LEVEL=debug
ENABLE_CONSOLE_LOG=true
ENABLE_FILE_LOG=false`;
    } else if (env === 'production') {
      configContent = `# 生产环境配置
NODE_ENV=production
PORT=3000

# 数据库配置 - 生产环境
# 请根据实际的生产环境数据库配置修改
MONGODB_URI=mongodb://localhost:27017/cooking_mind_prod
REDIS_URL=redis://localhost:6379

# JWT配置 - 生产环境必须使用强密钥
JWT_SECRET=your_very_strong_jwt_secret_key_for_production
JWT_EXPIRES_IN=7d

# 文心大模型API配置
ERNIE_API_KEY=your_ernie_api_key
ERNIE_SECRET_KEY=your_ernie_secret_key
ERNIE_ACCESS_TOKEN=your_ernie_access_token

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# 第三方服务配置
QINIU_ACCESS_KEY=your_qiniu_access_key
QINIU_SECRET_KEY=your_qiniu_secret_key
QINIU_BUCKET=your_qiniu_bucket
QINIU_DOMAIN=your_qiniu_domain

# 前端URL配置 - 生产环境前端地址
FRONTEND_URL=https://your-domain.com

# 日志配置
LOG_LEVEL=warn
ENABLE_CONSOLE_LOG=true
ENABLE_FILE_LOG=true`;
    }
    
    fs.writeFileSync(filePath, configContent);
    console.log(`✅ ${env} 环境配置文件已创建: ${path.basename(filePath)}`);
    console.log(`📝 请编辑 ${path.basename(filePath)} 文件，配置实际的参数值`);
    
    // 显示需要配置的关键参数
    const requiredFields = [
      'JWT_SECRET',
      'ERNIE_API_KEY',
      'ERNIE_SECRET_KEY',
      'MONGODB_URI',
      'REDIS_URL'
    ];
    
    console.log('\n🔑 需要配置的关键参数:');
    requiredFields.forEach(field => {
      console.log(`   - ${field}`);
    });
    
  } catch (error) {
    console.error(`❌ 创建配置文件失败:`, error.message);
  }
}

function listEnvironments() {
  console.log('📋 可用的环境配置:');
  Object.entries(targetFiles).forEach(([env, file]) => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    const status = exists ? '✅ 已配置' : '❌ 未配置';
    console.log(`   ${env}: ${status}`);
  });
}

function validateEnvironment(env) {
  const targetFile = targetFiles[env];
  if (!targetFile) {
    console.error(`❌ 不支持的环境: ${env}`);
    return false;
  }
  
  const targetPath = path.join(__dirname, '..', targetFile);
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ 环境配置文件不存在: ${targetFile}`);
    console.log(`💡 请先运行: node scripts/env-manager.js setup ${env}`);
    return false;
  }
  
  console.log(`🔍 验证 ${env} 环境配置...`);
  
  // 加载环境变量进行验证
  require('dotenv').config({ path: targetPath });
  
  const requiredFields = [
    'JWT_SECRET',
    'ERNIE_API_KEY', 
    'ERNIE_SECRET_KEY'
  ];
  
  const missingFields = [];
  requiredFields.forEach(field => {
    if (!process.env[field]) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    console.log(`❌ 缺少必需的配置字段: ${missingFields.join(', ')}`);
    return false;
  } else {
    console.log(`✅ ${env} 环境配置验证通过`);
    return true;
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const env = args[1];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'setup':
      if (!env) {
        console.error('❌ 请指定环境 (dev/development 或 prod/production)');
        return;
      }
      
      const normalizedEnv = env === 'dev' ? 'development' : 
                           env === 'prod' ? 'production' : env;
      
      if (!['development', 'production'].includes(normalizedEnv)) {
        console.error('❌ 不支持的环境，请使用 dev/development 或 prod/production');
        return;
      }
      
      createEnvironmentConfig(normalizedEnv);
      break;
      
    case 'list':
      listEnvironments();
      break;
      
    case 'validate':
      if (!env) {
        console.error('❌ 请指定环境 (dev/development 或 prod/production)');
        return;
      }
      
      const normalizedEnvForValidation = env === 'dev' ? 'development' : 
                                       env === 'prod' ? 'production' : env;
      
      if (!['development', 'production'].includes(normalizedEnvForValidation)) {
        console.error('❌ 不支持的环境，请使用 dev/development 或 prod/production');
        return;
      }
      
      validateEnvironment(normalizedEnvForValidation);
      break;
      
    default:
      console.error(`❌ 未知命令: ${command}`);
      showHelp();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createEnvironmentConfig,
  listEnvironments,
  validateEnvironment
};
