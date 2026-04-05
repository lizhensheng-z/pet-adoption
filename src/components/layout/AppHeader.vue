<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <router-link to="/home" class="logo-link">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M4.5 9.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm15 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM7 11a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7zm-4 6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H3z"/>
            </svg>
          </div>
          <span class="logo-text">{{ systemConfig.siteName }}</span>
        </router-link>
      </div>

      <!-- 操作区域 -->
      <div class="action-section">
        <!-- 位置信息 -->
        <div class="location-info" v-if="!isMobile">
          <el-dropdown @command="handleLocationCommand" :disabled="locationLoading">
            <div class="location-trigger" :class="{ loading: locationLoading }">
              <el-icon v-if="locationLoading" class="is-loading"><Loading /></el-icon>
              <el-icon v-else class="location-icon"><Location /></el-icon>
              <span class="location-text">{{ locationLoading ? '定位中...' : currentCity }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="refresh" :disabled="locationLoading">
                  <el-icon v-if="locationLoading" class="is-loading"><Loading /></el-icon>
                  <el-icon v-else><LocationInformation /></el-icon>
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
          <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
            <el-button circle class="notification-btn" @click="showNotifications">
              <el-icon :size="18"><Bell /></el-icon>
            </el-button>
          </el-badge>
        </div>

        <!-- 用户菜单 -->
        <div class="user-section">
          <el-dropdown v-if="isLoggedIn" @command="handleUserCommand" trigger="click">
            <div class="user-info">
              <el-avatar :src="userAvatar" :size="34" class="user-avatar">
                {{ userInitial }}
              </el-avatar>
              <span class="username" v-if="!isMobile">{{ userName }}</span>
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown">
                <div class="dropdown-header">
                  <el-avatar :src="userAvatar" :size="48">
                    {{ userInitial }}
                  </el-avatar>
                  <div class="user-detail">
                    <span class="user-name">{{ userName }}</span>
                    <span class="user-role" v-if="isOrgUser">机构用户</span>
                    <span class="user-role" v-else-if="isAdminUser">管理员</span>
                    <span class="user-role" v-else>普通用户</span>
                  </div>
                </div>
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
                <el-dropdown-item v-if="isOrgUser" command="orgHome" divided>
                  <el-icon><OfficeBuilding /></el-icon>
                  机构首页
                </el-dropdown-item>
                <el-dropdown-item v-if="isAdminUser" command="adminHome" divided>
                  <el-icon><Setting /></el-icon>
                  管理后台
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
            <el-button class="login-btn" @click="handleLoginClick">登录</el-button>
            <el-button type="primary" class="register-btn" @click="$router.push('/register')">注册</el-button>
          </div>
        </div>
      </div>
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
  Location, ArrowDown, Bell, User, Star,
  Document, SwitchButton, Loading, LocationInformation,
  OfficeBuilding, Setting
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

// 响应式数据
const unreadCount = ref(0)
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
const isOrgUser = computed(() => {
  const userRole = authStore.userRole
  return userRole === 'ORG' || userRole === 'ROLE_ORG'
})
const isAdminUser = computed(() => {
  const userRole = authStore.userRole
  return userRole === 'ADMIN' || userRole === 'ROLE_ADMIN'
})

// 事件处理
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
    case 'orgHome':
      router.push('/org')
      break
    case 'adminHome':
      router.push('/admin')
      break
    case 'logout':
      authStore.logout()
      break
  }
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
  background: linear-gradient(to right, #fff, #fffaf7);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 140, 66, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-info {
  cursor: pointer;
  margin-right: 8px;
}

.location-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.location-trigger:hover {
  background: #fff3eb;
}

.location-trigger.loading {
  color: #FF8C42;
}

.location-icon {
  color: #FF8C42;
  font-size: 16px;
}

.location-text {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.arrow-icon {
  color: #999;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.location-trigger:hover .arrow-icon {
  color: #FF8C42;
}

.notification-section {
  display: flex;
  align-items: center;
}

.notification-btn {
  border: none;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: #fff3eb;
  color: #FF8C42;
}

.user-section {
  cursor: pointer;
  margin-left: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 24px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: #fff3eb;
}

.user-avatar {
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  color: white;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.dropdown-arrow {
  color: #999;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-arrow {
  color: #FF8C42;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.login-btn {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 500;
  border-color: #FF8C42;
  color: #FF8C42;
}

.login-btn:hover {
  background: #fff3eb;
  border-color: #FF6B35;
  color: #FF6B35;
}

.register-btn {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 500;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

.register-btn:hover {
  background: linear-gradient(135deg, #FF7B2E 0%, #FF5A1F 100%);
  box-shadow: 0 4px 16px rgba(255, 140, 66, 0.4);
}

/* 下拉菜单样式 */
:deep(.dropdown-header) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

:deep(.user-detail) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

:deep(.user-name) {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

:deep(.user-role) {
  font-size: 12px;
  color: #999;
}

:deep(.user-dropdown) {
  min-width: 200px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 56px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .logo-text {
    font-size: 18px;
  }

  .action-section {
    gap: 6px;
  }

  .username {
    display: none;
  }

  .user-info {
    padding: 4px 8px 4px 4px;
    border-radius: 20px;
  }

  .dropdown-arrow {
    display: none;
  }
}
</style>