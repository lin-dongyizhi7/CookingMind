<template>
  <a-layout class="app-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="app-sider"
    >
      <div class="logo">
        <h2 v-if="!collapsed">食光家</h2>
        <h2 v-else>食</h2>
      </div>
      
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
        class="app-menu"
      >
        <a-menu-item key="dashboard">
          <router-link to="/dashboard">
            <a-icon type="dashboard" />
            <span>仪表板</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="ingredients">
          <router-link to="/ingredients">
            <a-icon type="carrot" />
            <span>食材管理</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="recipes">
          <router-link to="/recipes">
            <a-icon type="book" />
            <span>菜谱管理</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="cooking">
          <router-link to="/cooking">
            <a-icon type="play-circle" />
            <span>烹饪指导</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="nutrition">
          <router-link to="/nutrition">
            <a-icon type="heart" />
            <span>营养管理</span>
          </router-link>
        </a-menu-item>
        
        <a-menu-item key="family">
          <router-link to="/family">
            <a-icon type="team" />
            <span>家庭管理</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 主内容区域 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="app-header">
        <div class="header-left">
          <a-button
            type="text"
            @click="toggleCollapsed"
            class="trigger-btn"
          >
            <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
          </a-button>
          
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>食光家</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        
        <div class="header-right">
          <a-space>
            <a-badge :count="3" class="notification-badge">
              <a-button type="text" shape="circle">
                <a-icon type="bell" />
              </a-button>
            </a-badge>
            
            <a-dropdown>
              <a-button type="text" class="user-dropdown">
                <a-avatar :src="user?.avatar" :alt="user?.username">
                  {{ user?.username?.charAt(0)?.toUpperCase() }}
                </a-avatar>
                <span class="username">{{ user?.username }}</span>
                <a-icon type="down" />
              </a-button>
              
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <router-link to="/profile">
                      <a-icon type="user" />
                      个人资料
                    </router-link>
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <a-icon type="setting" />
                    设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <a-icon type="logout" />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="main-content">
        <div class="content-area">
          <router-view />
        </div>
      </a-layout-content>

      <!-- 页脚 -->
      <a-layout-footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 食光家. 让烹饪更智能，让生活更美好.</p>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/authStore'
import {
  DashboardOutlined,
  AppleOutlined,
  BookOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

const user = computed(() => authStore.user)

const currentPageTitle = computed(() => {
  const routeMap: Record<string, string> = {
    dashboard: '仪表板',
    ingredients: '食材管理',
    recipes: '菜谱管理',
    cooking: '烹饪指导',
    nutrition: '营养管理',
    family: '家庭管理',
    profile: '个人资料'
  }
  return routeMap[route.name as string] || '未知页面'
})

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = async () => {
  try {
    authStore.logout()
    message.success('已退出登录')
    router.push('/login')
  } catch (error) {
    message.error('退出登录失败')
  }
}

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  () => {
    updateSelectedKeys()
  },
  { immediate: true }
)

// 根据当前路由路径获取菜单key
const getMenuKeyFromRoute = (path: string): string => {
  // 移除开头的斜杠并获取第一段路径
  const pathSegments = path.split('/').filter(segment => segment)
  if (pathSegments.length === 0) return 'dashboard'
  
  const firstSegment = pathSegments[0]
  
  // 特殊处理cooking路由，因为它可能有参数
  if (firstSegment === 'cooking') return 'cooking'
  
  return firstSegment
}

// 更新选中的菜单项
const updateSelectedKeys = () => {
  const currentPath = route.path
  const menuKey = getMenuKeyFromRoute(currentPath)
  selectedKeys.value = [menuKey]
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-sider {
  background: #001529;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #303030;
}

.app-menu {
  border-right: none;
}

/* 确保菜单项链接样式正确 */
.app-menu :deep(.ant-menu-item) {
  margin: 0;
}

.app-menu :deep(.ant-menu-item a) {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-menu :deep(.ant-menu-item-selected) {
  background-color: #1890ff !important;
}

.app-menu :deep(.ant-menu-item:hover) {
  background-color: #1890ff !important;
}

.app-header {
  background: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trigger-btn {
  font-size: 18px;
  width: 64px;
  height: 64px;
  border: none;
  box-shadow: none;
}

.breadcrumb {
  margin-left: 16px;
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

.main-content {
  margin: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 112px);
}

.content-area {
  padding: 24px;
  background: white;
  border-radius: 8px;
  min-height: calc(100vh - 160px);
}

.app-footer {
  text-align: center;
  background: #f0f2f5;
  border-top: 1px solid #e8e8e8;
}

.footer-content {
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }
  
  .main-content {
    margin: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .username {
    display: none;
  }
}
</style>
