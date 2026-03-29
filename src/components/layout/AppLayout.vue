<template>
  <div class="app-layout" :class="{ 'has-tabbar': showTabbar }">
    <!-- 顶部导航栏 -->
    <AppHeader />

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部导航栏 -->
    <AppTabbar />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import AppHeader from './AppHeader.vue'
import AppTabbar from './AppTabbar.vue'

const appStore = useAppStore()
const route = useRoute()

// 判断是否显示底部导航
const showTabbar = computed(() => {
  // 在机构管理页面和管理员后台页面不显示底部导航
  if (route.path.startsWith('/org/') || route.path.startsWith('/admin/')) {
    return false
  }
  return true
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

/* 只在显示底部导航时预留空间 */
.app-layout.has-tabbar .main-content {
  padding-bottom: 70px;
}
</style>