/*
 * @Author: 凛冬已至 2985956026@qq.com
 * @Date: 2025-08-29 23:57:12
 * @LastEditors: 凛冬已至 2985956026@qq.com
 * @LastEditTime: 2025-08-30 09:44:02
 * @FilePath: \CookingMind\frontend\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/auth/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
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

export default routes
