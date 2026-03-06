<template>
  <div class="history-list-container">
    <!-- 返回按钮 -->
    <div class="header">
      <el-button @click="$emit('back')" text>
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- 空状态 -->
    <div v-else-if="list.length === 0" class="empty-state">
      <el-icon :size="48"><Document /></el-icon>
      <p>暂无历史记录</p>
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
          <span class="day-text">{{ dayGroup.day }}</span>
          <el-button
            text
            size="small"
            @click="handleDeleteDay(dayGroup.day)"
            class="delete-day-btn"
          >
            <el-icon><Delete /></el-icon>
            删除当天
          </el-button>
        </div>

        <!-- 会话列表 -->
        <div
          v-for="session in dayGroup.sessions"
          :key="session.sessionId"
          class="session-item"
          @click="$emit('select', session.sessionId)"
        >
          <div class="session-title">{{ session.title }}</div>
          <el-button
            text
            size="small"
            @click.stop="handleDeleteSession(session.sessionId)"
            class="delete-btn"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Loading, Document, Delete } from '@element-plus/icons-vue'

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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
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

.loading-state span,
.empty-state p {
  margin-top: 12px;
  font-size: 14px;
}

.day-groups {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.day-group {
  margin-bottom: 24px;
}

.day-group:last-child {
  margin-bottom: 0;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.day-text {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.delete-day-btn {
  font-size: 12px;
  color: #999;
}

.delete-day-btn:hover {
  color: #f56c6c;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.session-item:hover {
  background: #f0f2f5;
  transform: translateX(4px);
}

.session-title {
  flex: 1;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.3s;
  color: #999;
}

.session-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #f56c6c;
}

@media (max-width: 768px) {
  .day-groups {
    padding: 10px;
  }

  .session-item {
    padding: 12px;
  }

  .session-title {
    font-size: 13px;
  }

  .delete-btn {
    opacity: 1;
  }
}
</style>