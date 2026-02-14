<template>

    <PageHeader title="申请详情" />
    <div class="page-container">
      <div class="page-content">
        <el-skeleton :rows="8" animated />
      </div>
    </div>

</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
</script>

<style scoped>
.page-container { padding: var(--spacing-xl); }
.page-content { background: white; border-radius: var(--border-radius-large); padding: var(--spacing-xxl); }
</style>