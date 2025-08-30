<template>
  <div class="nutrition-page">
    <el-row :gutter="24">
      <!-- 营养概览 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="overview-card" shadow="never">
          <template #header>
            <span class="card-title">营养概览</span>
          </template>
          <el-row :gutter="16">
            <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
              <el-statistic 
                title="今日摄入热量" 
                :value="nutritionOverview.todayCalories" 
                suffix="kcal"
                :value-style="{ color: getCalorieColor(nutritionOverview.todayCalories) }"
              />
            </el-col>
            <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
              <el-statistic 
                title="目标热量" 
                :value="nutritionOverview.targetCalories" 
                suffix="kcal"
              />
            </el-col>
            <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
              <el-statistic 
                title="剩余热量" 
                :value="nutritionOverview.remainingCalories" 
                suffix="kcal"
                :value-style="{ color: nutritionOverview.remainingCalories > 0 ? '#67c23a' : '#f56c6c' }"
              />
            </el-col>
            <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
              <el-statistic 
                title="完成度" 
                :value="nutritionOverview.completionRate" 
                suffix="%"
                :value-style="{ color: getCompletionColor(nutritionOverview.completionRate) }"
              />
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 营养图表 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <span class="card-title">本周营养摄入趋势</span>
          </template>
          <canvas ref="weeklyChart" width="400" height="200"></canvas>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <span class="card-title">营养素分布</span>
          </template>
          <canvas ref="nutrientChart" width="400" height="200"></canvas>
        </el-card>
      </el-col>

      <!-- 营养计算器 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="calculator-card" shadow="never">
          <template #header>
            <span class="card-title">营养计算器</span>
          </template>
          <el-form :model="nutritionCalculator" label-width="120px" size="large">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="年龄">
                  <el-input-number 
                    v-model="nutritionCalculator.age" 
                    :min="1" 
                    :max="120"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="性别">
                  <el-select v-model="nutritionCalculator.gender" style="width: 100%">
                    <el-option label="男" value="male" />
                    <el-option label="女" value="female" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="体重 (kg)">
                  <el-input-number 
                    v-model="nutritionCalculator.weight" 
                    :min="20" 
                    :max="200"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="身高 (cm)">
                  <el-input-number 
                    v-model="nutritionCalculator.height" 
                    :min="100" 
                    :max="250"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="活动水平">
                  <el-select v-model="nutritionCalculator.activityLevel" style="width: 100%">
                    <el-option label="久坐不动" value="sedentary" />
                    <el-option label="轻度活动" value="lightly" />
                    <el-option label="中度活动" value="moderately" />
                    <el-option label="重度活动" value="very" />
                    <el-option label="极重度活动" value="extremely" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="目标">
                  <el-select v-model="nutritionCalculator.goal" style="width: 100%">
                    <el-option label="减重" value="lose" />
                    <el-option label="维持体重" value="maintain" />
                    <el-option label="增重" value="gain" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="calculateNutrition" size="large">
                计算营养需求
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 计算结果 -->
          <div v-if="calculationResult" class="calculation-result">
            <el-divider />
            <h4 class="result-title">计算结果</h4>
            <el-row :gutter="16">
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="基础代谢率" :value="calculationResult.bmr" suffix="kcal" />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="每日总消耗" :value="calculationResult.tdee" suffix="kcal" />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="建议摄入" :value="calculationResult.recommendedCalories" suffix="kcal" />
              </el-col>
              <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
                <el-statistic title="蛋白质" :value="calculationResult.protein" suffix="g" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <!-- 营养建议 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="advice-card" shadow="never">
          <template #header>
            <span class="card-title">个性化营养建议</span>
          </template>
          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="一般建议" name="general">
              <div class="nutrition-tips">
                <el-alert
                  v-for="(tip, index) in generalTips"
                  :key="index"
                  :title="tip.title"
                  :description="tip.content"
                  type="info"
                  :closable="false"
                  show-icon
                  class="tip-item"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="饮食建议" name="dietary">
              <div class="dietary-recommendations">
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <h4 class="recommendation-title">推荐食物</h4>
                    <el-list>
                      <el-list-item v-for="(item, index) in recommendedFoods" :key="index">
                        <template #default>
                          <div class="food-item">
                            <h5>{{ item.name }}</h5>
                            <p>{{ item.benefits }}</p>
                          </div>
                        </template>
                      </el-list-item>
                    </el-list>
                  </el-col>
                  <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <h4 class="recommendation-title">限制食物</h4>
                    <el-list>
                      <el-list-item v-for="(item, index) in limitedFoods" :key="index">
                        <template #default>
                          <div class="food-item">
                            <h5>{{ item.name }}</h5>
                            <p>{{ item.reason }}</p>
                          </div>
                        </template>
                      </el-list-item>
                    </el-list>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="营养补充" name="supplements">
              <div class="supplement-recommendations">
                <el-table
                  :data="supplementRecommendations"
                  :border="true"
                  size="large"
                  style="width: 100%"
                >
                  <el-table-column prop="nutrient" label="营养素" />
                  <el-table-column prop="dosage" label="推荐剂量" />
                  <el-table-column prop="benefit" label="作用" />
                  <el-table-column prop="caution" label="注意事项" />
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

      <!-- 营养报告 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="report-card" shadow="never">
          <template #header>
            <span class="card-title">营养报告</span>
          </template>
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-button type="primary" @click="generateReport" size="large">
                生成营养报告
              </el-button>
              <el-button @click="exportReport" :disabled="!nutritionReport" size="large">
                导出报告
              </el-button>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="date-picker-col">
              <el-date-picker 
                v-model="reportDate" 
                placeholder="选择报告日期"
                @change="onReportDateChange"
                style="width: 100%"
                size="large"
              />
            </el-col>
          </el-row>

          <!-- 报告内容 -->
          <div v-if="nutritionReport" class="report-content">
            <el-divider />
            <div class="report-summary">
              <h4 class="report-title">营养摄入总结</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="总热量">{{ nutritionReport.totalCalories }} kcal</el-descriptions-item>
                <el-descriptions-item label="蛋白质">{{ nutritionReport.protein }}g</el-descriptions-item>
                <el-descriptions-item label="脂肪">{{ nutritionReport.fat }}g</el-descriptions-item>
                <el-descriptions-item label="碳水化合物">{{ nutritionReport.carbs }}g</el-descriptions-item>
                <el-descriptions-item label="膳食纤维">{{ nutritionReport.fiber }}g</el-descriptions-item>
                <el-descriptions-item label="维生素C">{{ nutritionReport.vitaminC }}mg</el-descriptions-item>
              </el-descriptions>
            </div>

            <div class="report-analysis">
              <h4 class="report-title">营养分析</h4>
              <el-alert
                v-for="(analysis, index) in nutritionReport.analysis"
                :key="index"
                :title="analysis.title"
                :description="analysis.content"
                :type="analysis.type"
                :closable="false"
                show-icon
                class="analysis-item"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
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
  if (calories < 1500) return '#67c23a'
  if (calories < 2000) return '#e6a23c'
  return '#f56c6c'
}

