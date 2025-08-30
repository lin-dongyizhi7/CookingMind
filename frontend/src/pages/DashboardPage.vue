<template>
  <div class="dashboard-page">
    <!-- 欢迎区域 -->
    <el-row :gutter="24" class="welcome-section">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="welcome-card" shadow="hover">
          <div class="welcome-content">
            <div class="welcome-text">
              <h1>欢迎回来，{{ user?.username || '美食家' }}！</h1>
              <p>今天想要烹饪什么美食呢？</p>
            </div>
            <div class="welcome-actions">
              <el-button type="primary" size="large" @click="goToRecipes">
                <el-icon><Document /></el-icon>
                浏览菜谱
              </el-button>
              <el-button size="large" @click="goToIngredients">
                <el-icon><Apple /></el-icon>
                管理食材
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="quick-stats-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日概览</span>
              <el-button type="text" @click="refreshStats">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-value">{{ todayStats.cookingCount }}</div>
              <div class="stat-label">今日烹饪</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ todayStats.calories }}</div>
              <div class="stat-label">摄入热量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ todayStats.recipes }}</div>
              <div class="stat-label">收藏菜谱</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-row :gutter="24" class="quick-actions-section">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="action-card" shadow="hover" @click="goToCooking">
          <div class="action-content">
            <el-icon class="action-icon cooking"><VideoPlay /></el-icon>
            <h3>开始烹饪</h3>
            <p>选择菜谱，开始你的美食之旅</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="action-card" shadow="hover" @click="goToNutrition">
          <div class="action-content">
            <el-icon class="action-icon nutrition"><Heart /></el-icon>
            <h3>营养分析</h3>
            <p>了解你的营养摄入情况</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="action-card" shadow="hover" @click="goToFamily">
          <div class="action-content">
            <el-icon class="action-icon family"><UserFilled /></el-icon>
            <h3>家庭管理</h3>
            <p>管理家庭成员和饮食偏好</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="action-card" shadow="hover" @click="goToProfile">
          <div class="action-content">
            <el-icon class="action-icon profile"><User /></el-icon>
            <h3>个人设置</h3>
            <p>个性化你的烹饪体验</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="24" class="recent-activities-section">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="activities-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button type="text" @click="viewAllActivities">
                查看全部
              </el-button>
            </div>
          </template>
          <div class="activities-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <el-avatar :src="activity.userAvatar" :alt="activity.username">
                {{ activity.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <div class="activity-content">
                <div class="activity-text">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="recommendations-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>推荐菜谱</span>
              <el-button type="text" @click="viewAllRecipes">
                更多推荐
              </el-button>
            </div>
          </template>
          <div class="recommendations-list">
            <div 
              v-for="recipe in recommendedRecipes" 
              :key="recipe.id"
              class="recipe-item"
              @click="viewRecipe(recipe.id)"
            >
              <el-image 
                :src="recipe.image" 
                :alt="recipe.title"
                class="recipe-image"
                fit="cover"
              />
              <div class="recipe-info">
                <h4>{{ recipe.title }}</h4>
                <p>{{ recipe.description }}</p>
                <div class="recipe-meta">
                  <el-rate 
                    v-model="recipe.rating" 
                    disabled 
                    show-score 
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                  <span class="cook-time">{{ recipe.cookTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 营养提醒 -->
    <el-row :gutter="24" class="nutrition-reminder-section">
      <el-col :span="24">
        <el-alert
          v-if="nutritionReminder.show"
          :title="nutritionReminder.title"
          :description="nutritionReminder.description"
          type="info"
          show-icon
          :closable="false"
          class="nutrition-alert"
        >
          <template #default>
            <div class="reminder-actions">
              <el-button type="primary" size="small" @click="goToNutrition">
                查看详情
              </el-button>
              <el-button size="small" @click="dismissReminder">
                稍后提醒
              </el-button>
            </div>
          </template>
        </el-alert>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ElMessage } from 'element-plus'
import {
  Document,
  Apple,
  VideoPlay,
  Heart,
  UserFilled,
  User,
  Refresh
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

// 今日统计
const todayStats = ref({
  cookingCount: 3,
  calories: 1850,
  recipes: 12
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    username: '张三',
    userAvatar: '/avatar1.jpg',
    description: '完成了红烧肉的烹饪',
    time: '2小时前'
  },
  {
    id: 2,
    username: '李四',
    userAvatar: '/avatar2.jpg',
    description: '创建了新的菜谱',
    time: '4小时前'
  },
  {
    id: 3,
    username: '王五',
    userAvatar: '/avatar3.jpg',
    description: '加入了家庭',
    time: '1天前'
  }
])

// 推荐菜谱
const recommendedRecipes = ref([
  {
    id: 1,
    title: '红烧肉',
    description: '经典美味的红烧肉，肥而不腻',
    image: '/recipe1.jpg',
    rating: 4.5,
    cookTime: 45
  },
  {
    id: 2,
    title: '清蒸鲈鱼',
    description: '鲜嫩可口的清蒸鲈鱼',
    image: '/recipe2.jpg',
    rating: 4.8,
    cookTime: 30
  }
])

// 营养提醒
const nutritionReminder = ref({
  show: true,
  title: '营养提醒',
  description: '今日蛋白质摄入不足，建议增加肉类或豆制品摄入'
})

// 方法
const goToRecipes = () => {
  router.push('/recipes')
}

const goToIngredients = () => {
  router.push('/ingredients')
}

const goToCooking = () => {
  router.push('/cooking')
}

const goToNutrition = () => {
  router.push('/nutrition')
}

const goToFamily = () => {
  router.push('/family')
}

const goToProfile = () => {
  router.push('/profile')
}

const refreshStats = () => {
  ElMessage.success('统计数据已刷新')
}

const viewAllActivities = () => {
  ElMessage.info('查看全部活动功能开发中...')
}

const viewAllRecipes = () => {
  router.push('/recipes')
}

const viewRecipe = (id: string) => {
  router.push(`/recipes/${id}`)
}

const dismissReminder = () => {
  nutritionReminder.value.show = false
  ElMessage.info('已设置稍后提醒')
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="less" scoped>
.dashboard-page {
  padding: 0;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-card {
  height: 200px;
  
  .welcome-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  
  .welcome-text {
    h1 {
      margin: 0 0 8px 0;
      color: #1890ff;
      font-size: 24px;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }
  }
  
  .welcome-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.quick-stats-card {
  height: 200px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stats-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 120px;
  }
  
  .stat-item {
    text-align: center;
    
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #1890ff;
      margin-bottom: 8px;
    }
    
    .stat-label {
      color: #666;
      font-size: 14px;
    }
  }
}

.quick-actions-section {
  margin-bottom: 24px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .action-content {
    text-align: center;
    padding: 20px;
    
    .action-icon {
      font-size: 48px;
      margin-bottom: 16px;
      
      &.cooking {
        color: #ff4d4f;
      }
      
      &.nutrition {
        color: #52c41a;
      }
      
      &.family {
        color: #1890ff;
      }
      
      &.profile {
        color: #722ed1;
      }
    }
    
    h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}

.recent-activities-section {
  margin-bottom: 24px;
}

.activities-card,
.recommendations-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.activities-list {
  .activity-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-content {
      margin-left: 12px;
      flex: 1;
      
      .activity-text {
        color: #333;
        margin-bottom: 4px;
      }
      
      .activity-time {
        color: #999;
        font-size: 12px;
      }
    }
  }
}

.recommendations-list {
  .recipe-item {
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: #fafafa;
    }
    
    .recipe-image {
      width: 80px;
      height: 60px;
      border-radius: 6px;
      margin-right: 16px;
    }
    
    .recipe-info {
      flex: 1;
      
      h4 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 16px;
      }
      
      p {
        margin: 0 0 8px 0;
        color: #666;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .recipe-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .cook-time {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}

.nutrition-reminder-section {
  margin-bottom: 24px;
}

.nutrition-alert {
  .reminder-actions {
    margin-top: 12px;
    
    .el-button {
      margin-right: 8px;
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 0;
  }
  
  .welcome-card,
  .quick-stats-card {
    height: auto;
    margin-bottom: 16px;
  }
  
  .welcome-content {
    padding: 20px 0;
  }
  
  .welcome-actions {
    justify-content: center;
    
    .el-button {
      width: 100%;
      margin-bottom: 8px;
    }
  }
  
  .stats-content {
    flex-direction: column;
    gap: 20px;
    height: auto !important;
  }
  
  .action-card {
    margin-bottom: 16px;
    
    .action-content {
      padding: 16px;
      
      .action-icon {
        font-size: 36px;
      }
      
      h3 {
        font-size: 16px;
      }
      
      p {
        font-size: 13px;
      }
    }
  }
  
  .recipe-item {
    flex-direction: column;
    
    .recipe-image {
      width: 100%;
      height: 120px;
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
}

@media (max-width: 480px) {
  .welcome-text h1 {
    font-size: 20px;
  }
  
  .welcome-text p {
    font-size: 14px;
  }
  
  .action-content {
    padding: 12px;
    
    .action-icon {
      font-size: 32px;
    }
  }
  
  .stat-value {
    font-size: 24px !important;
  }
}
</style>
