import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api/authAPI'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 动作
  const login = async (credentials: LoginRequest) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.login(credentials)
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('token', response.token)
      return response
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.register(userData)
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('token', response.token)
      return response
    } catch (err: any) {
      error.value = err.message || '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const getCurrentUser = async () => {
    if (!token.value) return null
    
    try {
      isLoading.value = true
      const userData = await authAPI.getCurrentUser()
      user.value = userData
      return userData
    } catch (err: any) {
      console.error('获取用户信息失败:', err)
      logout()
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      isLoading.value = true
      const updatedUser = await authAPI.updateUser(userData)
      user.value = updatedUser
      return updatedUser
    } catch (err: any) {
      error.value = err.message || '更新用户信息失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    
    // 动作
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
    clearError,
    setLoading
  }
})
