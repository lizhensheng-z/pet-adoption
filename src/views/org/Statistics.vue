<template>
  <AppLayout>
    <PageHeader title="统计数据" />
    <div class="page-container">
      <div class="page-content">
        <el-empty description="统计数据功能开发中..." />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<style scoped>
.page-container { padding: var(--spacing-xl); }
.page-content { background: white; border-radius: var(--border-radius-large); padding: var(--spacing-xxl); }
</style>