<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <el-icon size="80" color="#f56c6c">
          <Lock />
        </el-icon>
      </div>
      <h1 class="error-title">403</h1>
      <h2 class="error-subtitle">无权限访问</h2>
      <p class="error-description">
        抱歉，您没有权限访问该页面
      </p>
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
import { Lock } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;

  .error-content {
    text-align: center;
    max-width: 400px;
    width: 100%;
  }

  .error-icon {
    margin-bottom: 20px;
  }

  .error-title {
    font-size: 72px;
    font-weight: bold;
    color: #f56c6c;
    margin: 0 0 10px 0;
  }

  .error-subtitle {
    font-size: 24px;
    color: #303133;
    margin: 0 0 16px 0;
  }

  .error-description {
    font-size: 16px;
    color: #606266;
    margin: 0 0 32px 0;
    line-height: 1.6;
  }

  .error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .error-page {
    .error-title {
      font-size: 48px;
    }
    
    .error-subtitle {
      font-size: 20px;
    }
    
    .error-description {
      font-size: 14px;
    }
  }
}
</style>