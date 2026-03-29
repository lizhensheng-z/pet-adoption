<template>
  <nav class="app-tabbar" v-if="showTabbar">
    <router-link
      v-for="item in tabItems"
      :key="item.path"
      :to="item.path"
      class="tab-item"
      :class="{ active: $route.path === item.path }"
    >
      <el-icon :size="20">
        <component :is="item.icon" />
      </el-icon>
      <span class="tab-text">{{ item.name }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import {
  House, List, ChatDotRound, Star, DocumentCopy, User,
  Management, Document, DataAnalysis, Phone
} from '@element-plus/icons-vue'

const route = useRoute()
const authStore = useAuthStore()

// 判断是否显示底部导航
const showTabbar = computed(() => {
  // 在机构管理页面和管理员后台页面不显示底部导航
  if (route.path.startsWith('/org/') || route.path.startsWith('/admin/')) {
    return false
  }
  return true
})

// 根据用户类型和登录状态显示不同的导航项
const tabItems = computed(() => {
  const baseItems = [
    { path: '/home', name: '首页', icon: House },
    { path: '/pets', name: '宠物', icon: List },
    { path: '/ai-assistant', name: 'AI助手', icon: ChatDotRound }
  ]

  const userItems = [
    { path: '/favorites', name: '收藏', icon: Star },
    { path: '/applications', name: '申请', icon: DocumentCopy },
    { path: '/profile', name: '我的', icon: User }
  ]

  if (authStore.isLoggedIn) {
    return [...baseItems, ...userItems]
  } else {
    return [
      ...baseItems,
      { path: '/login', name: '登录', icon: User }
    ]
  }
})
</script>

<style scoped>
.app-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: white;
  border-top: 1px solid #eee;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s;
  min-height: 50px;
  justify-content: center;
}

.tab-item.active {
  color: #FF8C42;
}

.tab-text {
  font-size: 12px;
  margin-top: 4px;
  line-height: 1;
}

.tab-item:hover {
  color: #FF8C42;
  background: rgba(255, 140, 66, 0.05);
}

/* PC端样式 */
@media (min-width: 769px) {
  .app-tabbar {
    justify-content: center;
  }

  .tab-item {
    flex: none;
    min-width: 80px;
    padding: 10px 24px;
  }
}

/* 移动端样式 */
@media (max-width: 768px) {
  .tab-item {
    flex: 1;
    padding: 8px 0 6px;
  }
}
</style>