<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <div class="logo">
          <h1>食光家</h1>
          <p>让烹饪更智能，让生活更美好</p>
        </div>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名或邮箱"
              size="large"
              :prefix-icon="User"
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
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isLoading"
              @click="handleLogin"
              class="login-btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="footer">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>
      </div>
      
      <div class="demo-accounts">
        <h3>演示账号</h3>
        <div class="account-list">
          <div class="account-item" @click="fillDemoAccount('admin')">
            <el-avatar :size="40">A</el-avatar>
            <div>
              <p><strong>管理员</strong></p>
              <p>admin / admin</p>
            </div>
          </div>
          <div class="account-item" @click="fillDemoAccount('user1')">
            <el-avatar :size="40">U</el-avatar>
            <div>
              <p><strong>普通用户</strong></p>
              <p>user1 / user1</p>
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
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const appStore = useAppStore()

const formRef = ref<FormInstance>()
const isLoading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await appStore.login(form)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

const fillDemoAccount = (type: string) => {
  if (type === 'admin') {
    form.username = 'admin'
    form.password = 'admin'
  } else if (type === 'user1') {
    form.username = 'user1'
    form.password = 'user1'
  }
}
</script>

<style scoped>
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
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  max-width: 800px;
  width: 100%;
  min-height: 500px;
}

.login-form {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
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

.login-btn {
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

.demo-accounts {
  background: #f8f9fa;
  padding: 40px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.demo-accounts h3 {
  color: #333;
  margin: 0 0 24px 0;
  text-align: center;
  font-size: 18px;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.account-item:hover {
  background: #e9ecef;
}

.account-item p {
  margin: 0;
  font-size: 14px;
}

.account-item p:first-child {
  color: #333;
  font-weight: 500;
}

.account-item p:last-child {
  color: #666;
  font-size: 12px;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 400px;
  }
  
  .demo-accounts {
    width: 100%;
    padding: 20px;
  }
  
  .account-list {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .account-item {
    flex-direction: column;
    text-align: center;
    flex: 1;
  }
}
</style>
