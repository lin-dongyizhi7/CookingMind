<template>
  <div id="app">
    <LoadingSpinner v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()

const isLoading = computed(() => authStore.isLoading)

onMounted(async () => {
  // 检查用户是否已登录
  if (localStorage.getItem('token')) {
    await authStore.getCurrentUser()
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
</style>
