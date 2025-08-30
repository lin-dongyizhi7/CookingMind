<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <div class="form-header">
          <h1 class="title">加入食光家</h1>
          <p class="subtitle">创建您的智能烹饪账户</p>
        </div>
        
        <el-form
          ref="registerFormRef"
          :model="formData"
          :rules="rules"
          @submit.prevent="handleSubmit"
          class="register-form-content"
        >
          <el-form-item prop="username" label="用户名">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱地址"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="phone" label="手机号">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号"
              size="large"
              prefix-icon="Phone"
            />
          </el-form-item>
          
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword" label="确认密码">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isLoading"
              @click="handleSubmit"
              class="register-button"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="form-footer">
          <p class="login-text">
            已有账户？
            <el-link type="primary" @click="goToLogin">
              立即登录
            </el-link>
          </p>
        </div>
      </div>
      
      <div class="register-image">
        <div class="image-content">
          <h2>食光家</h2>
          <p>让烹饪更智能，让生活更美好</p>
          
          <div class="features">
            <div class="feature-item">
              <el-icon><Robot /></el-icon>
              <span>AI智能助手</span>
            </div>
            <div class="feature-item">
              <el-icon><UserFilled /></el-icon>
              <span>家庭共享</span>
            </div>
            <div class="feature-item">
              <el-icon><Shield /></el-icon>
              <span>安全可靠</span>
            </div>
            <div class="feature-item">
              <el-icon><Star /></el-icon>
              <span>品质保证</span>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Message, Phone, Lock, Robot, UserFilled, Shield, Star } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterRequest } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref<FormInstance>()
const isLoading = ref(false)

const formData = reactive<RegisterRequest>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2到20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSubmit = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    isLoading.value = true
    
    await authStore.register(formData)
    ElMessage.success('注册成功！欢迎加入食光家！')
    router.push('/dashboard')
  } catch (err: any) {
    if (err.message) {
      ElMessage.error(err.message)
    } else {
      ElMessage.error('注册失败，请检查输入信息')
    }
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="less" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  display: flex;
  min-height: 600px;
}

.register-form {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  
  .title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin: 0 0 12px 0;
  }
  
  .subtitle {
    font-size: 16px;
    color: #666;
    margin: 0;
  }
}

.register-form-content {
  .el-form-item {
    margin-bottom: 24px;
  }
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8, #6a4190);
  }
}

.form-footer {
  text-align: center;
  margin-top: 32px;
  
  .login-text {
    color: #666;
    margin: 0;
    
    .el-link {
      font-weight: 600;
    }
  }
}

.register-image {
  flex: 1;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  
  .image-content {
    h2 {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }
    
    p {
      font-size: 18px;
      margin: 0 0 40px 0;
      opacity: 0.9;
    }
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 300px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  
  .el-icon {
    font-size: 24px;
    color: #ffd700;
  }
  
  span {
    font-size: 14px;
    font-weight: 500;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
    min-height: auto;
  }
  
  .register-form {
    padding: 40px 24px;
  }
  
  .register-image {
    padding: 40px 24px;
    
    .image-content {
      h2 {
        font-size: 32px;
      }
      
      p {
        font-size: 16px;
      }
    }
  }
  
  .form-header .title {
    font-size: 28px;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: 16px;
  }
  
  .register-form {
    padding: 32px 20px;
  }
  
  .form-header .title {
    font-size: 24px;
  }
}
</style>
