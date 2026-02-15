<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <span class="logo-text">{{ systemConfig.siteName }}</span>
        </router-link>
      </div>

      <!-- 搜索框（PC端） -->
      <div class="search-section" v-if="!isMobile">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索宠物、品种、机构..."
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 操作区域 -->
      <div class="action-section">
<!-- 位置信息 -->
        <div class="location-info" v-if="!isMobile">
          <el-dropdown @command="handleLocationCommand" :disabled="locationLoading">
            <span class="location-trigger" :class="{ loading: locationLoading }">
              <el-icon v-if="locationLoading" class="is-loading"><Loading /></el-icon>
              <el-icon v-else><Location /></el-icon>
              {{ locationLoading ? '定位中...' : currentCity }}
              <el-icon v-if="!locationLoading"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="refresh" :disabled="locationLoading">
                  <el-icon v-if="locationLoading" class="is-loading"><Loading /></el-icon>
                  {{ locationLoading ? '定位中...' : '刷新位置' }}
                </el-dropdown-item>
                <el-dropdown-item command="change">
                  <el-icon><LocationInformation /></el-icon>
                  切换城市
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 消息通知 -->
        <div class="notification-section">
          <el-badge :value="unreadCount" :hidden="unreadCount === 0">
            <el-button circle @click="showNotifications">
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>
        </div>

        <!-- 用户菜单 -->
        <div class="user-section">
          <el-dropdown v-if="isLoggedIn" @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :src="userAvatar" :size="32">
                {{ userInitial }}
              </el-avatar>
              <span class="username" v-if="!isMobile">{{ userName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="favorites">
                  <el-icon><Star /></el-icon>
                  我的收藏
                </el-dropdown-item>
                <el-dropdown-item command="applications">
                  <el-icon><Document /></el-icon>
                  我的申请
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
<!-- 未登录状态 -->
          <div class="auth-buttons" v-else>
            <el-button @click="handleLoginClick">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <el-button circle v-if="isMobile" @click="toggleMobileMenu">
          <el-icon><Menu /></el-icon>
        </el-button>
      </div>
    </div>

<!-- 移动端搜索框 -->
    <div class="mobile-search" v-if="isMobile && showMobileSearch">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索宠物、品种、机构..."
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 城市选择器 -->
    <CitySelector ref="citySelectorRef" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth.js'
import { useAppStore } from '@/stores/app.js'
import CitySelector from '@/components/common/CitySelector.vue'
import {
  Search, Location, ArrowDown, Bell, User, Star,
  Document, SwitchButton, Menu, Loading, LocationInformation
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

// 响应式数据
const searchKeyword = ref('')
const unreadCount = ref(0)
const showMobileSearch = ref(false)
const locationLoading = ref(false)
const citySelectorRef = ref(null)

// 计算属性
const isMobile = computed(() => window.innerWidth <= 768)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userAvatar = computed(() => authStore.user?.avatar)
const userName = computed(() => authStore.user?.nickname || authStore.user?.username)
const userInitial = computed(() => userName.value?.charAt(0)?.toUpperCase() || 'U')
const currentCity = computed(() => appStore.currentCity)
const systemConfig = computed(() => appStore.systemConfig)

// 事件处理
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/pets',
      query: { keyword: searchKeyword.value.trim() }
    })
    showMobileSearch.value = false
  }
}

const showNotifications = () => {
  // TODO: 显示通知面板
}

const handleLocationCommand = (command) => {
  switch (command) {
    case 'refresh':
      locationLoading.value = true
      appStore.getUserLocation()
        .then(() => {
          ElMessage.success('位置已更新')
        })
        .catch((error) => {
          console.error('获取位置失败:', error)
          ElMessage.error('获取位置失败，请检查浏览器权限设置')
        })
        .finally(() => {
          locationLoading.value = false
        })
      break
    case 'change':
      // 打开城市选择器
      if (citySelectorRef.value) {
        citySelectorRef.value.open()
      }
      break
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'favorites':
      router.push('/favorites')
      break
    case 'applications':
      router.push('/applications')
      break
    case 'logout':
      authStore.logout()
      break
  }
}

const toggleMobileMenu = () => {
  showMobileSearch.value = !showMobileSearch.value
}

// 登录按钮点击处理
const handleLoginClick = () => {
  if (isLoggedIn.value) {
    ElMessage.info('您已登录，无需重复登录')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo {
  height: 32px;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #FF8C42;
}

.search-section {
  flex: 1;
  margin: 0 40px;
  max-width: 500px;
}

.search-input {
  width: 100%;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.location-info {
  cursor: pointer;
}

.location-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
  transition: color 0.3s;
}

.location-trigger:hover {
  color: #FF8C42;
}

.location-trigger.loading {
  color: #FF8C42;
}

.notification-section .el-button {
  border: none;
  background: transparent;
}

.user-section {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #333;
}

.auth-buttons {
  display: flex;
  gap: 8px;
}

.mobile-search {
  padding: 10px 20px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 50px;
  }
  
  .search-section {
    display: none;
  }
  
  .action-section {
    gap: 12px;
  }
  
  .username {
    display: none;
  }
}
</style>