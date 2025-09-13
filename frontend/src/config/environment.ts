// 环境配置
export const config = {
  // API基础URL
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // 开发环境配置
  isDevelopment: import.meta.env.DEV,
  
  // 调试模式
  debug: import.meta.env.DEV,
  
  // 假数据模式
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.DEV,
  
  // 超时设置
  timeout: 10000,
  
  // 重试次数
  retryCount: 3,
  
  // 日志级别
  logLevel: import.meta.env.DEV ? 'debug' : 'error'
}

// 日志工具
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (config.debug) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },
  
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args)
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  }
}
