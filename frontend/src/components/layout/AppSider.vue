<template>
  <a-layout-sider class="app-sider" :collapsed="collapsed" :trigger="null" collapsible>
    <div class="sider-content">
      <div class="sider-header">
        <div class="sider-logo">
          <img src="/logo.svg" alt="食光家" />
          <span v-show="!collapsed" class="sider-logo-text">食光家</span>
        </div>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        theme="light"
        class="sider-menu"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>仪表板</span>
        </a-menu-item>

        <a-menu-item key="ingredients">
          <template #icon>
            <CarrotOutlined />
          </template>
          <span>食材管理</span>
        </a-menu-item>

        <a-menu-item key="recipes">
          <template #icon>
            <BookOutlined />
          </template>
          <span>食谱管理</span>
        </a-menu-item>

        <a-menu-item key="cooking">
          <template #icon>
            <FireOutlined />
          </template>
          <span>烹饪指导</span>
        </a-menu-item>

        <a-menu-item key="nutrition">
          <template #icon>
            <HeartOutlined />
          </template>
          <span>营养管理</span>
        </a-menu-item>

        <a-menu-item key="family">
          <template #icon>
            <TeamOutlined />
          </template>
          <span>家庭管理</span>
        </a-menu-item>

        <a-menu-item key="profile">
          <template #icon>
            <UserOutlined />
          </template>
          <span>个人资料</span>
        </a-menu-item>
      </a-menu>

      <div class="sider-footer">
        <a-button
          type="text"
          class="collapse-btn"
          @click="toggleCollapsed"
        >
          <template #icon>
            <MenuFoldOutlined v-if="!collapsed" />
            <MenuUnfoldOutlined v-else />
          </template>
          <span v-show="!collapsed">收起菜单</span>
        </a-button>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  DashboardOutlined,
  CarrotOutlined,
  BookOutlined,
  FireOutlined,
  HeartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>([])

// 根据当前路由设置选中的菜单项
const currentRoute = computed(() => route.path)

watch(currentRoute, (newRoute) => {
  const path = newRoute.split('/')[1] || 'dashboard'
  selectedKeys.value = [path]
}, { immediate: true })

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(`/${key}`)
}

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
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
}

.sider-menu :deep(.ant-menu-item) {
  margin: 4px 16px;
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
}

.sider-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.sider-menu :deep(.ant-menu-item:hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.sider-menu :deep(.ant-menu-item-selected:hover) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.sider-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.collapse-btn {
  width: 100%;
  height: 40px;
  border: none;
  color: #666;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-sider {
    transform: translateX(-100%);
  }
  
  .app-sider.ant-layout-sider-collapsed {
    transform: translateX(0);
  }
}
</style>
