<template>
  <div class="loading-spinner" :class="{ 'fullscreen': fullscreen }">
    <a-spin :size="size" :tip="text">
      <template #indicator>
        <a-icon type="loading" :style="{ fontSize: `${size}px` }" spin />
      </template>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { Spin, Icon } from 'ant-design-vue'

interface Props {
  size?: 'small' | 'default' | 'large' | number
  text?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'default',
  text: '加载中...',
  fullscreen: false
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.loading-spinner.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-spinner .ant-spin {
  text-align: center;
}
</style>
