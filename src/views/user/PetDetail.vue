<template>
  <AppLayout>
    <PageHeader title="宠物详情" />
    <div class="page-container">
      <el-skeleton :rows="10" animated />
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  console.log('宠物ID:', route.params.id)
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
  background: white;
}
</style>