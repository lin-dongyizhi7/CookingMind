<template>
  <div class="cooking-page">
    <el-card class="cooking-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>烹饪指导</span>
        </div>
      </template>
      
      <!-- 食谱信息 -->
      <div class="recipe-info" v-if="recipe">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
            <img :src="recipe.images?.[0] || '/default-recipe.jpg'" alt="食谱图片" class="recipe-image" />
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
            <h2 class="recipe-title">{{ recipe.title }}</h2>
            <p class="recipe-description">{{ recipe.description }}</p>
            <el-row :gutter="16">
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="准备时间" :value="recipe.prepTime" suffix="分钟" />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="烹饪时间" :value="recipe.cookTime" suffix="分钟" />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="总时间" :value="recipe.totalTime" suffix="分钟" />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="份数" :value="recipe.servings" suffix="份" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <!-- 烹饪步骤 -->
      <div class="cooking-steps" v-if="recipe">
        <el-divider />
        <h3 class="section-title">烹饪步骤</h3>
        
        <el-steps :active="currentStep" direction="vertical" size="large" class="steps-container">
          <el-step 
            v-for="(step, index) in recipe.steps" 
            :key="index"
            :title="`步骤 ${index + 1}`"
            :description="step.description"
            :status="getStepStatus(index)"
          />
        </el-steps>

        <!-- 当前步骤详情 -->
        <div class="current-step-detail" v-if="currentStep < recipe.steps.length">
          <el-card class="step-card" shadow="hover">
            <template #header>
              <span class="step-header">步骤 {{ currentStep + 1 }}</span>
            </template>
            <p class="step-description">{{ recipe.steps[currentStep].description }}</p>
            <div class="step-actions">
              <el-button 
                type="primary" 
                @click="startStep"
                :disabled="stepInProgress"
                size="large"
              >
                开始此步骤
              </el-button>
              <el-button 
                @click="completeStep"
                :disabled="!stepInProgress"
                size="large"
              >
                完成此步骤
              </el-button>
            </div>
            
            <!-- 步骤计时器 -->
            <div class="step-timer" v-if="stepInProgress">
              <el-progress 
                :percentage="timerProgress" 
                :format="timerFormat"
                status="success"
                :stroke-width="20"
              />
            </div>
          </el-card>
        </div>

        <!-- 步骤导航 -->
        <div class="step-navigation">
          <el-button 
            @click="previousStep" 
            :disabled="currentStep === 0"
            size="large"
          >
            <el-icon><ArrowLeft /></el-icon>
            上一步
          </el-button>
          <el-button 
            type="primary" 
            @click="nextStep"
            :disabled="currentStep >= recipe.steps.length - 1"
            size="large"
          >
            下一步
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 烹饪视频 -->
      <div class="cooking-video" v-if="videoUrl">
        <el-divider />
        <h3 class="section-title">烹饪视频指导</h3>
        <div class="video-container">
          <video 
            :src="videoUrl" 
            controls 
            class="video-player"
            @play="onVideoPlay"
            @pause="onVideoPause"
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </div>

      <!-- 烹饪提示 -->
      <div class="cooking-tips">
        <el-divider />
        <h3 class="section-title">烹饪提示</h3>
        <el-alert
          v-for="(tip, index) in cookingTips"
          :key="index"
          :title="tip.title"
          :description="tip.content"
          type="info"
          :closable="false"
          show-icon
          class="tip-item"
        />
      </div>

      <!-- 语音助手 -->
      <div class="voice-assistant">
        <el-divider />
        <h3 class="section-title">语音助手</h3>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-button 
              type="primary" 
              @click="startVoiceRecognition"
              :loading="voiceRecognitionLoading"
              size="large"
            >
              <el-icon><Microphone /></el-icon>
              开始语音识别
            </el-button>
            <el-button 
              @click="stopVoiceRecognition"
              :disabled="!voiceRecognitionActive"
              size="large"
            >
              停止语音识别
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-input 
              v-model="voiceInput"
              placeholder="语音输入内容..."
              readonly
              size="large"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 烹饪进度 -->
      <div class="cooking-progress">
        <el-divider />
        <h3 class="section-title">烹饪进度</h3>
        <el-progress 
          :percentage="overallProgress" 
          :format="progressFormat"
          status="success"
          :stroke-width="24"
        />
        <div class="progress-actions">
          <el-button @click="pauseCooking" size="large">暂停烹饪</el-button>
          <el-button @click="resumeCooking" size="large">继续烹饪</el-button>
          <el-button type="primary" @click="completeCooking" size="large">完成烹饪</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, Microphone } from '@element-plus/icons-vue'
