<template>
  <div class="recipe-detail-page">
    <div v-if="currentRecipe" class="recipe-detail">
      <div class="recipe-header">
        <img :src="currentRecipe.image" :alt="currentRecipe.title" class="recipe-image" />
        <div class="recipe-info">
          <h1>{{ currentRecipe.title }}</h1>
          <p>{{ currentRecipe.description }}</p>
          <div class="recipe-meta">
            <el-tag :type="getDifficultyType(currentRecipe.difficulty)" size="large">
              {{ getDifficultyText(currentRecipe.difficulty) }}
            </el-tag>
            <div class="time-info">
              <span>准备时间: {{ currentRecipe.prepTime }}分钟</span>
              <span>烹饪时间: {{ currentRecipe.cookTime }}分钟</span>
              <span>份量: {{ currentRecipe.servings }}人</span>
            </div>
            <el-rate v-model="currentRecipe.rating" disabled show-score />
          </div>
        </div>
      </div>
      
      <div class="recipe-content">
        <div class="ingredients-section">
          <h3>食材清单</h3>
          <div class="ingredients-list">
            <div
              v-for="ingredient in currentRecipe.ingredients"
              :key="ingredient.ingredientId"
              class="ingredient-item"
            >
              <span class="ingredient-name">{{ ingredient.name }}</span>
              <span class="ingredient-amount">{{ ingredient.amount }} {{ ingredient.unit }}</span>
            </div>
          </div>
        </div>
        
        <div class="steps-section">
          <h3>烹饪步骤</h3>
          <div class="steps-list">
            <div
              v-for="(step, index) in currentRecipe.steps"
              :key="index"
              class="step-item"
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
        
        <div class="nutrition-section">
          <h3>营养信息</h3>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="nutrition-label">卡路里</span>
              <span class="nutrition-value">{{ currentRecipe.nutrition.calories }}</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">蛋白质</span>
              <span class="nutrition-value">{{ currentRecipe.nutrition.protein }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">碳水化合物</span>
              <span class="nutrition-value">{{ currentRecipe.nutrition.carbs }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">脂肪</span>
              <span class="nutrition-value">{{ currentRecipe.nutrition.fat }}g</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="recipe-actions">
        <el-button type="primary" size="large" @click="startCooking">
          <el-icon><VideoPlay /></el-icon>
          开始烹饪
        </el-button>
        <el-button size="large" @click="editRecipe">
          <el-icon><Edit /></el-icon>
          编辑菜谱
        </el-button>
        <el-button type="danger" size="large" @click="deleteRecipe">
          <el-icon><Delete /></el-icon>
          删除菜谱
        </el-button>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <el-icon class="empty-icon"><Document /></el-icon>
      <h3>菜谱不存在</h3>
      <p>请检查菜谱ID是否正确</p>
      <el-button type="primary" @click="$router.push('/recipes')">
        返回菜谱列表
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, Edit, Delete, Document, InfoFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

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

const startCooking = () => {
  router.push(`/cooking/${currentRecipe.value?.id}`)
}

const editRecipe = () => {
  ElMessage.info('编辑功能开发中...')
}

const deleteRecipe = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个菜谱吗？此操作不可撤销。',
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (currentRecipe.value) {
      await appStore.deleteRecipe(currentRecipe.value.id)
      ElMessage.success('菜谱删除成功')
      router.push('/recipes')
    }
  } catch (error) {
    // 用户取消删除
  }
}

onMounted(async () => {
  const recipeId = route.params.id as string
  if (recipeId && (!currentRecipe.value || currentRecipe.value.id !== recipeId)) {
    try {
      await appStore.fetchRecipe(recipeId)
    } catch (error) {
      console.error('获取菜谱详情失败:', error)
    }
  }
})
</script>

<style scoped>
.recipe-detail-page {
  max-width: 1000px;
  margin: 0 auto;
}

.recipe-detail {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.recipe-header {
  display: flex;
  gap: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.recipe-info {
  flex: 1;
}

.recipe-info h1 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 32px;
  font-weight: 600;
}

.recipe-info p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.recipe-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-info {
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 14px;
}

.recipe-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.ingredients-section,
.steps-section,
.nutrition-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredients-section h3,
.steps-section h3,
.nutrition-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.ingredient-name {
  font-weight: 500;
  color: #333;
}

.ingredient-amount {
  color: #666;
  font-size: 14px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 16px;
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

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.nutrition-label {
  color: #666;
  font-size: 14px;
}

.nutrition-value {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.recipe-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  margin: 0 0 24px 0;
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
  
  .recipe-content {
    grid-template-columns: 1fr;
  }
  
  .time-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .recipe-actions {
    flex-direction: column;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr;
  }
}
</style>
