<template>
  <AppLayout>
    <div class="profile-page">
      <!-- 顶部用户信息区域 -->
      <div class="profile-header">
        <div class="header-content">
          <div class="user-info">
            <el-avatar :size="64" :src="userInfo.avatar">
              <el-icon :size="32"><User /></el-icon>
            </el-avatar>
            <div class="user-details">
              <h2 class="username">
                {{ userInfo.nickname || userInfo.username || '用户' }}
                <span class="role-badge" v-if="userInfo.role">
                  {{ roleLabel }}
                </span>
              </h2>
              <p class="user-meta">
                ID: {{ userInfo.id || '---' }} | 坐标：{{ currentCity }}
              </p>
            </div>
            <el-icon class="settings-icon" @click="goToSettings"><Setting /></el-icon>
          </div>
        </div>

        <!-- 信用分卡片 -->
        <div class="credit-card">
          <div class="credit-score">
            <p class="label">当前信用分</p>
            <div class="score-display">
              <span class="score-value">{{ userInfo.creditScore || 0 }}</span>
              <span class="score-change" v-if="creditChange > 0">
                <el-icon><Top /></el-icon>
                {{ creditChange }}
              </span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="medals">
            <p class="label">已获勋章</p>
            <div class="medal-icons">
              <el-tooltip content="护星使者" placement="top">
                <span class="medal-item"><el-icon><Star /></el-icon></span>
              </el-tooltip>
              <el-tooltip content="领养达人" placement="top">
                <span class="medal-item"><el-icon><Medal /></el-icon></span>
              </el-tooltip>
              <el-tooltip content="诚信认证" placement="top">
                <span class="medal-item"><el-icon><CircleCheck /></el-icon></span>
              </el-tooltip>
            </div>
          </div>
          <el-button type="primary" link @click="showCreditDetail">详情</el-button>
        </div>
      </div>

      <!-- 统计数据网格 -->
      <div class="stats-grid">
        <div class="stat-item" @click="goToApplications">
          <span class="stat-value">{{ stats.applications }}</span>
          <span class="stat-label">我的申请</span>
        </div>
        <div class="stat-item" @click="goToFavorites">
          <span class="stat-value">{{ stats.favorites }}</span>
          <span class="stat-label">收藏宠物</span>
        </div>
        <div class="stat-item" @click="goToCheckins">
          <span class="stat-value">{{ stats.checkins }}</span>
          <span class="stat-label">打卡天数</span>
        </div>
        <div class="stat-item" @click="goToAdoptions">
          <span class="stat-value">{{ stats.adoptions }}</span>
          <span class="stat-label">领养成功</span>
        </div>
      </div>

      <!-- 功能菜单列表 -->
      <div class="menu-list">
        <div class="menu-item" @click="goToPreference">
          <div class="menu-icon red">
            <el-icon><StarFilled /></el-icon>
          </div>
          <span class="menu-text">我的偏好设置</span>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToCheckinRecords">
          <div class="menu-icon blue">
            <el-icon><Camera /></el-icon>
          </div>
          <span class="menu-text">打卡回访记录</span>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToHelp">
          <div class="menu-icon orange">
            <el-icon><QuestionFilled /></el-icon>
          </div>
          <span class="menu-text">帮助与反馈</span>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useAppStore } from '@/stores/app.js'
import AppLayout from '@/components/layout/AppLayout.vue'
import {
  User, Setting, Top, Star, Medal, CircleCheck,
  StarFilled, Camera, QuestionFilled, ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const loading = ref(false)
const creditChange = ref(12)

const stats = ref({
  applications: 0,
  favorites: 0,
  checkins: 0,
  adoptions: 0
})

const userInfo = computed(() => {
  return authStore.user || {}
})

const currentCity = computed(() => appStore.currentCity || '未知')

const roleLabel = computed(() => {
  const roleMap = {
    'USER': '普通用户',
    'ORG': '机构管理员',
    'ADMIN': '系统管理员'
  }
  return roleMap[userInfo.value.role] || '用户'
})

onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.user) {
      await authStore.getCurrentUser()
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.value = false
  }
})

const showCreditDetail = () => {
  // TODO: 跳转到信用分详情页面
}

const goToSettings = () => {
  router.push('/settings')
}

const goToApplications = () => {
  router.push('/applications')
}

const goToFavorites = () => {
  router.push('/favorites')
}

const goToCheckins = () => {
  router.push('/checkins')
}

const goToAdoptions = () => {
  router.push('/adoptions')
}

const goToPreference = () => {
  router.push('/preference')
}

const goToCheckinRecords = () => {
  router.push('/checkin-records')
}

const goToHelp = () => {
  router.push('/help')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.profile-header {
  background: linear-gradient(135deg, #FF8C42 0%, #FFB380 100%);
  padding: 32px 20px 60px;
  position: relative;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-badge {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: normal;
}

.user-meta {
  font-size: 12px;
  opacity: 0.8;
  margin: 4px 0 0;
}

.settings-icon {
  font-size: 20px;
  opacity: 0.8;
  cursor: pointer;
}

.credit-card {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: -40px;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 560px;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
}

.credit-score,
.medals {
  text-align: center;
}

.label {
  font-size: 10px;
  color: #909399;
  margin: 0 0 4px;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 28px;
  font-weight: 900;
  color: #FF8C42;
}

.score-change {
  font-size: 10px;
  color: #67C23A;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.divider {
  width: 1px;
  height: 40px;
  background: #f0f0f0;
}

.medal-icons {
  display: flex;
  gap: 4px;
  color: #FFB380;
}

.medal-item {
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: white;
  margin: 60px 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-item {
  background: white;
  padding: 20px 8px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}

.stat-item:hover {
  background: #fafafa;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  display: block;
  font-size: 10px;
  color: #909399;
  margin-top: 4px;
}

.menu-list {
  margin: 16px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #fafafa;
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 18px;
}

.menu-icon.red {
  background: #fef0f0;
  color: #F56C6C;
}

.menu-icon.blue {
  background: #f0f5ff;
  color: #409EFF;
}

.menu-icon.orange {
  background: #fef5e6;
  color: #E6A23C;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 14px;
}

@media (max-width: 480px) {
  .profile-header {
    padding: 24px 16px 60px;
  }

  .username {
    font-size: 18px;
  }

  .credit-card {
    padding: 12px 16px;
  }

  .score-value {
    font-size: 24px;
  }

  .stats-grid {
    margin: 60px 12px 12px;
    gap: 0;
  }

  .stat-item {
    padding: 16px 4px;
  }

  .stat-value {
    font-size: 16px;
  }
}
</style>
