const path = require('path');
const fs = require('fs');

// 获取当前环境
const NODE_ENV = process.env.NODE_ENV || 'development';

// 环境配置文件路径
const envFiles = {
  development: '.env.development',
  production: '.env.production',
  test: '.env.test'
};

// 加载环境特定的配置文件
const loadEnvFile = (env) => {
  const envFile = envFiles[env];
  if (envFile) {
    const envPath = path.join(__dirname, '..', envFile);
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log(`📁 已加载环境配置文件: ${envFile}`);
    } else {
      console.log(`⚠️  环境配置文件不存在: ${envFile}，使用默认配置`);
    }
  }
};

// 加载环境配置
loadEnvFile(NODE_ENV);

// 环境配置对象
const config = {
  // 基础配置
  NODE_ENV,
  PORT: process.env.PORT || 3000,
  
  // 数据库配置
  database: {
    development: {
      MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cooking_mind_dev',
      REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    production: {
      MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cooking_mind_prod',
      REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
    }
  },
  
  // JWT配置
  jwt: {
    SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // 文心大模型API配置
  ernie: {
    API_KEY: process.env.ERNIE_API_KEY,
    SECRET_KEY: process.env.ERNIE_SECRET_KEY,
    ACCESS_TOKEN: process.env.ERNIE_ACCESS_TOKEN
  },
  
  // 文件上传配置
  upload: {
    PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  },
  
  // 第三方服务配置
  qiniu: {
    ACCESS_KEY: process.env.QINIU_ACCESS_KEY,
    SECRET_KEY: process.env.QINIU_SECRET_KEY,
    BUCKET: process.env.QINIU_BUCKET,
    DOMAIN: process.env.QINIU_DOMAIN
  },
  
  // 前端URL配置
  frontend: {
    URL: process.env.FRONTEND_URL || 'http://localhost:3001'
  },
  
  // 日志配置
  logging: {
    LEVEL: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'warn' : 'debug'),
    ENABLE_CONSOLE: process.env.ENABLE_CONSOLE_LOG !== 'false',
    ENABLE_FILE: process.env.ENABLE_FILE_LOG === 'true'
  }
};

// 获取当前环境的数据库配置
config.getDatabaseConfig = () => {
  return config.database[NODE_ENV] || config.database.development;
};

// 验证必需配置
config.validate = () => {
  const requiredFields = [
    'jwt.SECRET',
    'ernie.API_KEY',
    'ernie.SECRET_KEY'
  ];
  
  const missingFields = [];
  
  requiredFields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], config);
    if (!value) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    console.error('❌ 缺少必需的配置字段:', missingFields);
    if (NODE_ENV === 'production') {
      process.exit(1);
    }
  }
  
  return missingFields.length === 0;
};

// 打印环境信息
config.printInfo = () => {
  console.log('🌍 环境配置信息:');
  console.log(`   环境: ${NODE_ENV}`);
  console.log(`   端口: ${config.PORT}`);
  console.log(`   数据库: ${config.getDatabaseConfig().MONGODB_URI}`);
  console.log(`   Redis: ${config.getDatabaseConfig().REDIS_URL}`);
  console.log(`   前端URL: ${config.frontend.URL}`);
  console.log(`   日志级别: ${config.logging.LEVEL}`);
};

module.exports = config;
