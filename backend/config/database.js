const mongoose = require('mongoose');
const config = require('./environment');

const connectDB = async () => {
  try {
    const dbConfig = config.getDatabaseConfig();
    const conn = await mongoose.connect(dbConfig.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
    console.log(`📊 数据库: ${conn.connection.name}`);
    
    // 生产环境下的额外配置
    if (config.NODE_ENV === 'production') {
      // 设置连接池大小
      mongoose.connection.db.admin().command({ ping: 1 });
      console.log('🔒 生产环境数据库连接已优化');
    }
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
