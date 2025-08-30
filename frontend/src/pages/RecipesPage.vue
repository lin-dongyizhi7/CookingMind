<template>
  <div class="recipes-page">
    <AppHeader />
    <AppSider />
    
    <div class="main-content">
      <div class="page-header">
        <h1>食谱管理</h1>
        <p>发现和创建美味食谱，AI智能推荐</p>
      </div>
      
      <div class="actions-bar">
        <el-space>
          <el-button type="primary" @click="showGenerateModal = true">
            <el-icon><Robot /></el-icon>
            AI 生成食谱
          </el-button>
          <el-button @click="showAddModal = true">
            <el-icon><Plus /></el-icon>
            添加食谱
          </el-button>
        </el-space>
      </div>
      
      <div class="recipes-grid">
        <el-card
          v-for="recipe in recipes"
          :key="recipe.id"
          class="recipe-card"
          @click="viewRecipe(recipe)"
        >
          <el-image
            :src="recipe.image || '/placeholder-recipe.jpg'"
            fit="cover"
            class="recipe-image"
          />
          
          <div class="recipe-content">
            <h3 class="recipe-title">{{ recipe.title }}</h3>
            <p class="recipe-description">{{ recipe.description }}</p>
            
            <div class="recipe-meta">
              <el-avatar :src="recipe.author?.avatar" :size="24">
                {{ recipe.author?.name?.charAt(0) }}
              </el-avatar>
              <span class="author-name">{{ recipe.author?.name }}</span>
            </div>
            
            <div class="recipe-tags">
              <el-tag :type="getDifficultyType(recipe.difficulty)" size="small">
                {{ recipe.difficulty }}
              </el-tag>
              <el-tag type="info" size="small">{{ recipe.cuisine }}</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- AI生成食谱模态框 -->
    <el-dialog
      v-model="showGenerateModal"
      title="AI 生成食谱"
      width="600px"
    >
      <el-form :model="generateForm" label-width="100px">
        <el-form-item label="主要食材">
          <el-select
            v-model="generateForm.ingredients"
            multiple
            placeholder="选择主要食材"
            style="width: 100%"
          >
            <el-option value="tomato" label="番茄" />
            <el-option value="egg" label="鸡蛋" />
            <el-option value="chicken" label="鸡肉" />
            <el-option value="beef" label="牛肉" />
            <el-option value="fish" label="鱼" />
            <el-option value="pork" label="猪肉" />
            <el-option value="carrot" label="胡萝卜" />
            <el-option value="onion" label="洋葱" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="菜系">
          <el-select v-model="generateForm.cuisine" placeholder="选择菜系" style="width: 100%">
            <el-option value="chinese" label="中餐" />
            <el-option value="western" label="西餐" />
            <el-option value="japanese" label="日料" />
            <el-option value="korean" label="韩料" />
            <el-option value="thai" label="泰式" />
            <el-option value="italian" label="意式" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="口味偏好">
          <el-select v-model="generateForm.taste" placeholder="选择口味偏好" style="width: 100%">
            <el-option value="spicy" label="辣味" />
            <el-option value="sweet" label="甜味" />
            <el-option value="sour" label="酸味" />
            <el-option value="umami" label="鲜味" />
            <el-option value="light" label="清淡" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="烹饪时间">
          <el-select v-model="generateForm.cookingTime" placeholder="选择烹饪时间" style="width: 100%">
            <el-option value="quick" label="快速 (15分钟内)" />
            <el-option value="medium" label="中等 (15-30分钟)" />
            <el-option value="slow" label="慢炖 (30分钟以上)" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="特殊要求">
          <el-input
            v-model="generateForm.requirements"
            type="textarea"
            :rows="3"
            placeholder="例如：低脂、无麸质、素食等"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-space>
          <el-button @click="showGenerateModal = false">取消</el-button>
          <el-button type="primary" @click="handleGenerateRecipe">生成食谱</el-button>
        </el-space>
      </template>
    </el-dialog>
    
    <!-- 添加食谱模态框 -->
    <el-dialog
      v-model="showAddModal"
      title="添加食谱"
      width="600px"
    >
      <el-form :model="newRecipe" label-width="100px">
        <el-form-item label="食谱名称">
          <el-input v-model="newRecipe.title" placeholder="请输入食谱名称" />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input
            v-model="newRecipe.description"
            type="textarea"
            :rows="3"
            placeholder="请输入食谱描述"
          />
        </el-form-item>
        
        <el-form-item label="菜系">
          <el-select v-model="newRecipe.cuisine" placeholder="选择菜系" style="width: 100%">
            <el-option value="chinese" label="中餐" />
            <el-option value="western" label="西餐" />
            <el-option value="japanese" label="日料" />
            <el-option value="korean" label="韩料" />
            <el-option value="thai" label="泰式" />
            <el-option value="italian" label="意式" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="难度">
          <el-select v-model="newRecipe.difficulty" placeholder="选择难度" style="width: 100%">
            <el-option value="简单" label="简单" />
            <el-option value="中等" label="中等" />
            <el-option value="困难" label="困难" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="烹饪时间">
          <el-input-number v-model="newRecipe.cookingTime" :min="1" style="width: 100%" />
          <span class="time-unit">分钟</span>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-space>
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="handleAddRecipe">添加</el-button>
        </el-space>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Robot, Plus } from '@element-plus/icons-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'

