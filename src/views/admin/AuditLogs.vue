<template>
  <div class="admin-page">
    <PageHeader title="审计日志" />
    <div class="page-container">
      <div class="page-content">
        <el-empty description="审计日志功能开发中..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<style scoped>
.admin-page { min-height: 100vh; background: var(--bg-light); }
.page-container { padding: var(--spacing-xl); }
.page-content { background: white; border-radius: var(--border-radius-large); padding: var(--spacing-xxl); }
</style>