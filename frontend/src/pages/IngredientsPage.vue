<template>
  <div class="ingredients-page">
    <div class="page-header">
      <h1>食材管理</h1>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        添加食材
      </el-button>
    </div>
    
    <div class="filters">
      <el-input
        v-model="searchQuery"
        placeholder="搜索食材..."
        :prefix-icon="Search"
        class="search-input"
        @input="handleSearch"
      />
      <el-select v-model="categoryFilter" placeholder="分类" clearable>
        <el-option
          v-for="category in categories"
          :key="category"
          :label="category"
          :value="category"
        />
      </el-select>
    </div>
    
    <div class="ingredients-grid">
      <el-card
        v-for="ingredient in filteredIngredients"
        :key="ingredient.id"
        class="ingredient-card"
        @click="viewIngredient(ingredient)"
      >
        <div class="ingredient-content">
          <div class="ingredient-info">
            <h3>{{ ingredient.name }}</h3>
            <p class="category">{{ ingredient.category }}</p>
            <div class="nutrition">
              <span>{{ ingredient.nutrition.calories }}卡路里</span>
              <span>{{ ingredient.nutrition.protein }}g蛋白质</span>
            </div>
            <div class="storage">
              <el-tag size="small">{{ ingredient.storage }}</el-tag>
              <span class="shelf-life">保质期{{ ingredient.shelfLife }}天</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 创建食材对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="添加食材"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入食材名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入食材分类" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="存储方式" prop="storage">
          <el-input v-model="form.storage" placeholder="请输入存储方式" />
        </el-form-item>
        <el-form-item label="保质期" prop="shelfLife">
          <el-input-number v-model="form.shelfLife" :min="1" :max="365" />
        </el-form-item>
        <el-form-item label="卡路里" prop="nutrition.calories">
          <el-input-number v-model="form.nutrition.calories" :min="0" />
        </el-form-item>
        <el-form-item label="蛋白质" prop="nutrition.protein">
          <el-input-number v-model="form.nutrition.protein" :min="0" />
        </el-form-item>
        <el-form-item label="碳水化合物" prop="nutrition.carbs">
          <el-input-number v-model="form.nutrition.carbs" :min="0" />
        </el-form-item>
        <el-form-item label="脂肪" prop="nutrition.fat">
          <el-input-number v-model="form.nutrition.fat" :min="0" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleCreate">
          添加
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Ingredient, CreateIngredientForm } from '@/types'

const appStore = useAppStore()

const searchQuery = ref('')
const categoryFilter = ref('')
const showCreateDialog = ref(false)
const isLoading = ref(false)

const formRef = ref<FormInstance>()

const form = reactive<CreateIngredientForm>({
  name: '',
  category: '',
  unit: '',
  nutrition: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  },
  storage: '',
  shelfLife: 1
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入食材名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请输入食材分类', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ],
  storage: [
    { required: true, message: '请输入存储方式', trigger: 'blur' }
  ]
}

const ingredients = computed(() => appStore.ingredients)
const categories = computed(() => appStore.categories)

const filteredIngredients = computed(() => {
  let filtered = ingredients.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ingredient.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(ingredient => ingredient.category === categoryFilter.value)
  }
  
  return filtered
})

const viewIngredient = (ingredient: Ingredient) => {
  appStore.setCurrentIngredient(ingredient)
  // 可以添加查看详情的逻辑
}

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    category: '',
    unit: '',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    storage: '',
    shelfLife: 1
  })
}

const handleCreate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await appStore.createIngredient(form)
    ElMessage.success('食材添加成功')
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('添加食材失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.ingredients-page {
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

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.ingredient-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.ingredient-content {
  padding: 16px;
}

.ingredient-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.category {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.nutrition {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.nutrition span {
  color: #999;
  font-size: 12px;
}

.storage {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shelf-life {
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
  
  .ingredients-grid {
    grid-template-columns: 1fr;
  }
}
</style>