// 响应式数据
const loading = ref(false)
const showGenerateModal = ref(false)
const showAddModal = ref(false)

const generateForm = reactive({
  ingredients: [],
  cuisine: '',
  taste: '',
  cookingTime: '',
  requirements: ''
})

const newRecipe = reactive({
  title: '',
  description: '',
  cuisine: '',
  difficulty: '',
  cookingTime: 30
})

// 模拟食谱数据
const recipes = ref([
  {
    id: 1,
    title: '番茄炒蛋',
    description: '经典家常菜，简单易做，营养丰富',
    image: '/tomato-egg.jpg',
    cuisine: '中餐',
    difficulty: '简单',
    cookingTime: 15,
    author: {
      name: '张厨师',
      avatar: '/chef-avatar.jpg'
    }
  },
  {
    id: 2,
    title: '红烧肉',
    description: '肥而不腻，入口即化，传统美味',
    image: '/braised-pork.jpg',
    cuisine: '中餐',
    difficulty: '中等',
    cookingTime: 60,
    author: {
      name: '李大师',
      avatar: '/master-avatar.jpg'
    }
  },
  {
    id: 3,
    title: '意大利面',
    description: '经典西式料理，口感丰富',
    image: '/pasta.jpg',
    cuisine: '西餐',
    difficulty: '中等',
    cookingTime: 25,
    author: {
      name: '王西厨',
      avatar: '/western-chef.jpg'
    }
  }
])

// 方法
const viewRecipe = (recipe: any) => {
  ElMessage.info(`查看食谱：${recipe.title}`)
}

const handleGenerateRecipe = () => {
  ElMessage.success('AI 正在生成食谱，请稍候...')
  showGenerateModal.value = false
}

const handleAddRecipe = () => {
  ElMessage.success('食谱添加成功')
  showAddModal.value = false
}

const getDifficultyType = (difficulty: string) => {
  switch (difficulty) {
    case '简单':
      return 'success'
    case '中等':
      return 'warning'
    case '困难':
      return 'danger'
    default:
      return 'info'
  }
}

// 生命周期
onMounted(() => {
  // 加载食谱数据
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style lang="less" scoped>
.recipes-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  margin-left: 240px;
  margin-top: 64px;
  padding: 24px;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
}

.page-header {
  margin-bottom: 24px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #666;
    margin: 0;
  }
}

.actions-bar {
  margin-bottom: 24px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.recipe-card {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}

.recipe-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}

.recipe-content {
  padding: 16px 0;
}

.recipe-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.recipe-description {
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  
  .author-name {
    color: #666;
    font-size: 14px;
  }
}

.recipe-tags {
  display: flex;
  gap: 8px;
}

.time-unit {
  margin-left: 8px;
  color: #666;
}

// 移动端适配
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .actions-bar {
    .el-space {
      flex-direction: column;
      width: 100%;
      
      .el-button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
