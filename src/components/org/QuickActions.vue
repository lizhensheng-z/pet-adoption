<template>
  <el-card class="quick-actions-card">
    <template #header>
      <div class="quick-actions-card__header">
        <div class="quick-actions-card__title">
          <el-icon><Operation /></el-icon>
          <span>快捷操作</span>
        </div>
      </div>
    </template>

    <div class="quick-actions-card__list">
      <div
        v-for="action in actions"
        :key="action.key"
        class="quick-action-item"
        @click="handleActionClick(action.key)"
      >
        <div class="quick-action-item__icon" :style="{ background: action.color }">
          <el-icon :size="24">
            <component :is="action.icon" />
          </el-icon>
        </div>
        <div class="quick-action-item__content">
          <div class="quick-action-item__title">{{ action.title }}</div>
          <div class="quick-action-item__desc">{{ action.desc }}</div>
        </div>
        <el-icon class="quick-action-item__arrow">
          <ArrowRight />
        </el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Operation,
  Management,
  Document,
  Phone,
  DataAnalysis,
  ArrowRight
} from '@element-plus/icons-vue'

const emit = defineEmits(['action'])

const router = useRouter()

// 快捷操作配置
const actions = [
  {
    key: 'pets',
    title: '宠物管理',
    desc: '管理宠物档案和发布',
    icon: Management,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    key: 'applications',
    title: '申请管理',
    desc: '处理领养申请',
    icon: Document,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    key: 'followup',
    title: '回访管理',
    desc: '管理回访记录',
    icon: Phone,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    key: 'statistics',
    title: '统计数据',
    desc: '查看数据分析',
    icon: DataAnalysis,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

// 点击快捷操作
const handleActionClick = (key) => {
  emit('action', key)
}
</script>

<style scoped>
.quick-actions-card {
  margin-bottom: var(--spacing-lg);
}

.quick-actions-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions-card__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.quick-actions-card__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--border-radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-action-item:hover {
  background: white;
  box-shadow: var(--shadow-base);
  transform: translateY(-2px);
}

.quick-action-item__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.quick-action-item__content {
  flex: 1;
  min-width: 0;
}

.quick-action-item__title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.quick-action-item__desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.quick-action-item__arrow {
  flex-shrink: 0;
  color: var(--text-placeholder);
  transition: transform var(--transition-fast);
}

.quick-action-item:hover .quick-action-item__arrow {
  transform: translateX(4px);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .quick-actions-card__list {
    grid-template-columns: 1fr;
  }

  .quick-action-item__icon {
    width: 40px;
    height: 40px;
  }

  .quick-action-item__icon .el-icon {
    font-size: 20px;
  }
}
</style>