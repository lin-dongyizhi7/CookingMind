import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/DashboardPage.vue')
      },
      {
        path: 'ingredients',
        name: 'Ingredients',
        component: () => import('../pages/IngredientsPage.vue')
      },
      {
        path: 'recipes',
        name: 'Recipes',
        component: () => import('../pages/RecipesPage.vue')
      },
      {
        path: 'recipes/:id',
        name: 'RecipeDetail',
        component: () => import('../pages/RecipeDetailPage.vue')
      },
      {
        path: 'cooking/:id?',
        name: 'Cooking',
        component: () => import('../pages/CookingPage.vue')
      },
      {
        path: 'nutrition',
        name: 'Nutrition',
        component: () => import('../pages/NutritionPage.vue')
      },
      {
        path: 'family',
        name: 'Family',
        component: () => import('../pages/FamilyPage.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../pages/ProfilePage.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const appStore = useAppStore()
  
  if (to.meta.requiresAuth && !appStore.isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && appStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
