<template>
  <div class="checkin-card">
    <div class="checkin-header">
      <div class="pet-info">
        <el-avatar 
          :src="checkin.petCoverUrl" 
          :size="40"
          class="pet-avatar"
        />
        <div class="pet-details">
          <div class="pet-name">{{ checkin.petName }}</div>
          <div class="org-name">{{ checkin.orgName }}</div>
        </div>
      </div>
      <div class="checkin-actions">
        <el-dropdown v-if="checkin.canEdit || checkin.canDelete" trigger="click">
          <el-button text circle>
            <el-icon><MoreFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="checkin.canEdit" @click="handleEdit">
                <el-icon><Edit /></el-icon>编辑
              </el-dropdown-item>
              <el-dropdown-item v-if="checkin.canDelete" @click="handleDelete" divided>
                <el-icon><Delete /></el-icon>删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="checkin-content">
      <p class="content-text">{{ checkin.content }}</p>
      
      <!-- 媒体展示 -->
      <div v-if="checkin.mediaUrls && checkin.mediaUrls.length > 0" class="media-grid">
        <div 
          v-for="(url, index) in checkin.mediaUrls.slice(0, 9)" 
          :key="index"
          class="media-item"
          :class="{ 'single': checkin.mediaUrls.length === 1 }"
          @click="previewMedia(url, index)"
        >
          <el-image 
            :src="url" 
            :preview-src-list="checkin.mediaUrls"
            :initial-index="index"
            fit="cover"
            class="media-image"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          
          <!-- 更多图片提示 -->
          <div v-if="index === 8 && checkin.mediaUrls.length > 9" class="more-overlay">
            <span>+{{ checkin.mediaUrls.length - 9 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="checkin-footer">
      <div class="checkin-stats">
        <span class="credit-badge" v-if="checkin.creditDelta > 0">
          <el-icon><StarFilled /></el-icon>
          +{{ checkin.creditDelta }}分
        </span>
        <span class="likes">
          <el-icon><StarFilled /></el-icon>
          {{ checkin.likes || 0 }}
        </span>
        <span class="comments">
          <el-icon><ChatDotRound /></el-icon>
          {{ checkin.comments || 0 }}
        </span>
      </div>
      <div class="checkin-time">
        {{ formatTime(checkin.createTime) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  MoreFilled, 
  Edit, 
  Delete, 
  Picture, 
  ChatDotRound,
  StarFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  checkin: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

// 计算媒体网格样式
const mediaGridClass = computed(() => {
  const count = props.checkin.mediaUrls?.length || 0
  if (count === 1) return 'single'
  if (count === 2) return 'double'
  if (count === 4) return 'four'
  return 'multiple'
})

// 处理编辑
const handleEdit = () => {
  emit('edit', props.checkin)
}

// 处理删除
const handleDelete = () => {
  emit('delete', props.checkin.id)
}

// 预览媒体
const previewMedia = (url, index) => {
  // Element Plus Image 组件会自动处理预览
}

// 格式化时间
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // 小于1小时显示分钟
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 小于24小时显示小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  
  // 显示具体日期
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.checkin-card {
  background: white;
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: var(--spacing-md);
  transition: all 0.3s ease;
}

.checkin-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.checkin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.pet-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.pet-avatar {
  border: 2px solid var(--primary-color);
}

.pet-details {
  display: flex;
  flex-direction: column;
}

.pet-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-color-primary);
}

.org-name {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.checkin-content {
  margin-bottom: var(--spacing-md);
}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
  white-space: pre-wrap;
}

.media-grid {
  display: grid;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.media-grid.single {
  grid-template-columns: 1fr;
}

.media-grid.double {
  grid-template-columns: 1fr 1fr;
}

.media-grid.four {
  grid-template-columns: 1fr 1fr;
}

.media-grid.multiple {
  grid-template-columns: repeat(3, 1fr);
}

.media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--border-radius-small);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.media-item:hover {
  transform: scale(1.02);
}

.media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  color: var(--text-color-secondary);
}

.more-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.checkin-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color-lighter);
}

.checkin-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.credit-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #FF8C42, #FFB380);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.likes, .comments {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--text-color-secondary);
}

.checkin-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .checkin-card {
    padding: var(--spacing-md);
  }
  
  .media-grid.multiple {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .checkin-stats {
    gap: var(--spacing-md);
  }
}
</style>