<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <el-aside :class="['sidebar', { 'collapsed': collapsed }]" :width="collapsed ? '64px' : '240px'">
      <div class="logo">
        <h2 v-if="!collapsed">食光家</h2>
        <h2 v-else>食</h2>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        class="menu"
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
      <el-header class="header">
        <div class="header-left">
          <el-button type="text" @click="toggleCollapsed" class="toggle-btn">
            <el-icon>
              <Expand v-if="collapsed" />
              <Fold v-else />
            </el-icon>
          </el-button>
          
          <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item>食光家</el-breadcrumb-item>
            <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown>
            <el-button type="text" class="user-btn">
              <el-avatar :src="user?.avatar" :size="32">
                {{ user?.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <span class="username">{{ user?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  Apple,
  Document,
  VideoPlay,
  Star,
  UserFilled,
  Expand,
  Fold,
  ArrowDown,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const collapsed = ref(false)

const user = computed(() => appStore.user)

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    '/dashboard': '仪表板',
    '/ingredients': '食材管理',
    '/recipes': '菜谱管理',
    '/cooking': '烹饪指导',
    '/nutrition': '营养管理',
    '/family': '家庭管理',
    '/profile': '个人资料'
  }
  return titleMap[route.path] || '未知页面'
})

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = async () => {
  try {
    appStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background: #001529;
  transition: width 0.3s;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f1f1f;
}

.menu {
  border: none;
}

.main-container {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed + .main-container {
  margin-left: 64px;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-btn {
  margin-right: 16px;
  font-size: 18px;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.username {
  font-size: 14px;
  color: #333;
}

.content {
  flex: 1;
  padding: 24px;
  background: #f5f5f5;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>
