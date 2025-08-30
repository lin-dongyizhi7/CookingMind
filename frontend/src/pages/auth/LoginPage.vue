<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <div class="form-header">
          <h1 class="title">欢迎回来</h1>
          <p class="subtitle">登录您的食光家账户</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          @submit.prevent="handleLogin"
          class="login-form-content"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="邮箱地址"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="loginForm.rememberMe">
                记住我
              </el-checkbox>
              <el-link type="primary" @click="forgotPassword">
                忘记密码？
              </el-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-button"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="form-footer">
          <p class="signup-text">
            还没有账户？
            <el-link type="primary" @click="goToRegister">
              立即注册
            </el-link>
          </p>
        </div>
      </div>
      
      <div class="login-image">
        <div class="image-content">
          <h2>食光家</h2>
          <p>让烹饪更智能，让生活更美好</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    await authStore.login(loginForm.email, loginForm.password)
    ElMessage.success('登录成功！')
    router.push('/dashboard')
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('登录失败，请检查邮箱和密码')
    }
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  ElMessage.info('忘记密码功能开发中...')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style lang="less" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  display: flex;
  min-height: 600px;
}

.login-form {
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

.login-form-content {
  .el-form-item {
    margin-bottom: 24px;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-button {
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
  
  .signup-text {
    color: #666;
    margin: 0;
    
    .el-link {
      font-weight: 600;
    }
  }
}

.login-image {
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
      margin: 0;
      opacity: 0.9;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    min-height: auto;
  }
  
  .login-form {
    padding: 40px 24px;
  }
  
  .login-image {
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
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }
  
  .login-form {
    padding: 32px 20px;
  }
  
  .form-header .title {
    font-size: 24px;
  }
}
</style>
