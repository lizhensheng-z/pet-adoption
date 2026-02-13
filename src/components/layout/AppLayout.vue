<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部导航栏（移动端） -->
    <AppTabbar v-if="isMobile" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app.js'
import AppHeader from './AppHeader.vue'
import AppTabbar from './AppTabbar.vue'

const appStore = useAppStore()

const isMobile = computed(() => {
  return window.innerWidth <= 768
})

onMounted(() => {
  appStore.initAppSettings()
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: env(safe-area-inset-bottom);
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 60px; /* 为底部导航预留空间 */
  }
}
</style>