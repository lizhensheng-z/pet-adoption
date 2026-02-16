<template>
  <div
    class="todo-item"
    :class="[`todo-item--${todo.priority}`, { 'todo-item--clickable': clickable }]"
    @click="handleClick"
  >
    <div class="todo-item__icon">
      <el-icon>
        <component :is="priorityIcon" />
      </el-icon>
    </div>

    <div class="todo-item__content">
      <div class="todo-item__header">
        <span class="todo-item__title">{{ todo.title }}</span>
        <el-tag
          v-if="todo.priority"
          :type="priorityTagType"
          size="small"
          class="todo-item__priority"
        >
          {{ priorityText }}
        </el-tag>
      </div>

      <div class="todo-item__meta">
        <span v-if="todo.type" class="todo-item__type">
          {{ typeText }}
        </span>
        <span v-if="todo.submitTime" class="todo-item__time">
          {{ formatTime(todo.submitTime) }}
        </span>
        <span v-if="todo.overdueDays !== undefined" class="todo-item__overdue">
          <el-icon><Warning /></el-icon>
          {{ todo.overdueDays > 0 ? `超期${todo.overdueDays}天` : '即将到期' }}
        </span>
      </div>

      <!-- 申请类型：显示申请人和宠物信息 -->
      <div v-if="todo.type === 'application'" class="todo-item__extra">
        <div class="todo-item__user">
          <el-avatar
            v-if="todo.userAvatar"
            :src="todo.userAvatar"
            :size="32"
          />
          <span class="todo-item__username">{{ todo.userName }}</span>
        </div>
        <div class="todo-item__pet">
          <el-image
            v-if="todo.petCoverUrl"
            :src="todo.petCoverUrl"
            :preview-src-list="[todo.petCoverUrl]"
            fit="cover"
            class="todo-item__pet-cover"
          />
          <span class="todo-item__petname">{{ todo.petName }}</span>
        </div>
      </div>

      <!-- 回访类型：显示领养人信息 -->
      <div v-if="todo.type === 'followup'" class="todo-item__extra">
        <div class="todo-item__user">
          <span class="todo-item__label">领养人：</span>
          <span class="todo-item__username">{{ todo.userName }}</span>
        </div>
        <div v-if="todo.userPhone" class="todo-item__phone">
          <el-icon><Phone /></el-icon>
          <span>{{ todo.userPhone }}</span>
        </div>
      </div>

      <!-- 审核类型：显示提交时间 -->
      <div v-if="todo.type === 'audit'" class="todo-item__extra">
        <div class="todo-item__submit-time">
          <span class="todo-item__label">提交时间：</span>
          <span>{{ formatTime(todo.submitTime) }}</span>
        </div>
      </div>
    </div>

    <div v-if="showAction" class="todo-item__action">
      <el-button
        type="primary"
        size="small"
        @click.stop="handleAction"
      >
        处理
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Warning,
  Clock,
  Document,
  Bell,
  Phone
} from '@element-plus/icons-vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  },
  clickable: {
    type: Boolean,
    default: true
  },
  showAction: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'action'])

const router = useRouter()

// 优先级图标
const priorityIcon = computed(() => {
  const iconMap = {
    urgent: Warning,
    high: Clock,
    medium: Document,
    low: Bell
  }
  return iconMap[props.todo.priority] || Document
})

// 优先级标签类型
const priorityTagType = computed(() => {
  const typeMap = {
    urgent: 'danger',
    high: 'warning',
    medium: 'success',
    low: 'info'
  }
  return typeMap[props.todo.priority] || 'info'
})

// 优先级文字
const priorityText = computed(() => {
  const textMap = {
    urgent: '紧急',
    high: '高',
    medium: '中',
    low: '低'
  }
  return textMap[props.todo.priority] || '普通'
})

// 待办类型文字
const typeText = computed(() => {
  const textMap = {
    application: '领养申请',
    followup: '回访提醒',
    audit: '审核中'
  }
  return textMap[props.todo.type] || '待办'
})

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

// 点击待办事项
const handleClick = () => {
  if (!props.clickable) return
  emit('click', props.todo)

  // 默认跳转逻辑
  switch (props.todo.type) {
    case 'application':
      router.push(`/org/applications/${props.todo.id}`)
      break
    case 'followup':
      router.push('/org/followup')
      break
    case 'audit':
      if (props.todo.petId) {
        router.push(`/org/pets/${props.todo.petId}`)
      }
      break
  }
}

// 点击处理按钮
const handleAction = () => {
  emit('action', props.todo)
  handleClick()
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-fast);
}

.todo-item--clickable {
  cursor: pointer;
}

.todo-item--clickable:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-light);
  transform: translateY(-2px);
}

.todo-item--urgent {
  border-left: 4px solid var(--danger-color);
}

.todo-item--high {
  border-left: 4px solid var(--warning-color);
}

.todo-item--medium {
  border-left: 4px solid var(--success-color);
}

.todo-item--low {
  border-left: 4px solid var(--info-color);
}

.todo-item__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  color: var(--text-secondary);
}

.todo-item--urgent .todo-item__icon {
  background: var(--danger-color-light);
  color: var(--danger-color);
}

.todo-item--high .todo-item__icon {
  background: var(--warning-color-light);
  color: var(--warning-color);
}

.todo-item__content {
  flex: 1;
  min-width: 0;
}

.todo-item__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.todo-item__title {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-item__priority {
  flex-shrink: 0;
}

.todo-item__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  flex-wrap: wrap;
}

.todo-item__type {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  font-weight: 500;
}

.todo-item__time {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.todo-item__overdue {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--danger-color);
  font-weight: 500;
}

.todo-item__extra {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px dashed var(--border-light);
}

.todo-item__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.todo-item__username {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

.todo-item__pet {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.todo-item__pet-cover {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-small);
}

.todo-item__petname {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

.todo-item__phone {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.todo-item__submit-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.todo-item__label {
  color: var(--text-secondary);
}

.todo-item__action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .todo-item {
    flex-direction: column;
    align-items: stretch;
  }

  .todo-item__icon {
    width: 100%;
    height: 36px;
  }

  .todo-item__content {
    width: 100%;
  }

  .todo-item__action {
    width: 100%;
    justify-content: flex-end;
  }

  .todo-item__action .el-button {
    width: 100%;
  }
}
</style>