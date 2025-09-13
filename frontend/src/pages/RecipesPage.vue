<template>
  <div class="recipes-page">
    <div class="page-header">
      <h1>菜谱管理</h1>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        创建菜谱
      </el-button>
    </div>
    
    <div class="filters">
      <el-input
        v-model="searchQuery"
        placeholder="搜索菜谱..."
        :prefix-icon="Search"
        class="search-input"
        @input="handleSearch"
      />
      <el-select v-model="difficultyFilter" placeholder="难度" clearable>
        <el-option label="简单" value="easy" />
        <el-option label="中等" value="medium" />
        <el-option label="困难" value="hard" />
      </el-select>
    </div>
    
    <div class="recipes-grid">
      <el-card
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="recipe-card"
        @click="viewRecipe(recipe)"
      >
        <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
        <div class="recipe-content">
          <h3>{{ recipe.title }}</h3>
          <p>{{ recipe.description }}</p>
          <div class="recipe-meta">
            <el-tag :type="getDifficultyType(recipe.difficulty)" size="small">
              {{ getDifficultyText(recipe.difficulty) }}
            </el-tag>
            <span class="time">{{ recipe.prepTime + recipe.cookTime }}分钟</span>
            <el-rate v-model="recipe.rating" disabled show-score />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 创建菜谱对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建菜谱"
      width="600px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入菜谱标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入菜谱描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
        <el-form-item label="准备时间" prop="prepTime">
          <el-input-number v-model="form.prepTime" :min="0" :max="300" />
        </el-form-item>
        <el-form-item label="烹饪时间" prop="cookTime">
          <el-input-number v-model="form.cookTime" :min="0" :max="300" />
        </el-form-item>
        <el-form-item label="份量" prop="servings">
          <el-input-number v-model="form.servings" :min="1" :max="20" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleCreate">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Recipe, CreateRecipeForm } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const searchQuery = ref('')
const difficultyFilter = ref('')
const showCreateDialog = ref(false)
const isLoading = ref(false)

const formRef = ref<FormInstance>()

const form = reactive<CreateRecipeForm>({
  title: '',
  description: '',
  difficulty: 'easy',
  prepTime: 0,
  cookTime: 0,
  servings: 1,
  tags: [],
  ingredients: [],
  steps: []
})

const rules: FormRules = {
  title: [
    { required: true, message: '请输入菜谱标题', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入菜谱描述', trigger: 'blur' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ]
}

const recipes = computed(() => appStore.recipes)

const filteredRecipes = computed(() => {
  let filtered = recipes.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (difficultyFilter.value) {
    filtered = filtered.filter(recipe => recipe.difficulty === difficultyFilter.value)
  }
  
  return filtered
})

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

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    difficulty: 'easy',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    tags: [],
    ingredients: [],
    steps: []
  })
}

const handleCreate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await appStore.createRecipe(form)
    ElMessage.success('菜谱创建成功')
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('创建菜谱失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.recipes-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.recipe-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.recipe-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.recipe-content p {
  margin: 0 0 12px 0;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-input {
    max-width: none;
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>