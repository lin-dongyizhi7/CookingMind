<template>
  <div class="nutrition-page">
    <a-row :gutter="24">
      <!-- 营养概览 -->
      <a-col :span="24">
        <a-card title="营养概览" :bordered="false" class="overview-card">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-statistic 
                title="今日摄入热量" 
                :value="nutritionOverview.todayCalories" 
                suffix="kcal"
                :value-style="{ color: getCalorieColor(nutritionOverview.todayCalories) }"
              />
            </a-col>
            <a-col :span="6">
              <a-statistic 
                title="目标热量" 
                :value="nutritionOverview.targetCalories" 
                suffix="kcal"
              />
            </a-col>
            <a-col :span="6">
              <a-statistic 
                title="剩余热量" 
                :value="nutritionOverview.remainingCalories" 
                suffix="kcal"
                :value-style="{ color: nutritionOverview.remainingCalories > 0 ? '#52c41a' : '#ff4d4f' }"
              />
            </a-col>
            <a-col :span="6">
              <a-statistic 
                title="完成度" 
                :value="nutritionOverview.completionRate" 
                suffix="%"
                :value-style="{ color: getCompletionColor(nutritionOverview.completionRate) }"
              />
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- 营养图表 -->
      <a-col :span="12">
        <a-card title="本周营养摄入趋势" :bordered="false">
          <canvas ref="weeklyChart" width="400" height="200"></canvas>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="营养素分布" :bordered="false">
          <canvas ref="nutrientChart" width="400" height="200"></canvas>
        </a-card>
      </a-col>

      <!-- 营养计算器 -->
      <a-col :span="24">
        <a-card title="营养计算器" :bordered="false">
          <a-form :model="nutritionCalculator" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="年龄">
                  <a-input-number 
                    v-model:value="nutritionCalculator.age" 
                    :min="1" 
                    :max="120"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="性别">
                  <a-select v-model:value="nutritionCalculator.gender">
                    <a-select-option value="male">男</a-select-option>
                    <a-select-option value="female">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="体重 (kg)">
                  <a-input-number 
                    v-model:value="nutritionCalculator.weight" 
                    :min="20" 
                    :max="200"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="身高 (cm)">
                  <a-input-number 
                    v-model:value="nutritionCalculator.height" 
                    :min="100" 
                    :max="250"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="活动水平">
                  <a-select v-model:value="nutritionCalculator.activityLevel">
                    <a-select-option value="sedentary">久坐不动</a-select-option>
                    <a-select-option value="lightly">轻度活动</a-select-option>
                    <a-select-option value="moderately">中度活动</a-select-option>
                    <a-select-option value="very">重度活动</a-select-option>
                    <a-select-option value="extremely">极重度活动</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="目标">
                  <a-select v-model:value="nutritionCalculator.goal">
                    <a-select-option value="lose">减重</a-select-option>
                    <a-select-option value="maintain">维持体重</a-select-option>
                    <a-select-option value="gain">增重</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" @click="calculateNutrition">
                计算营养需求
              </a-button>
            </a-form-item>
          </a-form>

          <!-- 计算结果 -->
          <div v-if="calculationResult" class="calculation-result">
            <a-divider />
            <h4>计算结果</h4>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-statistic title="基础代谢率" :value="calculationResult.bmr" suffix="kcal" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="每日总消耗" :value="calculationResult.tdee" suffix="kcal" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="建议摄入" :value="calculationResult.recommendedCalories" suffix="kcal" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="蛋白质" :value="calculationResult.protein" suffix="g" />
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>

      <!-- 营养建议 -->
      <a-col :span="24">
        <a-card title="个性化营养建议" :bordered="false">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="general" tab="一般建议">
              <div class="nutrition-tips">
                <a-alert
                  v-for="(tip, index) in generalTips"
                  :key="index"
                  :message="tip.title"
                  :description="tip.content"
                  type="info"
                  show-icon
                  class="tip-item"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane key="dietary" tab="饮食建议">
              <div class="dietary-recommendations">
                <a-row :gutter="16">
                  <a-col :span="12">
                    <h4>推荐食物</h4>
                    <a-list
                      :data-source="recommendedFoods"
                      size="small"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta>
                            <template #title>{{ item.name }}</template>
                            <template #description>{{ item.benefits }}</template>
                          </a-list-item-meta>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-col>
                  <a-col :span="12">
                    <h4>限制食物</h4>
                    <a-list
                      :data-source="limitedFoods"
                      size="small"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta>
                            <template #title>{{ item.name }}</template>
                            <template #description>{{ item.reason }}</template>
                          </a-list-item-meta>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="supplements" tab="营养补充">
              <div class="supplement-recommendations">
                <a-table
                  :columns="supplementColumns"
                  :data-source="supplementRecommendations"
                  :pagination="false"
                  size="small"
                />
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>

      <!-- 营养报告 -->
      <a-col :span="24">
        <a-card title="营养报告" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-button type="primary" @click="generateReport">
                生成营养报告
              </a-button>
              <a-button @click="exportReport" :disabled="!nutritionReport">
                导出报告
              </a-button>
            </a-col>
            <a-col :span="12" class="text-right">
              <a-date-picker 
                v-model:value="reportDate" 
                placeholder="选择报告日期"
                @change="onReportDateChange"
              />
            </a-col>
          </a-row>

          <!-- 报告内容 -->
          <div v-if="nutritionReport" class="report-content">
            <a-divider />
            <div class="report-summary">
              <h4>营养摄入总结</h4>
              <a-descriptions :column="2" bordered>
                <a-descriptions-item label="总热量">{{ nutritionReport.totalCalories }} kcal</a-descriptions-item>
                <a-descriptions-item label="蛋白质">{{ nutritionReport.protein }}g</a-descriptions-item>
                <a-descriptions-item label="脂肪">{{ nutritionReport.fat }}g</a-descriptions-item>
                <a-descriptions-item label="碳水化合物">{{ nutritionReport.carbs }}g</a-descriptions-item>
                <a-descriptions-item label="膳食纤维">{{ nutritionReport.fiber }}g</a-descriptions-item>
                <a-descriptions-item label="维生素C">{{ nutritionReport.vitaminC }}mg</a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="report-analysis">
              <h4>营养分析</h4>
              <a-alert
                v-for="(analysis, index) in nutritionReport.analysis"
                :key="index"
                :message="analysis.title"
                :description="analysis.content"
                :type="analysis.type"
                show-icon
                class="analysis-item"
              />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import Chart from 'chart.js/auto'

