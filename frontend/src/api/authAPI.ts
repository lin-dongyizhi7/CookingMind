import { apiRequest } from './client'
import type { LoginRequest, RegisterRequest, User, AuthResponse, ChangePasswordRequest } from '@/types/auth'

export const authAPI = {
  // 用户登录
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiRequest.post<AuthResponse>('/auth/login', credentials)
  },

  // 用户注册
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiRequest.post<AuthResponse>('/auth/register', userData)
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    return apiRequest.get<User>('/auth/me')
  },

  // 更新用户信息
  updateUser: async (userData: Partial<User>): Promise<User> => {
    return apiRequest.put<User>('/auth/me', userData)
  },

  // 修改密码
  changePassword: async (passwordData: ChangePasswordRequest): Promise<void> => {
    return apiRequest.post('/auth/change-password', passwordData)
  },

  // 用户登出
  logout: async (): Promise<void> => {
    return apiRequest.post('/auth/logout')
  },

  // 刷新令牌
  refreshToken: async (): Promise<{ token: string }> => {
    return apiRequest.post<{ token: string }>('/auth/refresh-token')
  }
}
