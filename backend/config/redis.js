const redis = require('redis');
const config = require('./environment');

let redisClient = null;

const connectRedis = async () => {
  try {
    const dbConfig = config.getDatabaseConfig();
    redisClient = redis.createClient({
      url: dbConfig.REDIS_URL,
      // 生产环境优化配置
      ...(config.NODE_ENV === 'production' && {
        socket: {
          keepAlive: 5000,
          reconnectDelay: 1000,
        },
        retry_delay: 1000,
        max_attempts: 3,
      })
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis 连接错误:', err);
      if (config.NODE_ENV === 'production') {
        // 生产环境下记录错误但不退出
        console.error('Redis 错误详情:', err);
      }
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis 连接成功');
      if (config.NODE_ENV === 'production') {
        console.log('🔒 生产环境Redis连接已优化');
      }
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis 重新连接中...');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis 连接失败:', error.message);
    if (config.NODE_ENV === 'production') {
      // 生产环境下Redis连接失败不退出程序
      console.error('Redis 连接失败，但程序继续运行');
    } else {
      throw error;
    }
  }
};

const getRedisClient = () => {
  return redisClient;
};

// 健康检查
const healthCheck = async () => {
  if (redisClient && redisClient.isReady) {
    try {
      await redisClient.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};

module.exports = { connectRedis, getRedisClient, healthCheck };
