<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="$router.push('/dashboard')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.content {
  text-align: center;
}

.content h1 {
  font-size: 120px;
  color: #409EFF;
  margin: 0;
  font-weight: bold;
}

.content h2 {
  font-size: 32px;
  color: #333;
  margin: 16px 0;
}

.content p {
  font-size: 16px;
  color: #666;
  margin: 16px 0 32px 0;
}
</style>