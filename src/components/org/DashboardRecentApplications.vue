<template>
  <el-card class="recent-applications-card">
    <template #header>
      <div class="recent-applications-card__header">
        <div class="recent-applications-card__title">
          <el-icon><Document /></el-icon>
          <span>最新领养申请</span>
        </div>
        <el-button
          text
          type="primary"
          size="small"
          @click="handleViewAll"
        >
          查看全部
        </el-button>
      </div>
    </template>

    <!-- 加载状态 -->
    <div v-if="loading" class="recent-applications-card__loading">
      <el-skeleton :rows="4" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="applications.length === 0" class="recent-applications-card__empty">
      <el-empty
        description="暂无申请数据"
        :image-size="120"
      />
    </div>

    <!-- 申请列表 -->
    <div v-else class="recent-applications-card__list">
      <div
        v-for="app in applications"
        :key="app.id"
        class="application-item"
        @click="handleApplicationClick(app)"
      >
        <div class="application-item__pet">
          <el-image
            :src="app.petCoverUrl"
            :preview-src-list="[app.petCoverUrl]"
            fit="cover"
            class="application-item__pet-cover"
          >
            <template #error>
              <div class="application-item__error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>

        <div class="application-item__content">
          <div class="application-item__header">
            <div class="application-item__user">
              <el-avatar
                :src="app.userAvatar"
                :size="32"
              >
                {{ app.userName?.charAt(0) }}
              </el-avatar>
              <span class="application-item__username">{{ app.userName }}</span>
            </div>
            <el-tag
              :type="getStatusType(app.status)"
              size="small"
            >
              {{ app.statusDesc || getStatusText(app.status) }}
            </el-tag>
          </div>

          <div class="application-item__info">
            申请领养 <strong>{{ app.petName }}</strong>
          </div>

          <div class="application-item__meta">
            <span class="application-item__time">
              {{ formatTime(app.submitTime) }}
            </span>
          </div>
        </div>

        <div class="application-item__action">
          <el-button
            type="primary"
            size="small"
            @click.stop="handleProcess(app)"
          >
            处理
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Document,
  Picture
} from '@element-plus/icons-vue'

const props = defineProps({
  applications: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

const router = useRouter()

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    SUBMITTED: 'info',
    UNDER_REVIEW: 'warning',
    INTERVIEW: 'primary',
    HOME_VISIT: 'primary',
    APPROVED: 'success',
    REJECTED: 'danger',
    CANCELLED: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文字
const getStatusText = (status) => {
  const textMap = {
    SUBMITTED: '已提交',
    UNDER_REVIEW: '审核中',
    INTERVIEW: '已约面谈',
    HOME_VISIT: '家访中',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
    CANCELLED: '已取消'
  }
  return textMap[status] || status
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}分钟前`
  }

  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}小时前`
  }

  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }

  // 显示具体日期
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 查看全部
const handleViewAll = () => {
  router.push('/org/applications')
}

// 点击申请项
const handleApplicationClick = (app) => {
  router.push(`/org/applications/${app.id}`)
}

// 处理申请
const handleProcess = (app) => {
  router.push(`/org/applications/${app.id}`)
}
</script>

<style scoped>
.recent-applications-card {
  margin-bottom: var(--spacing-lg);
}

.recent-applications-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-applications-card__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.recent-applications-card__loading,
.recent-applications-card__empty {
  padding: var(--spacing-xl) 0;
}

.recent-applications-card__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.application-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--border-radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.application-item:hover {
  background: white;
  box-shadow: var(--shadow-light);
}

.application-item__pet {
  flex-shrink: 0;
}

.application-item__pet-cover {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-base);
}

.application-item__error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--bg-light);
  color: var(--text-placeholder);
  font-size: 32px;
}

.application-item__content {
  flex: 1;
  min-width: 0;
}

.application-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.application-item__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.application-item__username {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
}

.application-item__info {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.application-item__info strong {
  color: var(--primary-color);
}

.application-item__meta {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.application-item__action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .application-item {
    flex-direction: column;
  }

  .application-item__pet {
    width: 100%;
  }

  .application-item__pet-cover {
    width: 100%;
    height: 160px;
  }

  .application-item__action {
    width: 100%;
  }

  .application-item__action .el-button {
    width: 100%;
  }
}
</style>