<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()

onMounted(async () => {
  try {
    // 检查用户是否已登录
    if (localStorage.getItem('token')) {
      await appStore.getCurrentUser()
    }
    // 初始化数据
    await appStore.initializeData()
  } catch (error) {
    console.error('应用初始化失败:', error)
    ElMessage.error('应用初始化失败，请刷新页面重试')
  }
})
</script>

<style>
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
