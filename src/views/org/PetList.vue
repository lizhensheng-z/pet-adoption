<template>

    <PageHeader title="宠物管理" />
    <div class="page-container">
      <div class="page-content">
        <el-empty description="宠物管理功能开发中..." />
      </div>
    </div>

</template>

<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<style scoped>
.page-container { padding: var(--spacing-xl); }
.page-content { background: white; border-radius: var(--border-radius-large); padding: var(--spacing-xxl); }
</style>