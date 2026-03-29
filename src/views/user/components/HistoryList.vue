<template>
  <div class="history-list-container">
    <!-- 返回按钮 -->
    <div class="header">
      <button class="back-btn" @click="$emit('back')">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回对话</span>
      </button>
      <h3 class="header-title">历史记录</h3>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 空状态 -->
    <div v-else-if="list.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p>暂无历史记录</p>
      <span>开始新对话吧</span>
    </div>

    <!-- 按天分组的会话列表 -->
    <div v-else class="day-groups">
      <div
        v-for="dayGroup in list"
        :key="dayGroup.day"
        class="day-group"
      >
        <!-- 日期标题 -->
        <div class="day-header">
          <span class="day-text">{{ formatDay(dayGroup.day) }}</span>
          <button class="delete-day-btn" @click="handleDeleteDay(dayGroup.day)">
            <el-icon><Delete /></el-icon>
          </button>
        </div>

        <!-- 会话列表 -->
        <div
          v-for="session in dayGroup.sessions"
          :key="session.sessionId"
          class="session-item"
          @click="$emit('select', session.sessionId)"
        >
          <div class="session-icon">💬</div>
          <div class="session-content">
            <div class="session-title">{{ session.title }}</div>
            <div class="session-time">{{ session.time || '' }}</div>
          </div>
          <button class="delete-btn" @click.stop="handleDeleteSession(session.sessionId)">
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Delete } from '@element-plus/icons-vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'delete', 'delete-day', 'back'])

// 格式化日期
const formatDay = (day) => {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (day === today) return '今天'
  if (day === yesterday) return '昨天'
  return day
}

// 删除单个会话
const handleDeleteSession = (sessionId) => {
  emit('delete', sessionId)
}

// 删除某天所有会话
const handleDeleteDay = (day) => {
  emit('delete-day', day)
}
</script>

<style scoped>
.history-list-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f5f5f7;
  border: none;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e8e8ea;
  color: #333;
}

.header-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state span,
.empty-state p {
  font-size: 14px;
  margin: 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state span {
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
}

.day-groups {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.day-group {
  margin-bottom: 16px;
}

.day-group:last-child {
  margin-bottom: 0;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}

.day-text {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 13px;
}

.delete-day-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-day-btn:hover {
  background: #fee;
  color: #f56c6c;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  margin-top: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.session-item:hover {
  background: #f0f2f5;
  transform: translateX(4px);
}

.session-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.session-content {
  flex: 1;
  min-width: 0;
}

.session-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #ccc;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  flex-shrink: 0;
}

.session-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #fee;
  color: #f56c6c;
}

@media (max-width: 768px) {
  .history-list-container {
    margin: 10px;
  }

  .day-groups {
    padding: 8px;
  }

  .session-item {
    padding: 10px;
  }

  .session-title {
    font-size: 13px;
  }

  .delete-btn {
    opacity: 1;
  }
}
</style>