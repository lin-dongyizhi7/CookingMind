<template>
  <div class="recipes-page">
    <AppHeader />
    <div class="recipes-layout">
      <AppSider />
      <div class="main-content">
        <div class="content-area">
          <div class="page-header">
            <h1>食谱管理</h1>
            <p>发现美味食谱，AI 智能推荐，收藏您的最爱</p>
          </div>

          <div class="actions-bar">
            <a-space>
              <a-button type="primary" @click="showGenerateModal = true">
                <RobotOutlined />
                AI 生成食谱
              </a-button>
              <a-button @click="showAddModal = true">
                <PlusOutlined />
                添加食谱
              </a-button>
            </a-space>
          </div>

          <div class="recipes-grid">
            <a-card
              v-for="recipe in recipes"
              :key="recipe.id"
              class="recipe-card"
              hoverable
              @click="viewRecipe(recipe)"
            >
              <template #cover>
                <img :src="recipe.image || '/placeholder-recipe.jpg'" :alt="recipe.title" />
              </template>
              <a-card-meta :title="recipe.title" :description="recipe.description">
                <template #avatar>
                  <a-avatar :src="recipe.author?.avatar">
                    {{ recipe.author?.username?.charAt(0)?.toUpperCase() }}
                  </a-avatar>
                </template>
              </a-card-meta>
              <div class="recipe-meta">
                <a-tag :color="getDifficultyColor(recipe.difficulty)">
                  {{ getDifficultyText(recipe.difficulty) }}
                </a-tag>
                <span class="cook-time">{{ recipe.cookTime }}分钟</span>
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 生成食谱模态框 -->
    <a-modal
      v-model:open="showGenerateModal"
      title="AI 生成食谱"
      @ok="handleGenerateRecipe"
      @cancel="showGenerateModal = false"
    >
      <a-form :model="generateForm" layout="vertical">
        <a-form-item label="主要食材" name="ingredients">
          <a-select
            v-model:value="generateForm.ingredients"
            mode="multiple"
            placeholder="选择主要食材"
            style="width: 100%"
          >
            <a-select-option value="tomato">番茄</a-select-option>
            <a-select-option value="egg">鸡蛋</a-select-option>
            <a-select-option value="chicken">鸡肉</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="菜系" name="cuisine">
          <a-select v-model:value="generateForm.cuisine" placeholder="选择菜系">
            <a-select-option value="chinese">中餐</a-select-option>
            <a-select-option value="western">西餐</a-select-option>
            <a-select-option value="japanese">日料</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="难度" name="difficulty">
          <a-select v-model:value="generateForm.difficulty" placeholder="选择难度">
            <a-select-option value="beginner">初级</a-select-option>
            <a-select-option value="intermediate">中级</a-select-option>
            <a-select-option value="advanced">高级</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { RobotOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSider from '@/components/layout/AppSider.vue'

const showGenerateModal = ref(false)
const showAddModal = ref(false)

const generateForm = reactive({
  ingredients: [],
  cuisine: '',
  difficulty: ''
})

const recipes = ref([
  {
    id: '1',
    title: '番茄炒蛋',
    description: '经典家常菜，简单易做，营养丰富',
    image: '/tomato-egg.jpg',
    difficulty: 'beginner',
    cookTime: 15,
    author: {
      username: '食光家',
      avatar: '/avatar.jpg'
    }
  },
  {
    id: '2',
    title: '红烧肉',
    description: '肥而不腻，入口即化，传统美味',
    image: '/braised-pork.jpg',
    difficulty: 'intermediate',
    cookTime: 60,
    author: {
      username: '大厨小王',
      avatar: '/chef-avatar.jpg'
    }
  }
])

const viewRecipe = (recipe: any) => {
  message.info(`查看食谱：${recipe.title}`)
}

const handleGenerateRecipe = () => {
  message.success('AI 正在生成食谱，请稍候...')
  showGenerateModal.value = false
}

const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    beginner: 'green',
    intermediate: 'orange',
    advanced: 'red'
  }
  return colors[difficulty] || 'default'
}

const getDifficultyText = (difficulty: string) => {
  const texts: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return texts[difficulty] || difficulty
}
</script>

<style scoped>
.recipes-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.recipes-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  margin-left: 200px;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
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
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.recipe-card img {
  height: 200px;
  object-fit: cover;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.cook-time {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
