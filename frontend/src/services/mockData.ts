// 假数据服务
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    nickname: '管理员',
    avatar: 'https://via.placeholder.com/100x100/409EFF/FFFFFF?text=A',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    nickname: '美食爱好者',
    avatar: 'https://via.placeholder.com/100x100/67C23A/FFFFFF?text=U',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

// 模拟食谱数据
const mockRecipes = [
  {
    id: '1',
    title: '宫保鸡丁',
    description: '经典川菜，麻辣鲜香',
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=宫保鸡丁',
    difficulty: 'medium',
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    rating: 4.5,
    tags: ['川菜', '家常菜', '下饭菜'],
    ingredients: [
      { name: '鸡胸肉', amount: '300g', unit: '克' },
      { name: '花生米', amount: '50g', unit: '克' },
      { name: '干辣椒', amount: '10个', unit: '个' },
      { name: '花椒', amount: '1勺', unit: '勺' }
    ],
    steps: [
      '鸡胸肉切丁，用料酒、生抽、淀粉腌制15分钟',
      '花生米炸至金黄，捞出备用',
      '热锅下油，爆炒鸡丁至变色',
      '加入干辣椒、花椒炒香',
      '调入糖、醋、生抽炒匀',
      '最后加入花生米炒匀即可'
    ],
    nutrition: {
      calories: 320,
      protein: 25,
      carbs: 15,
      fat: 18
    },
    authorId: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    title: '番茄鸡蛋面',
    description: '简单易做的家常面食',
    image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=番茄鸡蛋面',
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    rating: 4.2,
    tags: ['面食', '家常菜', '快手菜'],
    ingredients: [
      { name: '面条', amount: '200g', unit: '克' },
      { name: '鸡蛋', amount: '2个', unit: '个' },
      { name: '番茄', amount: '2个', unit: '个' },
      { name: '小葱', amount: '2根', unit: '根' }
    ],
    steps: [
      '番茄切块，鸡蛋打散',
      '热锅下油，炒鸡蛋盛起',
      '下番茄炒出汁水',
      '加水煮开，下面条',
      '面条快熟时加入炒蛋',
      '调味，撒葱花即可'
    ],
    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 45,
      fat: 8
    },
    authorId: '2',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
]

// 模拟食材数据
const mockIngredients = [
  {
    id: '1',
    name: '鸡胸肉',
    category: '肉类',
    unit: '克',
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6
    },
    storage: '冷藏',
    shelfLife: 3,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: '番茄',
    category: '蔬菜',
    unit: '个',
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2
    },
    storage: '常温',
    shelfLife: 7,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: '鸡蛋',
    category: '蛋类',
    unit: '个',
    nutrition: {
      calories: 70,
      protein: 6,
      carbs: 0.6,
      fat: 5
    },
    storage: '冷藏',
    shelfLife: 30,
    createdAt: new Date('2024-01-01')
  }
]

// 模拟家庭数据
const mockFamilies = [
  {
    id: '1',
    name: '张家的厨房',
    description: '温馨的家庭厨房',
    members: [
      { userId: '1', role: 'admin', joinedAt: new Date('2024-01-01') },
      { userId: '2', role: 'member', joinedAt: new Date('2024-01-15') }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API响应
export const mockAPI = {
  // 认证相关
  auth: {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
      await delay(1000) // 模拟网络延迟
      
      const user = mockUsers.find(u => 
        u.username === credentials.username || u.email === credentials.username
      )
      
      if (!user) {
        throw new Error('用户不存在')
      }
      
      return {
        user,
        token: `mock_token_${user.id}_${Date.now()}`
      }
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
      await delay(1000)
      
      const existingUser = mockUsers.find(u => 
        u.username === userData.username || u.email === userData.email
      )
      
      if (existingUser) {
        throw new Error('用户名或邮箱已存在')
      }
      
      const newUser: User = {
        id: String(mockUsers.length + 1),
        username: userData.username,
        email: userData.email,
        nickname: userData.nickname || userData.username,
        avatar: 'https://via.placeholder.com/100x100/909399/FFFFFF?text=N',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockUsers.push(newUser)
      
      return {
        user: newUser,
        token: `mock_token_${newUser.id}_${Date.now()}`
      }
    },

    getCurrentUser: async (): Promise<User> => {
      await delay(500)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未登录')
      }
      
      const userId = token.split('_')[2]
      const user = mockUsers.find(u => u.id === userId)
      
      if (!user) {
        throw new Error('用户不存在')
      }
      
      return user
    },

    updateUser: async (userData: Partial<User>): Promise<User> => {
      await delay(500)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未登录')
      }
      
      const userId = token.split('_')[2]
      const userIndex = mockUsers.findIndex(u => u.id === userId)
      
      if (userIndex === -1) {
        throw new Error('用户不存在')
      }
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, updatedAt: new Date() }
      return mockUsers[userIndex]
    }
  },

  // 食谱相关
  recipes: {
    getAll: async () => {
      await delay(800)
      return mockRecipes
    },

    getById: async (id: string) => {
      await delay(500)
      const recipe = mockRecipes.find(r => r.id === id)
      if (!recipe) {
        throw new Error('食谱不存在')
      }
      return recipe
    },

    create: async (recipeData: any) => {
      await delay(1000)
      const newRecipe = {
        id: String(mockRecipes.length + 1),
        ...recipeData,
        authorId: '1', // 模拟当前用户
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockRecipes.push(newRecipe)
      return newRecipe
    },

    update: async (id: string, recipeData: any) => {
      await delay(500)
      const index = mockRecipes.findIndex(r => r.id === id)
      if (index === -1) {
        throw new Error('食谱不存在')
      }
      mockRecipes[index] = { ...mockRecipes[index], ...recipeData, updatedAt: new Date() }
      return mockRecipes[index]
    },

    delete: async (id: string) => {
      await delay(500)
      const index = mockRecipes.findIndex(r => r.id === id)
      if (index === -1) {
        throw new Error('食谱不存在')
      }
      mockRecipes.splice(index, 1)
      return true
    }
  },

  // 食材相关
  ingredients: {
    getAll: async () => {
      await delay(600)
      return mockIngredients
    },

    getById: async (id: string) => {
      await delay(300)
      const ingredient = mockIngredients.find(i => i.id === id)
      if (!ingredient) {
        throw new Error('食材不存在')
      }
      return ingredient
    },

    create: async (ingredientData: any) => {
      await delay(800)
      const newIngredient = {
        id: String(mockIngredients.length + 1),
        ...ingredientData,
        createdAt: new Date()
      }
      mockIngredients.push(newIngredient)
      return newIngredient
    }
  },

  // 家庭相关
  families: {
    getAll: async () => {
      await delay(500)
      return mockFamilies
    },

    getById: async (id: string) => {
      await delay(300)
      const family = mockFamilies.find(f => f.id === id)
      if (!family) {
        throw new Error('家庭不存在')
      }
      return family
    }
  }
}

export default mockAPI
