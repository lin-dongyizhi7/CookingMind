<template>
  <div class="loading-spinner">
    <el-loading-spinner />
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...'
})
</script>

<style lang="less" scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  .loading-text {
    margin-top: 16px;
    color: #666;
    font-size: 14px;
  }
}
</style>
