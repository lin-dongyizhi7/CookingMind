<template>
  <el-header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo" @click="goHome">
          <img src="/logo.png" alt="食光家" />
          <span class="logo-text">食光家</span>
        </div>
      </div>
      
      <div class="header-center">
        <el-input
          v-model="searchQuery"
          placeholder="搜索食谱、食材..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      
      <div class="header-right">
        <el-space>
          <el-badge :value="3" class="notification-badge">
            <el-button type="text" circle>
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>
          
          <el-dropdown @command="handleCommand">
            <el-button type="text" class="user-dropdown">
              <el-avatar :src="user?.avatar" :size="32">
                {{ user?.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <span class="username">{{ user?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Bell, 
  ArrowDown, 
  User, 
  Setting, 
  SwitchButton 
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const user = computed(() => authStore.user)

const goHome = () => {
  router.push('/dashboard')
}

const handleSearch = (value: string) => {
  if (value.trim()) {
    // 实现搜索功能
    console.log('搜索:', value)
    ElMessage.info(`搜索: ${value}`)
  }
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}
</script>

<style lang="less" scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
}

.logo img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-center {
  flex: 1;
  max-width: 500px;
  margin: 0 48px;
}

.search-input {
  width: 100%;
}

.header-right {
  display: flex;
  align-items: center;
}

.notification-badge {
  margin-right: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
}

.username {
  color: #333;
  font-weight: 500;
}

// 移动端适配
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .header-center {
    margin: 0 16px;
  }
  
  .username {
    display: none;
  }
  
  .logo-text {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .header-center {
    display: none;
  }
  
  .logo-text {
    font-size: 16px;
  }
}
</style>