import type { Recipe, CookingStep, CookingTip } from '../types/recipe'

const route = useRoute()
const router = useRouter()

// 响应式数据
const recipe = ref<Recipe | null>(null)
const currentStep = ref(0)
const stepInProgress = ref(false)
const stepTimer = ref(0)
const stepTimerInterval = ref<NodeJS.Timeout | null>(null)
const videoUrl = ref('')
const voiceRecognitionLoading = ref(false)
const voiceRecognitionActive = ref(false)
const voiceInput = ref('')
const cookingPaused = ref(false)

// 烹饪提示
const cookingTips = ref<CookingTip[]>([
  {
    title: '食材准备',
    content: '提前准备好所有需要的食材和工具，确保烹饪过程顺畅'
  },
  {
    title: '火候控制',
    content: '注意火候的控制，不同食材需要不同的火候'
  },
  {
    title: '调味技巧',
    content: '调味时要少量多次，避免过咸或过淡'
  }
])

// 计算属性
const timerProgress = computed(() => {
  if (!recipe.value?.steps[currentStep.value]?.estimatedTime) return 0
  const estimatedTime = recipe.value.steps[currentStep.value].estimatedTime || 0
  return Math.min((stepTimer.value / estimatedTime) * 100, 100)
})

const overallProgress = computed(() => {
  if (!recipe.value?.steps) return 0
  return Math.round((currentStep.value / recipe.value.steps.length) * 100)
})

// 方法
const getStepStatus = (stepIndex: number) => {
  if (stepIndex < currentStep.value) return 'success'
  if (stepIndex === currentStep.value) return 'process'
  return 'wait'
}

const startStep = () => {
  stepInProgress.value = true
  stepTimer.value = 0
  
  stepTimerInterval.value = setInterval(() => {
    stepTimer.value++
  }, 1000)
  
  ElMessage.success('开始执行此步骤')
}

const completeStep = () => {
  stepInProgress.value = false
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
    stepTimerInterval.value = null
  }
  
  ElMessage.success('步骤完成！')
}

const nextStep = () => {
  if (currentStep.value < (recipe.value?.steps?.length || 0) - 1) {
    currentStep.value++
    stepInProgress.value = false
    stepTimer.value = 0
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    stepInProgress.value = false
    stepTimer.value = 0
  }
}

const timerFormat = (percentage: number) => {
  const minutes = Math.floor(stepTimer.value / 60)
  const seconds = stepTimer.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const progressFormat = (percentage: number) => {
  return `${currentStep.value + 1} / ${recipe.value?.steps?.length || 0} 步骤`
}

const onVideoPlay = () => {
  ElMessage.info('视频开始播放')
}

const onVideoPause = () => {
  ElMessage.info('视频已暂停')
}

const startVoiceRecognition = async () => {
  voiceRecognitionLoading.value = true
  try {
    // 这里应该调用语音识别API
    await new Promise(resolve => setTimeout(resolve, 2000))
    voiceRecognitionActive.value = true
    voiceInput.value = '请告诉我下一步该怎么做？'
    ElMessage.success('语音识别已启动')
  } catch (error) {
    ElMessage.error('语音识别启动失败')
  } finally {
    voiceRecognitionLoading.value = false
  }
}

const stopVoiceRecognition = () => {
  voiceRecognitionActive.value = false
  voiceInput.value = ''
  ElMessage.info('语音识别已停止')
}

const pauseCooking = () => {
  cookingPaused.value = true
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
    stepTimerInterval.value = null
  }
  ElMessage.info('烹饪已暂停')
}

