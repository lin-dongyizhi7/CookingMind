<template>
  <el-aside class="app-sider" :width="collapsed ? '64px' : '240px'">
    <div class="sider-content">
      <div class="sider-header">
        <div class="sider-logo">
          <img src="/logo.png" alt="食光家" />
          <span v-show="!collapsed" class="sider-logo-text">食光家</span>
        </div>
      </div>
      
      <el-menu
        :default-active="selectedKeys[0]"
        :collapse="collapsed"
        class="sider-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><Monitor /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="cooking">
          <el-icon><Apple /></el-icon>
          <template #title>智能烹饪</template>
        </el-menu-item>
        
        <el-menu-item index="nutrition">
          <el-icon><Document /></el-icon>
          <template #title>营养管理</template>
        </el-menu-item>
        
        <el-menu-item index="family">
          <el-icon><UserFilled /></el-icon>
          <template #title>家庭管理</template>
        </el-menu-item>
        
        <el-menu-item index="profile">
          <el-icon><User /></el-icon>
          <template #title>个人资料</template>
        </el-menu-item>
      </el-menu>
      
      <div class="sider-footer">
        <el-button
          type="text"
          class="collapse-btn"
          @click="toggleCollapsed"
        >
          <el-icon>
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </el-icon>
        </el-button>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Monitor,
  Apple,
  Document,
  UserFilled,
  User,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

// 根据当前路由设置选中的菜单项
const currentRoute = computed(() => route.path)

watch(currentRoute, (newRoute) => {
  const path = newRoute.split('/')[1] || 'dashboard'
  selectedKeys.value = [path]
}, { immediate: true })

const handleMenuSelect = (key: string) => {
  router.push(`/${key}`)
}

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>

<style lang="less" scoped>
.app-sider {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  z-index: 999;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.sider-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sider-header {
  padding: 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sider-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.sider-logo img {
  width: 32px;
  height: 32px;
}

.sider-logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  white-space: nowrap;
}

.sider-menu {
  flex: 1;
  border: none;
  padding: 16px 0;
  
  :deep(.el-menu-item) {
    margin: 4px 16px;
    border-radius: 8px;
    height: 48px;
    line-height: 48px;
    
    &.is-active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a4190);
      }
    }
    
    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }
  }
}

.sider-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.collapse-btn {
  width: 100%;
  height: 40px;
  color: #666;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .app-sider {
    transform: translateX(-100%);
    
    &.mobile-open {
      transform: translateX(0);
    }
  }
}
</style>
