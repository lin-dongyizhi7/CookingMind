// 统一的API服务
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { config, logger } from '@/config/environment'
import { mockAPI } from './mockData'
import type { ApiResponse, User, Recipe, Ingredient, Family, LoginRequest, RegisterRequest, AuthResponse, CreateRecipeForm, CreateIngredientForm } from '@/types'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        logger.debug('API请求:', config.url)
        return config
      },
      (error) => {
        logger.error('请求错误:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API响应:', response.data)
        return response.data
      },
      (error) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  private handleError(error: any) {
    const { response } = error
    
    logger.error('API错误:', {
      url: error.config?.url,
      status: response?.status,
      message: error.message,
    })
    
    if (response) {
      switch (response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(response.data?.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
  }

  private async request<T>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (config?.useMockData !== false && this.shouldUseMockData(url)) {
      logger.debug('使用假数据:', url)
      return this.handleMockRequest(method, url, data)
    }

    const response = await this.client.request({
      method,
      url,
      data,
      ...config,
    })
    return response
  }

  private shouldUseMockData(url: string): boolean {
    if (!config.useMockData) return false
    const mockRoutes = ['/auth/', '/recipes/', '/ingredients/', '/families/']
    return mockRoutes.some(route => url.includes(route))
  }

  private async handleMockRequest(method: string, url: string, data?: any): Promise<any> {
    const path = url.replace('/api', '')
    
    if (path.startsWith('/auth/')) {
      return this.handleAuthMock(method, path, data)
    } else if (path.startsWith('/recipes/')) {
      return this.handleRecipesMock(method, path, data)
    } else if (path.startsWith('/ingredients/')) {
      return this.handleIngredientsMock(method, path, data)
    } else if (path.startsWith('/families/')) {
      return this.handleFamiliesMock(method, path, data)
    }
    
    throw new Error(`未找到对应的假数据API: ${path}`)
  }

  private async handleAuthMock(method: string, path: string, data?: any) {
    switch (path) {
      case '/auth/login':
        return mockAPI.auth.login(data)
      case '/auth/register':
        return mockAPI.auth.register(data)
      case '/auth/me':
        return method === 'PUT' ? mockAPI.auth.updateUser(data) : mockAPI.auth.getCurrentUser()
      default:
        throw new Error(`未支持的认证API: ${path}`)
    }
  }

  private async handleRecipesMock(method: string, path: string, data?: any) {
    const idMatch = path.match(/\/recipes\/(.+)/)
    const id = idMatch ? idMatch[1] : null
    
    switch (method) {
      case 'GET':
        return id ? mockAPI.recipes.getById(id) : mockAPI.recipes.getAll()
      case 'POST':
        return mockAPI.recipes.create(data)
      case 'PUT':
        if (!id) throw new Error('缺少食谱ID')
        return mockAPI.recipes.update(id, data)
      case 'DELETE':
        if (!id) throw new Error('缺少食谱ID')
        return mockAPI.recipes.delete(id)
      default:
        throw new Error(`未支持的食谱API: ${method} ${path}`)
    }
  }

  private async handleIngredientsMock(method: string, path: string, data?: any) {
    const idMatch = path.match(/\/ingredients\/(.+)/)
    const id = idMatch ? idMatch[1] : null
    
    switch (method) {
      case 'GET':
        return id ? mockAPI.ingredients.getById(id) : mockAPI.ingredients.getAll()
      case 'POST':
        return mockAPI.ingredients.create(data)
      case 'PUT':
        if (!id) throw new Error('缺少食材ID')
        return mockAPI.ingredients.update(id, data)
      case 'DELETE':
        if (!id) throw new Error('缺少食材ID')
        return mockAPI.ingredients.delete(id)
      default:
        throw new Error(`未支持的食材API: ${method} ${path}`)
    }
  }

  private async handleFamiliesMock(method: string, path: string, data?: any) {
    const idMatch = path.match(/\/families\/(.+)/)
    const id = idMatch ? idMatch[1] : null
    
    switch (method) {
      case 'GET':
        return id ? mockAPI.families.getById(id) : mockAPI.families.getAll()
      case 'POST':
        return mockAPI.families.create(data)
      case 'PUT':
        if (!id) throw new Error('缺少家庭ID')
        return mockAPI.families.update(id, data)
      case 'DELETE':
        if (!id) throw new Error('缺少家庭ID')
        return mockAPI.families.delete(id)
      default:
        throw new Error(`未支持的家庭API: ${method} ${path}`)
    }
  }

  // 认证相关
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/auth/login', credentials)
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/auth/register', userData)
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('GET', '/auth/me')
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    return this.request<User>('PUT', '/auth/me', userData)
  }

  async logout(): Promise<void> {
    return this.request<void>('POST', '/auth/logout')
  }

  // 食谱相关
  async getRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>('GET', '/recipes')
  }

  async getRecipe(id: string): Promise<Recipe> {
    return this.request<Recipe>('GET', `/recipes/${id}`)
  }

  async createRecipe(recipeData: CreateRecipeForm): Promise<Recipe> {
    return this.request<Recipe>('POST', '/recipes', recipeData)
  }

  async updateRecipe(id: string, recipeData: Partial<CreateRecipeForm>): Promise<Recipe> {
    return this.request<Recipe>('PUT', `/recipes/${id}`, recipeData)
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.request<void>('DELETE', `/recipes/${id}`)
  }

  // 食材相关
  async getIngredients(): Promise<Ingredient[]> {
    return this.request<Ingredient[]>('GET', '/ingredients')
  }

  async getIngredient(id: string): Promise<Ingredient> {
    return this.request<Ingredient>('GET', `/ingredients/${id}`)
  }

  async createIngredient(ingredientData: CreateIngredientForm): Promise<Ingredient> {
    return this.request<Ingredient>('POST', '/ingredients', ingredientData)
  }

  async updateIngredient(id: string, ingredientData: Partial<CreateIngredientForm>): Promise<Ingredient> {
    return this.request<Ingredient>('PUT', `/ingredients/${id}`, ingredientData)
  }

  async deleteIngredient(id: string): Promise<void> {
    return this.request<void>('DELETE', `/ingredients/${id}`)
  }

  // 家庭相关
  async getFamilies(): Promise<Family[]> {
    return this.request<Family[]>('GET', '/families')
  }

  async getFamily(id: string): Promise<Family> {
    return this.request<Family>('GET', `/families/${id}`)
  }

  async createFamily(familyData: { name: string; description?: string }): Promise<Family> {
    return this.request<Family>('POST', '/families', familyData)
  }

  async updateFamily(id: string, familyData: { name?: string; description?: string }): Promise<Family> {
    return this.request<Family>('PUT', `/families/${id}`, familyData)
  }

  async deleteFamily(id: string): Promise<void> {
    return this.request<void>('DELETE', `/families/${id}`)
  }
}

export const api = new ApiService()
export default api