const resumeCooking = () => {
  cookingPaused.value = false
  if (stepInProgress.value) {
    startStep()
  }
  ElMessage.success('烹饪已恢复')
}

const completeCooking = () => {
  ElMessage.success('恭喜！烹饪完成！')
  router.push('/dashboard')
}

// 生命周期
onMounted(async () => {
  const recipeId = route.params.id
  if (recipeId) {
    try {
      // 这里应该调用API获取食谱详情
      // const response = await api.getRecipe(recipeId)
      // recipe.value = response.data
      
      // 模拟数据
      recipe.value = {
        id: '1',
        title: '红烧肉',
        description: '经典美味的红烧肉',
        prepTime: 15,
        cookTime: 45,
        totalTime: 60,
        servings: 4,
        steps: [
          { description: '准备五花肉，切成块', estimatedTime: 300 },
          { description: '锅中放油，爆香葱姜蒜', estimatedTime: 120 },
          { description: '放入肉块翻炒上色', estimatedTime: 180 },
          { description: '加入调味料和清水', estimatedTime: 60 },
          { description: '大火烧开后转小火炖煮', estimatedTime: 1800 }
        ],
        images: ['/recipe1.jpg']
      } as Recipe
    } catch (error) {
      ElMessage.error('获取食谱信息失败')
    }
  }
})

onUnmounted(() => {
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
  }
})
</script>

<style lang="less" scoped>
.cooking-page {
  padding: 0;
  
  .cooking-card {
    border: none;
    box-shadow: none;
    
    .card-header {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.recipe-info {
  margin-bottom: 32px;
  
  .recipe-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }
  
  .recipe-description {
    color: #606266;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  .recipe-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.cooking-steps {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 24px 0;
  }
  
  .steps-container {
    margin-bottom: 32px;
  }
  
  .step-card {
    margin: 24px 0;
    border: 1px solid #e4e7ed;
    
    .step-header {
      font-weight: 600;
      color: #303133;
    }
    
    .step-description {
      font-size: 16px;
      color: #606266;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    
    .step-actions {
      margin-bottom: 24px;
      
      .el-button {
        margin-right: 12px;
      }
    }
    
    .step-timer {
      margin-top: 16px;
    }
  }
  
  .step-navigation {
    text-align: center;
    margin: 32px 0;
    
    .el-button {
      margin: 0 12px;
    }
  }
}

.cooking-video {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 24px 0;
  }
  
  .video-container {
    text-align: center;
    
    .video-player {
      width: 100%;
      max-width: 600px;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.cooking-tips {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 24px 0;
  }
  
  .tip-item {
    margin-bottom: 16px;
  }
}

.voice-assistant {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 24px 0;
  }
  
  .el-button {
    margin-right: 12px;
    margin-bottom: 12px;
  }
}

.cooking-progress {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 24px 0;
  }
  
  .progress-actions {
    margin-top: 24px;
    text-align: center;
    
    .el-button {
      margin: 0 12px;
      margin-bottom: 12px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .cooking-page {
    padding: 0;
    
    .cooking-card {
      margin: 0;
      border-radius: 0;
    }
  }
  
  .recipe-info {
    .recipe-title {
      font-size: 20px;
    }
    
    .recipe-image {
      height: 150px;
      margin-bottom: 16px;
    }
  }
  
  .cooking-steps {
    .step-card {
      margin: 16px 0;
      
      .step-actions {
        .el-button {
          width: 100%;
          margin-right: 0;
          margin-bottom: 8px;
        }
      }
    }
    
    .step-navigation {
      .el-button {
        width: 100%;
        margin: 8px 0;
      }
    }
  }
  
  .voice-assistant {
    .el-button {
      width: 100%;
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
  
  .cooking-progress {
    .progress-actions {
      .el-button {
        width: 100%;
        margin: 8px 0;
      }
    }
  }
}

@media (max-width: 480px) {
  .recipe-info {
    .recipe-title {
      font-size: 18px;
    }
    
    .recipe-image {
      height: 120px;
    }
  }
  
  .section-title {
    font-size: 18px !important;
  }
}
</style>