// 响应式数据
const activeTab = ref('general')
const reportDate = ref(null)
const weeklyChart = ref<HTMLCanvasElement>()
const nutrientChart = ref<HTMLCanvasElement>()

// 营养概览
const nutritionOverview = reactive({
  todayCalories: 1850,
  targetCalories: 2200,
  remainingCalories: 350,
  completionRate: 84
})

// 营养计算器
const nutritionCalculator = reactive({
  age: 30,
  gender: 'male',
  weight: 70,
  height: 175,
  activityLevel: 'moderately',
  goal: 'maintain'
})

// 计算结果
const calculationResult = ref(null)

// 营养建议
const generalTips = ref([
  {
    title: '均衡饮食',
    content: '每天摄入足够的蛋白质、碳水化合物、脂肪、维生素和矿物质'
  },
  {
    title: '定时进餐',
    content: '保持规律的进餐时间，避免暴饮暴食'
  },
  {
    title: '多喝水',
    content: '每天至少喝8杯水，保持身体水分充足'
  }
])

const recommendedFoods = ref([
  { name: '鸡胸肉', benefits: '优质蛋白质，低脂肪' },
  { name: '三文鱼', benefits: '富含Omega-3脂肪酸' },
  { name: '菠菜', benefits: '富含铁和叶酸' },
  { name: '燕麦', benefits: '富含膳食纤维和B族维生素' }
])

const limitedFoods = ref([
  { name: '加工食品', reason: '高盐、高糖、高脂肪' },
  { name: '含糖饮料', reason: '空热量，容易导致体重增加' },
  { name: '油炸食品', reason: '高热量，营养密度低' }
])

const supplementColumns = [
  { title: '营养素', dataIndex: 'nutrient', key: 'nutrient' },
  { title: '推荐剂量', dataIndex: 'dosage', key: 'dosage' },
  { title: '作用', dataIndex: 'benefit', key: 'benefit' },
  { title: '注意事项', dataIndex: 'caution', key: 'caution' }
]

