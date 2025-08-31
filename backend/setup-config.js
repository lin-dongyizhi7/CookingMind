#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 食光家后端配置设置向导');
console.log('========================\n');

// 默认配置
const defaultConfig = {
  PORT: '3000',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/cooking_mind',
  REDIS_URL: 'redis://localhost:6379',
  JWT_SECRET: 'cooking_mind_super_secret_jwt_key_2024_very_long_random_string',
  JWT_EXPIRES_IN: '7d',
  ERNIE_API_KEY: '',
  ERNIE_SECRET_KEY: '',
  UPLOAD_PATH: './uploads',
  MAX_FILE_SIZE: '10485760'
};

// 配置说明
const configDescriptions = {
  PORT: '服务器端口号',
  NODE_ENV: '运行环境 (development/production)',
  MONGODB_URI: 'MongoDB连接字符串',
  REDIS_URL: 'Redis连接字符串',
  JWT_SECRET: 'JWT签名密钥',
  JWT_EXPIRES_IN: 'JWT过期时间',
  ERNIE_API_KEY: '文心大模型API Key',
  ERNIE_SECRET_KEY: '文心大模型Secret Key',
  UPLOAD_PATH: '文件上传路径',
  MAX_FILE_SIZE: '最大文件大小(字节)'
};

// 配置选项
const configOptions = {
  MONGODB_URI: [
    'mongodb://localhost:27017/cooking_mind (本地MongoDB)',
    'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cooking_mind (MongoDB Atlas)',
    'mongodb://<username>:<password>@<host>:<port>/cooking_mind (云MongoDB)'
  ],
  REDIS_URL: [
    'redis://localhost:6379 (本地Redis)',
    'redis://:<password>@<host>:<port> (云Redis)'
  ]
};

async function askQuestion(question, defaultValue = '', options = []) {
  return new Promise((resolve) => {
    if (options.length > 0) {
      console.log(`\n${question}`);
      options.forEach((option, index) => {
        console.log(`  ${index + 1}. ${option}`);
      });
      console.log(`  0. 自定义输入`);
      rl.question(`请选择 (0-${options.length}) 或直接输入: `, (answer) => {
        if (answer === '0' || answer === '') {
          rl.question(`请输入${question}: `, (input) => {
            resolve(input || defaultValue);
          });
        } else if (answer >= 1 && answer <= options.length) {
          resolve(options[answer - 1].split(' ')[0]);
        } else {
          resolve(answer || defaultValue);
        }
      });
    } else {
      rl.question(`${question}: `, (answer) => {
        resolve(answer || defaultValue);
      });
    }
  });
}

async function generateConfig() {
  const config = { ...defaultConfig };
  
  console.log('📊 数据库配置');
  console.log('---------------');
  
  // MongoDB配置
  const mongoChoice = await askQuestion(
    '选择MongoDB连接方式',
    config.MONGODB_URI,
    configOptions.MONGODB_URI
  );
  config.MONGODB_URI = mongoChoice;
  
  // Redis配置
  const redisChoice = await askQuestion(
    '选择Redis连接方式',
    config.REDIS_URL,
    configOptions.REDIS_URL
  );
  config.REDIS_URL = redisChoice;
  
  console.log('\n🔑 文心API配置');
  console.log('---------------');
  console.log('请访问 https://cloud.baidu.com/ 获取文心大模型API密钥');
  
  config.ERNIE_API_KEY = await askQuestion(
    '请输入文心API Key',
    config.ERNIE_API_KEY
  );
  
  config.ERNIE_SECRET_KEY = await askQuestion(
    '请输入文心Secret Key',
    config.ERNIE_SECRET_KEY
  );
  
  console.log('\n⚙️ 其他配置');
  console.log('---------------');
  
  config.PORT = await askQuestion(
    '服务器端口号',
    config.PORT
  );
  
  config.JWT_SECRET = await askQuestion(
    'JWT密钥 (建议使用长随机字符串)',
    config.JWT_SECRET
  );
  
  return config;
}

function generateEnvFile(config) {
  let envContent = '# 食光家后端环境变量配置\n';
  envContent += '# 生成时间: ' + new Date().toLocaleString() + '\n\n';
  
  for (const [key, value] of Object.entries(config)) {
    envContent += `${key}=${value}\n`;
  }
  
  return envContent;
}

function generateDockerCompose(config) {
  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "${config.PORT}:3000"
    environment:
      - NODE_ENV=${config.NODE_ENV}
      - MONGODB_URI=mongodb://mongo:27017/cooking_mind
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${config.JWT_SECRET}
      - JWT_EXPIRES_IN=${config.JWT_EXPIRES_IN}
      - ERNIE_API_KEY=${config.ERNIE_API_KEY}
      - ERNIE_SECRET_KEY=${config.ERNIE_SECRET_KEY}
      - UPLOAD_PATH=${config.UPLOAD_PATH}
      - MAX_FILE_SIZE=${config.MAX_FILE_SIZE}
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:${config.UPLOAD_PATH}

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=cooking_mind
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
`;
  
  return dockerCompose;
}

async function main() {
  try {
    const config = await generateConfig();
    
    console.log('\n📝 生成配置文件');
    console.log('================');
    
    // 生成.env文件内容
    const envContent = generateEnvFile(config);
    console.log('\n✅ .env 文件内容:');
    console.log('-------------------');
    console.log(envContent);
    
    // 生成docker-compose.yml
    const dockerCompose = generateDockerCompose(config);
    console.log('\n✅ docker-compose.yml 文件内容:');
    console.log('-------------------------------');
    console.log(dockerCompose);
    
    // 保存配置文件
    const envPath = path.join(__dirname, '.env');
    const dockerComposePath = path.join(__dirname, 'docker-compose.yml');
    
    fs.writeFileSync(envPath, envContent);
    fs.writeFileSync(dockerComposePath, dockerCompose);
    
    console.log('\n🎉 配置文件生成完成！');
    console.log('====================');
    console.log(`📁 .env 文件已保存到: ${envPath}`);
    console.log(`📁 docker-compose.yml 文件已保存到: ${dockerComposePath}`);
    
    console.log('\n📋 下一步操作:');
    console.log('1. 检查并修改 .env 文件中的配置');
    console.log('2. 确保MongoDB和Redis服务正在运行');
    console.log('3. 运行 npm install 安装依赖');
    console.log('4. 运行 npm run dev 启动开发服务器');
    
    if (config.ERNIE_API_KEY && config.ERNIE_SECRET_KEY) {
      console.log('\n🔑 文心API配置完成，可以开始使用AI功能！');
    } else {
      console.log('\n⚠️  文心API未配置，AI功能将不可用');
      console.log('请配置API密钥后重启服务');
    }
    
  } catch (error) {
    console.error('❌ 配置生成失败:', error.message);
  } finally {
    rl.close();
  }
}

// 运行配置向导
if (require.main === module) {
  main();
}

module.exports = { generateConfig, generateEnvFile, generateDockerCompose };
