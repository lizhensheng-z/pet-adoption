<template>
  <el-card class="stat-card" :class="{ 'stat-card--clickable': clickable }" @click="handleClick">
    <div class="stat-card__content">
      <div class="stat-card__icon" :style="{ background: gradient }">
        <el-icon :size="24">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <div class="stat-card__info">
        <div class="stat-card__value">{{ displayValue }}</div>
        <div class="stat-card__title">{{ title }}</div>
      </div>
      <div v-if="trend" class="stat-card__trend" :class="`stat-card__trend--${trend.type}`">
        <el-icon>
          <component :is="trend.icon" />
        </el-icon>
        <span>{{ trend.value }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  Files,
  Document,
  Check,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus
} from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#409EFF'
  },
  clickable: {
    type: Boolean,
    default: false
  },
  trend: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click'])

// 图标组件映射
const iconComponentMap = {
  Files,
  Document,
  Check,
  Clock
}

// 图标组件
const iconComponent = computed(() => {
  return iconComponentMap[props.icon] || Files
})

// 渐变背景
const gradient = computed(() => {
  return `linear-gradient(135deg, ${props.color} 0%, ${lightenColor(props.color, 20)} 100%)`
})

// 显示值
const displayValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'
  }
  return props.value
})

// 趋势图标
const trendIcon = computed(() => {
  if (!props.trend) return null
  if (props.trend.type === 'up') return ArrowUp
  if (props.trend.type === 'down') return ArrowDown
  return Minus
})

// 颜色变浅
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1)
}

// 点击处理
const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.stat-card {
  cursor: default;
  transition: all var(--transition-fast);
}

.stat-card--clickable {
  cursor: pointer;
}

.stat-card--clickable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-base);
}

.stat-card__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
}

.stat-card__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-card__info {
  flex: 1;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: var(--spacing-xs);
}

.stat-card__title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.stat-card__trend--up {
  color: var(--success-color);
}

.stat-card__trend--down {
  color: var(--danger-color);
}

.stat-card__trend--flat {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .stat-card__icon {
    width: 48px;
    height: 48px;
  }

  .stat-card__value {
    font-size: 24px;
  }

  .stat-card__title {
    font-size: var(--font-size-xs);
  }
}
</style>