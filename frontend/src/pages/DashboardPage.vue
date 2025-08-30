<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="page-title">欢迎回来，{{ user?.username }}！</h1>
      <p class="page-subtitle">今天是 {{ currentDate }}，让我们开始今天的烹饪之旅吧！</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <a-row :gutter="16">
        <a-col :span="6" :xs="24" :sm="12" :md="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon ingredients">
                <a-icon type="carrot" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.ingredientsCount }}</div>
                <div class="stat-label">食材总数</div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="6" :xs="24" :sm="12" :md="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon recipes">
                <a-icon type="book" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.recipesCount }}</div>
                <div class="stat-label">菜谱总数</div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="6" :xs="24" :sm="12" :md="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon expiring">
                <a-icon type="clock-circle" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.expiringCount }}</div>
                <div class="stat-label">即将过期</div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="6" :xs="24" :sm="12" :md="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon nutrition">
                <a-icon type="heart" />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.avgCalories }}</div>
                <div class="stat-label">平均卡路里</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions-section">
      <h2 class="section-title">快速操作</h2>
      <a-row :gutter="16">
        <a-col :span="8" :xs="24" :sm="12" :md="8">
          <a-card class="action-card" @click="navigateTo('/ingredients')">
            <div class="action-content">
              <a-icon type="plus" class="action-icon" />
              <h3>添加食材</h3>
              <p>拍照识别或手动添加新食材</p>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="8" :xs="24" :sm="12" :md="8">
          <a-card class="action-card" @click="navigateTo('/recipes')">
            <div class="action-content">
              <a-icon type="robot" class="action-icon" />
              <h3>AI菜谱生成</h3>
              <p>基于现有食材智能生成菜谱</p>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="8" :xs="24" :sm="12" :md="8">
          <a-card class="action-card" @click="navigateTo('/cooking')">
            <div class="action-content">
              <a-icon type="play-circle" class="action-icon" />
              <h3>开始烹饪</h3>
              <p>选择菜谱开始烹饪指导</p>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activities-section">
      <h2 class="section-title">最近活动</h2>
      <a-list
        :data-source="recentActivities"
        class="activities-list"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :style="{ backgroundColor: item.color }">
                  <a-icon :type="item.icon" />
                </a-avatar>
              </template>
              <template #title>
                {{ item.title }}
              </template>
              <template #description>
                {{ item.description }}
              </template>
            </a-list-item-meta>
            <div class="activity-time">{{ item.time }}</div>
          </a-list-item>
        </template>
      </a-list>
    </div>

    <!-- 营养建议 -->
    <div class="nutrition-tips-section">
      <h2 class="section-title">今日营养建议</h2>
      <a-alert
        message="营养均衡提醒"
        description="根据您的营养目标，建议今天多摄入一些蛋白质和维生素C。可以尝试制作富含这些营养素的菜品。"
        type="info"
        show-icon
        class="nutrition-alert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日 dddd')
})

const stats = ref({
  ingredientsCount: 0,
  recipesCount: 0,
  expiringCount: 0,
  avgCalories: 0
})

const recentActivities = ref([
  {
    icon: 'plus',
    title: '添加了新食材',
    description: '添加了胡萝卜、土豆等食材',
    time: '2小时前',
    color: '#52c41a'
  },
  {
    icon: 'book',
    title: '生成了新菜谱',
    description: 'AI为您生成了"胡萝卜土豆炖牛肉"',
    time: '4小时前',
    color: '#1890ff'
  },
  {
    icon: 'play-circle',
    title: '完成了烹饪',
    description: '成功制作了"番茄炒蛋"',
    time: '昨天',
    color: '#722ed1'
  },
  {
    icon: 'heart',
    title: '更新了营养目标',
    description: '调整了每日卡路里摄入目标',
    time: '2天前',
    color: '#eb2f96'
  }
])

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(async () => {
  // 这里可以调用API获取真实的统计数据
  // 暂时使用模拟数据
  stats.value = {
    ingredientsCount: 24,
    recipesCount: 15,
    expiringCount: 3,
    avgCalories: 450
  }
})
</script>

<style scoped>
.dashboard-page {
  padding: 0;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.stats-section {
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.ingredients {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.stat-icon.recipes {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.stat-icon.expiring {
  background: linear-gradient(135deg, #fa8c16, #ffc53d);
}

.stat-icon.nutrition {
  background: linear-gradient(135deg, #eb2f96, #f759ab);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.quick-actions-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.action-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-content {
  padding: 16px;
}

.action-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 16px;
}

.action-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.action-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.recent-activities-section {
  margin-bottom: 32px;
}

.activities-list {
  background: white;
  border-radius: 8px;
}

.activity-time {
  color: #999;
  font-size: 12px;
}

.nutrition-tips-section {
  margin-bottom: 32px;
}

.nutrition-alert {
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .stat-card {
    margin-bottom: 16px;
  }
  
  .action-card {
    margin-bottom: 16px;
  }
}
</style>
