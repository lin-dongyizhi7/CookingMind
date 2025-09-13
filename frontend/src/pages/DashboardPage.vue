<template>
  <div class="dashboard">
    <div class="welcome-section">
      <h1>欢迎回来，{{ user?.nickname || user?.username }}！</h1>
      <p>今天想做什么美味呢？</p>
    </div>
    
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon recipes">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ recipesCount }}</h3>
            <p>菜谱总数</p>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon ingredients">
            <el-icon><Apple /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ ingredientsCount }}</h3>
            <p>食材种类</p>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon families">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ familiesCount }}</h3>
            <p>家庭数量</p>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="content-grid">
      <!-- 精选菜谱 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>精选菜谱</h3>
            <router-link to="/recipes" class="more-link">查看更多</router-link>
          </div>
        </template>
        
        <div class="recipe-list">
          <div
            v-for="recipe in featuredRecipes"
            :key="recipe.id"
            class="recipe-item"
            @click="viewRecipe(recipe)"
          >
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
            <div class="recipe-info">
              <h4>{{ recipe.title }}</h4>
              <p>{{ recipe.description }}</p>
              <div class="recipe-meta">
                <el-tag :type="getDifficultyType(recipe.difficulty)" size="small">
                  {{ getDifficultyText(recipe.difficulty) }}
                </el-tag>
                <span class="time">{{ recipe.prepTime + recipe.cookTime }}分钟</span>
                <el-rate v-model="recipe.rating" disabled show-score />
              </div>
            </div>
          </div>
        </div>
      </el-card>
      
      <!-- 最近菜谱 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <h3>最近添加</h3>
            <router-link to="/recipes" class="more-link">查看更多</router-link>
          </div>
        </template>
        
        <div class="recipe-list">
          <div
            v-for="recipe in recentRecipes"
            :key="recipe.id"
            class="recipe-item"
            @click="viewRecipe(recipe)"
          >
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
            <div class="recipe-info">
              <h4>{{ recipe.title }}</h4>
              <p>{{ recipe.description }}</p>
              <div class="recipe-meta">
                <el-tag :type="getDifficultyType(recipe.difficulty)" size="small">
                  {{ getDifficultyText(recipe.difficulty) }}
                </el-tag>
                <span class="time">{{ recipe.prepTime + recipe.cookTime }}分钟</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 快速操作 -->
    <el-card class="quick-actions">
      <template #header>
        <h3>快速操作</h3>
      </template>
      
      <div class="action-grid">
        <el-button type="primary" size="large" @click="$router.push('/recipes/create')">
          <el-icon><Plus /></el-icon>
          创建菜谱
        </el-button>
        
        <el-button type="success" size="large" @click="$router.push('/ingredients')">
          <el-icon><Apple /></el-icon>
          管理食材
        </el-button>
        
        <el-button type="warning" size="large" @click="$router.push('/cooking')">
          <el-icon><VideoPlay /></el-icon>
          开始烹饪
        </el-button>
        
        <el-button type="info" size="large" @click="$router.push('/family')">
          <el-icon><UserFilled /></el-icon>
          家庭管理
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  Document,
  Apple,
  UserFilled,
  Plus,
  VideoPlay
} from '@element-plus/icons-vue'
import type { Recipe } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const user = computed(() => appStore.user)
const recipesCount = computed(() => appStore.recipesCount)
const ingredientsCount = computed(() => appStore.ingredientsCount)
const familiesCount = computed(() => appStore.familiesCount)
const featuredRecipes = computed(() => appStore.featuredRecipes)
const recentRecipes = computed(() => appStore.recentRecipes)

const getDifficultyType = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'success'
    case 'medium': return 'warning'
    case 'hard': return 'danger'
    default: return 'info'
  }
}

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return '未知'
  }
}

const viewRecipe = (recipe: Recipe) => {
  appStore.setCurrentRecipe(recipe)
  router.push(`/recipes/${recipe.id}`)
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.welcome-section p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.recipes {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.ingredients {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.families {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info h3 {
  font-size: 28px;
  color: #333;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.stat-info p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.content-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.more-link {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.more-link:hover {
  text-decoration: underline;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recipe-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recipe-item:hover {
  background: #f5f5f5;
}

.recipe-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.recipe-info {
  flex: 1;
}

.recipe-info h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.recipe-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time {
  color: #999;
  font-size: 12px;
}

.quick-actions {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-grid .el-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-section h1 {
    font-size: 24px;
  }
}
</style>