export interface User {
  _id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  familyId?: string
  preferences?: {
    dietaryRestrictions?: string[]
    allergies?: string[]
    favoriteCuisines?: string[]
    spiceLevel?: 'mild' | 'medium' | 'hot'
  }
  nutritionGoals?: {
    dailyCalories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: any
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}
