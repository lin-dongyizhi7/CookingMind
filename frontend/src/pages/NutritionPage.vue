<template>
  <div class="nutrition-page">
    <div class="page-header">
      <h1>营养管理</h1>
      <p>跟踪您的营养摄入和健康数据</p>
    </div>
    
    <div class="nutrition-overview">
      <el-card class="overview-card">
        <template #header>
          <h3>今日营养摄入</h3>
        </template>
        <div class="nutrition-stats">
          <div class="stat-item">
            <div class="stat-value">{{ todayNutrition.calories }}</div>
            <div class="stat-label">卡路里</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ todayNutrition.protein }}g</div>
            <div class="stat-label">蛋白质</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ todayNutrition.carbs }}g</div>
            <div class="stat-label">碳水化合物</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ todayNutrition.fat }}g</div>
            <div class="stat-label">脂肪</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="nutrition-content">
      <el-card class="recipes-card">
        <template #header>
          <h3>营养丰富的菜谱</h3>
        </template>
        <div class="recipes-list">
          <div
            v-for="recipe in healthyRecipes"
            :key="recipe.id"
            class="recipe-item"
            @click="viewRecipe(recipe)"
          >
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
            <div class="recipe-info">
              <h4>{{ recipe.title }}</h4>
              <p>{{ recipe.description }}</p>
              <div class="nutrition-info">
                <span>{{ recipe.nutrition.calories }}卡路里</span>
                <span>{{ recipe.nutrition.protein }}g蛋白质</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-card class="ingredients-card">
        <template #header>
          <h3>高营养食材</h3>
        </template>
        <div class="ingredients-list">
          <div
            v-for="ingredient in healthyIngredients"
            :key="ingredient.id"
            class="ingredient-item"
          >
            <div class="ingredient-info">
              <h4>{{ ingredient.name }}</h4>
              <p>{{ ingredient.category }}</p>
            </div>
            <div class="nutrition-bars">
              <div class="nutrition-bar">
                <span>蛋白质</span>
                <div class="bar">
                  <div
                    class="bar-fill"
                    :style="{ width: `${(ingredient.nutrition.protein / 30) * 100}%` }"
                  ></div>
                </div>
                <span>{{ ingredient.nutrition.protein }}g</span>
              </div>
              <div class="nutrition-bar">
                <span>卡路里</span>
                <div class="bar">
                  <div
                    class="bar-fill"
                    :style="{ width: `${(ingredient.nutrition.calories / 200) * 100}%` }"
                  ></div>
                </div>
                <span>{{ ingredient.nutrition.calories }}cal</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { Recipe, Ingredient } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const recipes = computed(() => appStore.recipes)
const ingredients = computed(() => appStore.ingredients)

const todayNutrition = computed(() => {
  // 模拟今日营养数据
  return {
    calories: 1850,
    protein: 85,
    carbs: 220,
    fat: 65
  }
})

const healthyRecipes = computed(() => {
  return recipes.value
    .filter(recipe => recipe.nutrition.protein > 15 && recipe.nutrition.calories < 500)
    .slice(0, 6)
})

const healthyIngredients = computed(() => {
  return ingredients.value
    .filter(ingredient => ingredient.nutrition.protein > 10)
    .slice(0, 6)
})

const viewRecipe = (recipe: Recipe) => {
  appStore.setCurrentRecipe(recipe)
  router.push(`/recipes/${recipe.id}`)
}
</script>

<style scoped>
.nutrition-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 32px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.nutrition-overview {
  margin-bottom: 32px;
}

.overview-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overview-card h3 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.nutrition-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.nutrition-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.recipes-card,
.ingredients-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipes-card h3,
.ingredients-card h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.recipes-list,
.ingredients-list {
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
  object-fit: cover;
  border-radius: 8px;
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

.nutrition-info {
  display: flex;
  gap: 16px;
}

.nutrition-info span {
  color: #999;
  font-size: 12px;
}

.ingredient-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.ingredient-info {
  margin-bottom: 12px;
}

.ingredient-info h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.ingredient-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.nutrition-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nutrition-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.nutrition-bar span:first-child {
  width: 60px;
  color: #666;
}

.bar {
  flex: 1;
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #409EFF;
  border-radius: 4px;
  transition: width 0.3s;
}

.nutrition-bar span:last-child {
  width: 50px;
  text-align: right;
  color: #999;
}

@media (max-width: 768px) {
  .nutrition-content {
    grid-template-columns: 1fr;
  }
  
  .nutrition-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>