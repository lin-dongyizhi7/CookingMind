<template>
  <a-layout-header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo">
          <img src="/logo.svg" alt="食光家" />
          <span class="logo-text">食光家</span>
        </div>
      </div>

      <div class="header-center">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索食材、食谱..."
          size="large"
          class="search-input"
          @search="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>
      </div>

      <div class="header-right">
        <a-space>
          <a-button type="text" class="header-btn">
            <template #icon>
              <BellOutlined />
            </template>
          </a-button>

          <a-dropdown>
            <a-button type="text" class="header-btn user-dropdown">
              <a-avatar :src="authStore.user?.avatar" :size="32">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() }}
              </a-avatar>
              <span class="username">{{ authStore.user?.username }}</span>
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="router.push('/profile')">
                  <UserOutlined />
                  个人资料
                </a-menu-item>
                <a-menu-item key="settings" @click="router.push('/family')">
                  <SettingOutlined />
                  家庭设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  SearchOutlined, 
  BellOutlined, 
  DownOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')

const handleSearch = (value: string) => {
  if (value.trim()) {
    // 实现搜索功能
    console.log('搜索:', value)
    message.info(`搜索: ${value}`)
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    message.success('已退出登录')
    router.push('/login')
  } catch (error) {
    message.error('退出登录失败')
  }
}
</script>

<style scoped>
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
  border-radius: 20px;
}

.search-input :deep(.ant-input) {
  border-radius: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
}

.search-input :deep(.ant-input:focus),
.search-input :deep(.ant-input:hover) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.header-right {
  display: flex;
  align-items: center;
}

.header-btn {
  height: 40px;
  border: none;
  color: #666;
  transition: all 0.3s ease;
}

.header-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 20px;
}

.username {
  font-size: 14px;
  color: #1a1a1a;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .header-center {
    margin: 0 16px;
  }
  
  .logo-text {
    display: none;
  }
  
  .username {
    display: none;
  }
}
</style>
