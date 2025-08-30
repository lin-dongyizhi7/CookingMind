<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <el-aside 
      :class="['app-sider', { 'collapsed': collapsed }]"
      :width="collapsed ? '64px' : '240px'"
    >
      <div class="logo">
        <h2 v-if="!collapsed">食光家</h2>
        <h2 v-else>食</h2>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        class="app-menu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <template #title>仪表板</template>
        </el-menu-item>
        
        <el-menu-item index="/ingredients">
          <el-icon><Apple /></el-icon>
          <template #title>食材管理</template>
        </el-menu-item>
        
        <el-menu-item index="/recipes">
          <el-icon><Document /></el-icon>
          <template #title>菜谱管理</template>
        </el-menu-item>
        
        <el-menu-item index="/cooking">
          <el-icon><VideoPlay /></el-icon>
          <template #title>烹饪指导</template>
        </el-menu-item>
        
        <el-menu-item index="/nutrition">
          <el-icon><Star /></el-icon>
          <template #title>营养管理</template>
        </el-menu-item>
        
        <el-menu-item index="/family">
          <el-icon><UserFilled /></el-icon>
          <template #title>家庭管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 头部 -->
      <el-header class="app-header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleCollapsed"
            class="trigger-btn"
          >
            <el-icon>
              <Expand v-if="collapsed" />
              <Fold v-else />
            </el-icon>
          </el-button>
          
          <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item>食光家</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-space>
            <el-badge :value="3" class="notification-badge">
              <el-button type="text" circle>
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
            
            <el-dropdown>
              <el-button type="text" class="user-dropdown">
                <el-avatar :src="user?.avatar" :size="32">
                  {{ user?.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <span class="username">{{ user?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </el-button>
              
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/profile">
                      <el-icon><User /></el-icon>
                      个人资料
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>
                    设置
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <div class="main-content">
        <div class="content-area">
          <router-view />
        </div>
      </div>

      <!-- 页脚 -->
      <el-footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 食光家. 让烹饪更智能，让生活更美好.</p>
        </div>
      </el-footer>
    </div>

    <!-- 移动端遮罩 -->
    <div 
      v-if="!collapsed && isMobile" 
      class="mobile-overlay"
      @click="collapsed = true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'
import {
  Monitor,
  Apple,
  Document,
  VideoPlay,
  Star,
  UserFilled,
  Expand,
  Fold,
  Bell,
  User,
  Setting,
  SwitchButton,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const isMobile = ref(false)

const user = computed(() => authStore.user)

const activeMenu = computed(() => {
  return route.path
})

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

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value && !collapsed.value) {
    collapsed.value = true
  }
}

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = async () => {
  try {
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="less" scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.app-sider {
  background: #001529;
  transition: width 0.3s;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  
  &.collapsed {
    .logo h2 {
      font-size: 16px;
    }
  }
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
  
  h2 {
    margin: 0;
    transition: font-size 0.3s;
  }
}

.app-menu {
  border-right: none;
  
  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    
    &.is-active {
      background-color: #409EFF !important;
    }
    
    &:hover {
      background-color: #1890ff !important;
    }
  }
  
  :deep(.el-menu-item .el-icon) {
    margin-right: 8px;
  }
}

.main-container {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
  
  .app-sider.collapsed + & {
    margin-left: 64px;
  }
}

.app-header {
  background: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 64px;
  line-height: 64px;
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
  flex: 1;
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
  height: 48px;
  line-height: 48px;
}

.footer-content {
  color: #666;
  font-size: 14px;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

// 移动端适配
@media (max-width: 768px) {
  .app-sider {
    transform: translateX(-100%);
    transition: transform 0.3s;
    
    &.collapsed {
      transform: translateX(0);
    }
  }
  
  .main-container {
    margin-left: 0;
  }
  
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
  
  .breadcrumb {
    display: none;
  }
  
  .app-sider.collapsed + .main-container {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 0 12px;
  }
  
  .main-content {
    margin: 12px;
  }
  
  .content-area {
    padding: 12px;
  }
  
  .trigger-btn {
    width: 48px;
    height: 48px;
  }
}
</style>