const supplementRecommendations = ref([
  {
    nutrient: '维生素D',
    dosage: '400-800 IU/天',
    benefit: '促进钙吸收，增强免疫力',
    caution: '过量可能导致高钙血症'
  },
  {
    nutrient: 'Omega-3',
    dosage: '1000-2000 mg/天',
    benefit: '心血管健康，抗炎作用',
    caution: '可能增加出血风险'
  }
])

// 营养报告
const nutritionReport = ref(null)

// 方法
const getCalorieColor = (calories: number) => {
  if (calories < 1500) return '#52c41a'
  if (calories < 2000) return '#faad14'
  return '#ff4d4f'
}

const getCompletionColor = (rate: number) => {
  if (rate < 60) return '#ff4d4f'
  if (rate < 80) return '#faad14'
  return '#52c41a'
}

const calculateNutrition = () => {
  const { age, gender, weight, height, activityLevel, goal } = nutritionCalculator
  
  // 计算基础代谢率 (BMR)
  let bmr = 0
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
  
  // 活动系数
  const activityMultipliers = {
    sedentary: 1.2,
    lightly: 1.375,
    moderately: 1.55,
    very: 1.725,
    extremely: 1.9
  }
  
  const tdee = bmr * activityMultipliers[activityLevel]
  
  // 根据目标调整热量
  let recommendedCalories = tdee
  if (goal === 'lose') {
    recommendedCalories = tdee - 500
  } else if (goal === 'gain') {
    recommendedCalories = tdee + 500
  }
  
  // 计算蛋白质需求
  const protein = weight * 1.6 // 1.6g/kg体重
  
  calculationResult.value = {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    recommendedCalories: Math.round(recommendedCalories),
    protein: Math.round(protein)
  }
  
  message.success('营养需求计算完成！')
}

const generateReport = () => {
  // 模拟生成报告
  nutritionReport.value = {
    totalCalories: 1850,
    protein: 85,
    fat: 65,
    carbs: 220,
    fiber: 25,
    vitaminC: 120,
    analysis: [
      {
        title: '蛋白质摄入充足',
        content: '今日蛋白质摄入达到推荐量的95%，有助于肌肉修复和生长',
        type: 'success'
      },
      {
        title: '脂肪摄入偏高',
        content: '脂肪摄入略高于推荐量，建议减少油炸食品摄入',
        type: 'warning'
      },
      {
        title: '维生素C充足',
        content: '维生素C摄入充足，有助于增强免疫力',
        type: 'success'
      }
    ]
  }
  
  message.success('营养报告生成完成！')
}

const exportReport = () => {
  message.info('报告导出功能开发中...')
}

const onReportDateChange = (date: any) => {
  if (date) {
    message.info(`选择日期: ${date.format('YYYY-MM-DD')}`)
  }
}

// 初始化图表
const initCharts = async () => {
  await nextTick()
  
  if (weeklyChart.value) {
    new Chart(weeklyChart.value, {
      type: 'line',
      data: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{
          label: '热量摄入',
          data: [1800, 1950, 1700, 2100, 1850, 2200, 1900],
          borderColor: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '本周热量摄入趋势'
          }
        }
      }
    })
  }
  
  if (nutrientChart.value) {
    new Chart(nutrientChart.value, {
      type: 'doughnut',
      data: {
        labels: ['蛋白质', '脂肪', '碳水化合物'],
        datasets: [{
          data: [20, 30, 50],
          backgroundColor: ['#52c41a', '#faad14', '#1890ff']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '营养素分布'
          }
        }
      }
    })
  }
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.nutrition-page {
  padding: 24px;
}

.overview-card {
  margin-bottom: 24px;
}

.calculation-result {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.nutrition-tips .tip-item {
  margin-bottom: 8px;
}

.dietary-recommendations h4 {
  margin-bottom: 16px;
  color: #1890ff;
}

.supplement-recommendations {
  margin-top: 16px;
}

.report-content {
  margin-top: 16px;
}

.report-summary,
.report-analysis {
  margin-bottom: 24px;
}

.report-summary h4,
.report-analysis h4 {
  margin-bottom: 16px;
  color: #1890ff;
}

.analysis-item {
  margin-bottom: 8px;
}

.text-right {
  text-align: right;
}
</style>
