// 统一的应用状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { User, Recipe, Ingredient, Family, LoginRequest, RegisterRequest, CreateRecipeForm, CreateIngredientForm } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 状态
  const user = ref<User | null>(null)
  const recipes = ref<Recipe[]>([])
  const ingredients = ref<Ingredient[]>([])
  const families = ref<Family[]>([])
  const currentRecipe = ref<Recipe | null>(null)
  const currentIngredient = ref<Ingredient | null>(null)
  const currentFamily = ref<Family | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const recipesCount = computed(() => recipes.value.length)
  const ingredientsCount = computed(() => ingredients.value.length)
  const familiesCount = computed(() => families.value.length)
  
  const featuredRecipes = computed(() => 
    recipes.value.filter(recipe => recipe.rating >= 4.0).slice(0, 6)
  )
  
  const recentRecipes = computed(() => 
    [...recipes.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 6)
  )
  
  const categories = computed(() => {
    const cats = [...new Set(ingredients.value.map(ingredient => ingredient.category))]
    return cats.sort()
  })

  // 认证相关
  const login = async (credentials: LoginRequest) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.login(credentials)
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
      const response = await api.register(userData)
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
    localStorage.removeItem('token')
  }

  const getCurrentUser = async () => {
    if (!localStorage.getItem('token')) return null
    
    try {
      isLoading.value = true
      const userData = await api.getCurrentUser()
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
      error.value = null
      const updatedUser = await api.updateUser(userData)
      user.value = updatedUser
      return updatedUser
    } catch (err: any) {
      error.value = err.message || '更新用户信息失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 食谱相关
  const fetchRecipes = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.getRecipes()
      recipes.value = data
    } catch (err: any) {
      error.value = err.message || '获取食谱列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchRecipe = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.getRecipe(id)
      currentRecipe.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取食谱详情失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createRecipe = async (recipeData: CreateRecipeForm) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.createRecipe(recipeData)
      recipes.value.unshift(data)
      return data
    } catch (err: any) {
      error.value = err.message || '创建食谱失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateRecipe = async (id: string, recipeData: Partial<CreateRecipeForm>) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.updateRecipe(id, recipeData)
      
      const index = recipes.value.findIndex(recipe => recipe.id === id)
      if (index !== -1) {
        recipes.value[index] = data
      }
      
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = data
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || '更新食谱失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      await api.deleteRecipe(id)
      
      const index = recipes.value.findIndex(recipe => recipe.id === id)
      if (index !== -1) {
        recipes.value.splice(index, 1)
      }
      
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除食谱失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 食材相关
  const fetchIngredients = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.getIngredients()
      ingredients.value = data
    } catch (err: any) {
      error.value = err.message || '获取食材列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchIngredient = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.getIngredient(id)
      currentIngredient.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取食材详情失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createIngredient = async (ingredientData: CreateIngredientForm) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.createIngredient(ingredientData)
      ingredients.value.push(data)
      return data
    } catch (err: any) {
      error.value = err.message || '创建食材失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateIngredient = async (id: string, ingredientData: Partial<CreateIngredientForm>) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.updateIngredient(id, ingredientData)
      
      const index = ingredients.value.findIndex(ingredient => ingredient.id === id)
      if (index !== -1) {
        ingredients.value[index] = data
      }
      
      if (currentIngredient.value?.id === id) {
        currentIngredient.value = data
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || '更新食材失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteIngredient = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      await api.deleteIngredient(id)
      
      const index = ingredients.value.findIndex(ingredient => ingredient.id === id)
      if (index !== -1) {
        ingredients.value.splice(index, 1)
      }
      
      if (currentIngredient.value?.id === id) {
        currentIngredient.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除食材失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 家庭相关
  const fetchFamilies = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.getFamilies()
      families.value = data
    } catch (err: any) {
      error.value = err.message || '获取家庭列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchFamily = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.getFamily(id)
      currentFamily.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取家庭详情失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createFamily = async (familyData: { name: string; description?: string }) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.createFamily(familyData)
      families.value.push(data)
      currentFamily.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '创建家庭失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateFamily = async (id: string, familyData: { name?: string; description?: string }) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await api.updateFamily(id, familyData)
      
      const index = families.value.findIndex(family => family.id === id)
      if (index !== -1) {
        families.value[index] = data
      }
      
      if (currentFamily.value?.id === id) {
        currentFamily.value = data
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || '更新家庭失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteFamily = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      await api.deleteFamily(id)
      
      const index = families.value.findIndex(family => family.id === id)
      if (index !== -1) {
        families.value.splice(index, 1)
      }
      
      if (currentFamily.value?.id === id) {
        currentFamily.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除家庭失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 工具方法
  const clearError = () => {
    error.value = null
  }

  const setCurrentRecipe = (recipe: Recipe | null) => {
    currentRecipe.value = recipe
  }

  const setCurrentIngredient = (ingredient: Ingredient | null) => {
    currentIngredient.value = ingredient
  }

  const setCurrentFamily = (family: Family | null) => {
    currentFamily.value = family
  }

  // 初始化数据
  const initializeData = async () => {
    try {
      await Promise.all([
        fetchRecipes(),
        fetchIngredients(),
        fetchFamilies()
      ])
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  }

  return {
    // 状态
    user,
    recipes,
    ingredients,
    families,
    currentRecipe,
    currentIngredient,
    currentFamily,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    recipesCount,
    ingredientsCount,
    familiesCount,
    featuredRecipes,
    recentRecipes,
    categories,
    
    // 认证方法
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
    
    // 食谱方法
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    
    // 食材方法
    fetchIngredients,
    fetchIngredient,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    
    // 家庭方法
    fetchFamilies,
    fetchFamily,
    createFamily,
    updateFamily,
    deleteFamily,
    
    // 工具方法
    clearError,
    setCurrentRecipe,
    setCurrentIngredient,
    setCurrentFamily,
    initializeData
  }
})
