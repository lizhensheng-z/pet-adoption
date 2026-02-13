<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app.js'

const appStore = useAppStore()

onMounted(() => {
  // 初始化应用设置
  appStore.initAppSettings()
  
  // 获取用户位置
  appStore.getUserLocation().catch(console.error)
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: var(--bg-light);
}
</style>