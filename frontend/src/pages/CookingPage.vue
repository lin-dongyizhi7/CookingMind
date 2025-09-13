<template>
  <div class="cooking-page">
    <div class="page-header">
      <h1>烹饪指导</h1>
      <p>选择菜谱开始烹饪</p>
    </div>
    
    <div class="recipe-selector">
      <el-select
        v-model="selectedRecipeId"
        placeholder="选择要烹饪的菜谱"
        size="large"
        @change="handleRecipeSelect"
      >
        <el-option
          v-for="recipe in recipes"
          :key="recipe.id"
          :label="recipe.title"
          :value="recipe.id"
        />
      </el-select>
    </div>
    
    <div v-if="currentRecipe" class="cooking-content">
      <el-card class="recipe-info">
        <div class="recipe-header">
          <img :src="currentRecipe.image" :alt="currentRecipe.title" class="recipe-image" />
          <div class="recipe-details">
            <h2>{{ currentRecipe.title }}</h2>
            <p>{{ currentRecipe.description }}</p>
            <div class="recipe-meta">
              <el-tag :type="getDifficultyType(currentRecipe.difficulty)">
                {{ getDifficultyText(currentRecipe.difficulty) }}
              </el-tag>
              <span>准备时间: {{ currentRecipe.prepTime }}分钟</span>
              <span>烹饪时间: {{ currentRecipe.cookTime }}分钟</span>
              <span>份量: {{ currentRecipe.servings }}人</span>
            </div>
          </div>
        </div>
      </el-card>
      
      <div class="cooking-steps">
        <h3>烹饪步骤</h3>
        <div class="steps-list">
          <div
            v-for="(step, index) in currentRecipe.steps"
            :key="index"
            class="step-item"
            :class="{ active: currentStep === index }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <p>{{ step.description }}</p>
              <div v-if="step.tips" class="step-tips">
                <el-icon><InfoFilled /></el-icon>
                <span>{{ step.tips }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cooking-controls">
        <el-button
          v-if="currentStep > 0"
          @click="previousStep"
          :disabled="isCooking"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          @click="toggleCooking"
          :loading="isCooking"
        >
          {{ isCooking ? '暂停烹饪' : '开始烹饪' }}
        </el-button>
        <el-button
          v-if="currentStep < currentRecipe.steps.length - 1"
          @click="nextStep"
          :disabled="!isCooking"
        >
          下一步
        </el-button>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <el-icon class="empty-icon"><VideoPlay /></el-icon>
      <h3>请选择要烹饪的菜谱</h3>
      <p>从上方下拉菜单中选择一个菜谱开始烹饪</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { VideoPlay, InfoFilled } from '@element-plus/icons-vue'
import type { Recipe } from '@/types'

const appStore = useAppStore()

const selectedRecipeId = ref('')
const currentStep = ref(0)
const isCooking = ref(false)

const recipes = computed(() => appStore.recipes)
const currentRecipe = computed(() => appStore.currentRecipe)

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

const handleRecipeSelect = (recipeId: string) => {
  const recipe = recipes.value.find(r => r.id === recipeId)
  if (recipe) {
    appStore.setCurrentRecipe(recipe)
    currentStep.value = 0
    isCooking.value = false
  }
}

const toggleCooking = () => {
  isCooking.value = !isCooking.value
  if (isCooking.value) {
    ElMessage.success('开始烹饪！')
  } else {
    ElMessage.info('暂停烹饪')
  }
}

const nextStep = () => {
  if (currentStep.value < currentRecipe.value!.steps.length - 1) {
    currentStep.value++
    ElMessage.success(`进入第 ${currentStep.value + 1} 步`)
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    ElMessage.info(`回到第 ${currentStep.value + 1} 步`)
  }
}
</script>

<style scoped>
.cooking-page {
  max-width: 1000px;
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

.recipe-selector {
  margin-bottom: 32px;
  text-align: center;
}

.recipe-selector .el-select {
  width: 300px;
}

.cooking-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recipe-info {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-header {
  display: flex;
  gap: 24px;
}

.recipe-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.recipe-details {
  flex: 1;
}

.recipe-details h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.recipe-details p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.recipe-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.recipe-meta span {
  color: #999;
  font-size: 14px;
}

.cooking-steps h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s;
}

.step-item.active {
  background: #e3f2fd;
  border: 2px solid #409EFF;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content p {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
}

.step-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  background: #fff3cd;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
}

.cooking-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .recipe-header {
    flex-direction: column;
  }
  
  .recipe-image {
    width: 100%;
    height: 200px;
  }
  
  .recipe-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cooking-controls {
    flex-direction: column;
  }
}
</style>