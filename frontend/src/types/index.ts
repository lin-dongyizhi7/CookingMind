// 统一类型定义
export interface User {
  id: string
  username: string
  email: string
  nickname: string
  avatar?: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  category: string
  unit: string
  nutrition: Nutrition
  storage: string
  shelfLife: number
  quantity?: number
  createdAt: Date
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
  prepTime: number
  cookTime: number
  servings: number
  rating: number
  tags: string[]
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  nutrition: Nutrition
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface RecipeIngredient {
  ingredientId: string
  name: string
  amount: string
  unit: string
  isOptional?: boolean
}

export interface RecipeStep {
  id: string
  description: string
  image?: string
  video?: string
  duration?: number
  tips?: string
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
}

export interface Family {
  id: string
  name: string
  description: string
  members: FamilyMember[]
  createdAt: Date
  updatedAt: Date
}

export interface FamilyMember {
  userId: string
  role: 'admin' | 'member'
  joinedAt: Date
}

// API 请求/响应类型
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  nickname?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

// 表单类型
export interface CreateRecipeForm {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  prepTime: number
  cookTime: number
  servings: number
  tags: string[]
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
}

export interface CreateIngredientForm {
  name: string
  category: string
  unit: string
  nutrition: Nutrition
  storage: string
  shelfLife: number
}

// 状态类型
export interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface RecipesState {
  recipes: Recipe[]
  currentRecipe: Recipe | null
  isLoading: boolean
  error: string | null
}

export interface IngredientsState {
  ingredients: Ingredient[]
  currentIngredient: Ingredient | null
  isLoading: boolean
  error: string | null
}

export interface FamilyState {
  families: Family[]
  currentFamily: Family | null
  isLoading: boolean
  error: string | null
}
