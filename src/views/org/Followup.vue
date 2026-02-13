<template>
  <AppLayout>
    <PageHeader title="回访管理" />
    <div class="page-container">
      <div class="page-content">
        <el-empty description="回访管理功能开发中..." />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<style scoped>
.page-container { padding: var(--spacing-xl); }
.page-content { background: white; border-radius: var(--border-radius-large); padding: var(--spacing-xxl); }
</style>