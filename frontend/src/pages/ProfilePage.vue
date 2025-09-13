<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar-section">
        <el-avatar :size="120" :src="user?.avatar">
          {{ user?.username?.charAt(0)?.toUpperCase() }}
        </el-avatar>
        <h1>{{ user?.nickname || user?.username }}</h1>
        <p>{{ user?.email }}</p>
      </div>
    </div>
    
    <div class="profile-content">
      <el-card class="profile-card">
        <template #header>
          <h3>个人信息</h3>
        </template>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
          @submit.prevent="handleUpdate"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" disabled />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" disabled />
          </el-form-item>
          
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
          
          <el-form-item label="头像" prop="avatar">
            <el-input v-model="form.avatar" placeholder="请输入头像URL" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="isLoading" @click="handleUpdate">
              更新信息
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card class="stats-card">
        <template #header>
          <h3>统计信息</h3>
        </template>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ recipesCount }}</div>
            <div class="stat-label">创建菜谱</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ ingredientsCount }}</div>
            <div class="stat-label">管理食材</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ familiesCount }}</div>
            <div class="stat-label">加入家庭</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const appStore = useAppStore()

const formRef = ref<FormInstance>()
const isLoading = ref(false)

const user = computed(() => appStore.user)
const recipesCount = computed(() => appStore.recipesCount)
const ingredientsCount = computed(() => appStore.ingredientsCount)
const familiesCount = computed(() => appStore.familiesCount)

const form = reactive({
  username: '',
  email: '',
  nickname: '',
  avatar: ''
})

const rules: FormRules = {
  nickname: [
    { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
  ]
}

onMounted(() => {
  if (user.value) {
    Object.assign(form, {
      username: user.value.username,
      email: user.value.email,
      nickname: user.value.nickname,
      avatar: user.value.avatar || ''
    })
  }
})

const handleUpdate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await appStore.updateUser({
      nickname: form.nickname,
      avatar: form.avatar
    })
    
    ElMessage.success('信息更新成功')
  } catch (error) {
    console.error('更新信息失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 32px;
}

.avatar-section h1 {
  margin: 16px 0 8px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.avatar-section p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card,
.stats-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-card h3,
.stats-card h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>