const getCompletionColor = (rate: number) => {
  if (rate < 60) return '#f56c6c'
  if (rate < 80) return '#e6a23c'
  return '#67c23a'
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
  
  ElMessage.success('营养需求计算完成！')
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
  
  ElMessage.success('营养报告生成完成！')
}

const exportReport = () => {
  ElMessage.info('报告导出功能开发中...')
}

const onReportDateChange = (date: any) => {
  if (date) {
    ElMessage.info(`选择日期: ${date.toLocaleDateString()}`)
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
          borderColor: '#409eff',
          backgroundColor: 'rgba(64, 158, 255, 0.1)',
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
          backgroundColor: ['#67c23a', '#e6a23c', '#409eff']
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

<style lang="less" scoped>
.nutrition-page {
  padding: 0;
}

.overview-card,
.chart-card,
.calculator-card,
.advice-card,
.report-card {
  margin-bottom: 24px;
  border: none;
  box-shadow: none;
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.calculation-result {
  margin-top: 24px;
  padding: 24px;
  background: #f5f7fa;
  border-radius: 8px;
  
  .result-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 20px 0;
  }
}

.nutrition-tips {
  .tip-item {
    margin-bottom: 16px;
  }
}

.dietary-recommendations {
  .recommendation-title {
    font-size: 18px;
    font-weight: 600;
    color: #409eff;
    margin-bottom: 20px;
  }
  
  .food-item {
    h5 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }
    
    p {
      color: #606266;
      margin: 0;
      line-height: 1.6;
    }
  }
}

.supplement-recommendations {
  margin-top: 20px;
}

.report-content {
  margin-top: 24px;
  
  .report-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 20px 0;
  }
  
  .report-summary,
  .report-analysis {
    margin-bottom: 32px;
  }
  
  .analysis-item {
    margin-bottom: 16px;
  }
}

.date-picker-col {
  text-align: right;
}

// 移动端适配
@media (max-width: 768px) {
  .nutrition-page {
    padding: 0;
    
    .overview-card,
    .chart-card,
    .calculator-card,
    .advice-card,
    .report-card {
      margin: 0 0 16px 0;
      border-radius: 0;
    }
  }
  
  .calculation-result {
    margin-top: 16px;
    padding: 16px;
  }
  
  .date-picker-col {
    text-align: left;
    margin-top: 16px;
  }
  
  .dietary-recommendations {
    .recommendation-title {
      font-size: 16px;
    }
  }
}

@media (max-width: 480px) {
  .overview-card,
  .chart-card,
  .calculator-card,
  .advice-card,
  .report-card {
    .card-title {
      font-size: 16px;
    }
  }
  
  .calculation-result {
    .result-title {
      font-size: 16px;
    }
  }
  
  .report-content {
    .report-title {
      font-size: 16px;
    }
  }
}
</style>
