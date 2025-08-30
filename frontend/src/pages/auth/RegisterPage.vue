<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">食光家</h1>
          <p class="auth-subtitle">智能家庭餐饮助手</p>
        </div>

        <a-form
          :model="formData"
          :rules="rules"
          @finish="handleSubmit"
          layout="vertical"
          class="auth-form"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="formData.username"
              size="large"
              placeholder="请输入用户名"
              prefix-icon="user"
            />
          </a-form-item>

          <a-form-item label="邮箱" name="email">
            <a-input
              v-model:value="formData.email"
              size="large"
              placeholder="请输入邮箱地址"
              prefix-icon="mail"
            />
          </a-form-item>

          <a-form-item label="手机号" name="phone">
            <a-input
              v-model:value="formData.phone"
              size="large"
              placeholder="请输入手机号（可选）"
              prefix-icon="phone"
            />
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="formData.password"
              size="large"
              placeholder="请输入密码"
              prefix-icon="lock"
            />
          </a-form-item>

          <a-form-item label="确认密码" name="confirmPassword">
            <a-input-password
              v-model:value="formData.confirmPassword"
              size="large"
              placeholder="请再次输入密码"
              prefix-icon="lock"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="isLoading"
              class="auth-button"
              block
            >
              注册
            </a-button>
          </a-form-item>
        </a-form>

        <div class="auth-footer">
          <p>
            已有账号？
            <router-link to="/login" class="auth-link">立即登录</router-link>
          </p>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="feature-display">
          <h3>加入食光家，享受智能烹饪</h3>
          <div class="feature-grid">
            <div class="feature-item">
              <a-icon type="robot" />
              <span>AI智能助手</span>
            </div>
            <div class="feature-item">
              <a-icon type="team" />
              <span>家庭协作</span>
            </div>
            <div class="feature-item">
              <a-icon type="safety" />
              <span>营养健康</span>
            </div>
            <div class="feature-item">
              <a-icon type="star" />
              <span>个性化推荐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterRequest } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive<RegisterRequest>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const error = ref('')

const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value !== formData.password) {
    throw new Error('两次输入的密码不一致')
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    await authStore.register(formData)
    message.success('注册成功！欢迎加入食光家！')
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || '注册失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 480px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 32px;
  font-weight: bold;
  color: #1890ff;
  margin: 0 0 8px 0;
}

.auth-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.auth-form {
  margin-bottom: 24px;
}

.auth-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.auth-footer {
  text-align: center;
  margin-bottom: 24px;
}

.auth-link {
  color: #1890ff;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

.error-message {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 24px;
  text-align: center;
}

.feature-display {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.feature-display h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 16px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.feature-item .anticon {
  font-size: 18px;
  color: #1890ff;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }
  
  .auth-title {
    font-size: 28px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
