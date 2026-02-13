<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-message">页面未找到</div>
      <div class="error-description">
        抱歉，您访问的页面不存在或已被移除
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          返回首页
        </el-button>
        <el-button @click="goBack">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: var(--spacing-xxl);
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: var(--spacing-lg);
}

.error-message {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.error-description {
  font-size: var(--font-size-base);
  color: var(--text-regular);
  margin-bottom: var(--spacing-xl);
  line-height: var(--line-height-lg);
}

.error-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

@media (max-width: 768px) {
  .error-content {
    padding: var(--spacing-lg);
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-message {
    font-size: var(--font-size-xl);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .el-button {
    width: 200px;
  }
}
</style>