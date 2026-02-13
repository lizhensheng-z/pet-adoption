<template>
  <div class="admin-page">
    <PageHeader title="用户详情" />
    <div class="page-container">
      <div class="page-content">
        <el-skeleton :rows="8" animated />
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