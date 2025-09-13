<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <div class="logo">
          <h1>食光家</h1>
          <p>创建您的账户</p>
        </div>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              type="email"
              placeholder="邮箱"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="nickname">
            <el-input
              v-model="form.nickname"
              placeholder="昵称（可选）"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isLoading"
              @click="handleRegister"
              class="register-btn"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="footer">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const appStore = useAppStore()

const formRef = ref<FormInstance>()
const isLoading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await appStore.register(form)
    ElMessage.success('注册成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
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
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.register-form {
  padding: 40px;
}

.logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.logo p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.form {
  width: 100%;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.footer {
  text-align: center;
  margin-top: 24px;
}

.footer p {
  color: #666;
  margin: 0;
}

.footer a {
  color: #409EFF;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
