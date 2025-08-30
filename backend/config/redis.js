const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis 连接错误:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis 连接成功');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis 连接失败:', error.message);
  }
};

const getRedisClient = () => {
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };
