<template>
  <div class="cooking-page">
    <a-card title="烹饪指导" :bordered="false">
      <!-- 食谱信息 -->
      <div class="recipe-info" v-if="recipe">
        <a-row :gutter="16">
          <a-col :span="8">
            <img :src="recipe.images?.[0] || '/default-recipe.jpg'" alt="食谱图片" class="recipe-image" />
          </a-col>
          <a-col :span="16">
            <h2>{{ recipe.title }}</h2>
            <p class="recipe-description">{{ recipe.description }}</p>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-statistic title="准备时间" :value="recipe.prepTime" suffix="分钟" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="烹饪时间" :value="recipe.cookTime" suffix="分钟" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="总时间" :value="recipe.totalTime" suffix="分钟" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="份数" :value="recipe.servings" suffix="份" />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>

      <!-- 烹饪步骤 -->
      <div class="cooking-steps" v-if="recipe">
        <a-divider />
        <h3>烹饪步骤</h3>
        
        <a-steps :current="currentStep" direction="vertical" size="large">
          <a-step 
            v-for="(step, index) in recipe.steps" 
            :key="index"
            :title="`步骤 ${index + 1}`"
            :description="step.description"
            :status="getStepStatus(index)"
          />
        </a-steps>

        <!-- 当前步骤详情 -->
        <div class="current-step-detail" v-if="currentStep < recipe.steps.length">
          <a-card :title="`步骤 ${currentStep + 1}`" class="step-card">
            <p>{{ recipe.steps[currentStep].description }}</p>
            <div class="step-actions">
              <a-button 
                type="primary" 
                @click="startStep"
                :disabled="stepInProgress"
              >
                开始此步骤
              </a-button>
              <a-button 
                @click="completeStep"
                :disabled="!stepInProgress"
              >
                完成此步骤
              </a-button>
            </div>
            
            <!-- 步骤计时器 -->
            <div class="step-timer" v-if="stepInProgress">
              <a-progress 
                :percent="timerProgress" 
                :format="timerFormat"
                status="active"
              />
            </div>
          </a-card>
        </div>

        <!-- 步骤导航 -->
        <div class="step-navigation">
          <a-button 
            @click="previousStep" 
            :disabled="currentStep === 0"
            icon="left"
          >
            上一步
          </a-button>
          <a-button 
            type="primary" 
            @click="nextStep"
            :disabled="currentStep >= recipe.steps.length - 1"
          >
            下一步
          </a-button>
        </div>
      </div>

      <!-- 烹饪视频 -->
      <div class="cooking-video" v-if="videoUrl">
        <a-divider />
        <h3>烹饪视频指导</h3>
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

      <!-- 烹饪提示 -->
      <div class="cooking-tips">
        <a-divider />
        <h3>烹饪提示</h3>
        <a-alert
          v-for="(tip, index) in cookingTips"
          :key="index"
          :message="tip.title"
          :description="tip.content"
          type="info"
          show-icon
          class="tip-item"
        />
      </div>

      <!-- 语音助手 -->
      <div class="voice-assistant">
        <a-divider />
        <h3>语音助手</h3>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button 
              type="primary" 
              @click="startVoiceRecognition"
              :loading="voiceRecognitionLoading"
              icon="microphone"
            >
              开始语音识别
            </a-button>
            <a-button 
              @click="stopVoiceRecognition"
              :disabled="!voiceRecognitionActive"
            >
              停止语音识别
            </a-button>
          </a-col>
          <a-col :span="12">
            <a-input 
              v-model:value="voiceInput"
              placeholder="语音输入内容..."
              readonly
            />
          </a-col>
        </a-row>
      </div>

      <!-- 烹饪进度 -->
      <div class="cooking-progress">
        <a-divider />
        <h3>烹饪进度</h3>
        <a-progress 
          :percent="overallProgress" 
          :format="progressFormat"
          status="active"
        />
        <div class="progress-actions">
          <a-button @click="pauseCooking">暂停烹饪</a-button>
          <a-button @click="resumeCooking">继续烹饪</a-button>
          <a-button type="primary" @click="completeCooking">完成烹饪</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
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
  if (stepIndex < currentStep.value) return 'finish'
  if (stepIndex === currentStep.value) return 'process'
  return 'wait'
}

const startStep = () => {
  stepInProgress.value = true
  stepTimer.value = 0
  
  stepTimerInterval.value = setInterval(() => {
    stepTimer.value++
  }, 1000)
  
  message.success('开始执行此步骤')
}

const completeStep = () => {
  stepInProgress.value = false
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
    stepTimerInterval.value = null
  }
  
  message.success('步骤完成！')
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

const timerFormat = (percent: number) => {
  const minutes = Math.floor(stepTimer.value / 60)
  const seconds = stepTimer.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const progressFormat = (percent: number) => {
  return `${currentStep.value + 1} / ${recipe.value?.steps?.length || 0} 步骤`
}

const onVideoPlay = () => {
  message.info('视频开始播放')
}

const onVideoPause = () => {
  message.info('视频已暂停')
}

const startVoiceRecognition = async () => {
  voiceRecognitionLoading.value = true
  try {
    // 这里应该调用语音识别API
    await new Promise(resolve => setTimeout(resolve, 2000))
    voiceRecognitionActive.value = true
    voiceInput.value = '请告诉我下一步该怎么做？'
    message.success('语音识别已启动')
  } catch (error) {
    message.error('语音识别启动失败')
  } finally {
    voiceRecognitionLoading.value = false
  }
}

const stopVoiceRecognition = () => {
  voiceRecognitionActive.value = false
  voiceInput.value = ''
  message.info('语音识别已停止')
}

const pauseCooking = () => {
  cookingPaused.value = true
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
    stepTimerInterval.value = null
  }
  message.info('烹饪已暂停')
}

const resumeCooking = () => {
  cookingPaused.value = false
  if (stepInProgress.value) {
    startStep()
  }
  message.success('烹饪已恢复')
}

const completeCooking = () => {
  message.success('恭喜！烹饪完成！')
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
      message.error('获取食谱信息失败')
    }
  }
})

onUnmounted(() => {
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
  }
})
</script>

<style scoped>
.cooking-page {
  padding: 24px;
}

.recipe-info {
  margin-bottom: 24px;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.recipe-description {
  color: #666;
  margin-bottom: 16px;
}

.cooking-steps {
  margin-bottom: 24px;
}

.step-card {
  margin: 16px 0;
  background: #fafafa;
}

.step-actions {
  margin: 16px 0;
}

.step-actions .ant-btn {
  margin-right: 8px;
}

.step-timer {
  margin: 16px 0;
}

.step-navigation {
  text-align: center;
  margin: 24px 0;
}

.step-navigation .ant-btn {
  margin: 0 8px;
}

.cooking-video {
  margin-bottom: 24px;
}

.video-player {
  width: 100%;
  max-width: 600px;
  height: auto;
}

.cooking-tips {
  margin-bottom: 24px;
}

.tip-item {
  margin-bottom: 8px;
}

.voice-assistant {
  margin-bottom: 24px;
}

.voice-assistant .ant-btn {
  margin-right: 8px;
}

.cooking-progress {
  margin-bottom: 24px;
}

.progress-actions {
  margin-top: 16px;
  text-align: center;
}

.progress-actions .ant-btn {
  margin: 0 8px;
}
</style>
