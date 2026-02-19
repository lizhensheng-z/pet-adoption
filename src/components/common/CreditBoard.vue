<template>
  <div class="credit-board">
    <div class="credit-card glass-effect">
      <div class="credit-header">
        <div class="credit-icon">
          <el-icon :size="48" color="#FF8C42">
            <Trophy />
          </el-icon>
        </div>
        <div class="credit-info">
          <div class="credit-score">
            <span class="score">{{ creditData.score || 0 }}</span>
            <span class="level">{{ creditData.levelName || '新手领养人' }}</span>
          </div>
          <div class="credit-stats">
            <div class="stat-item">
              <span class="stat-label">总打卡</span>
              <span class="stat-value">{{ creditData.totalCheckins || 0 }}天</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">连续打卡</span>
              <span class="stat-value">{{ creditData.consecutiveCheckins || 0 }}天</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">排名</span>
              <span class="stat-value">{{ creditData.ranking || 'Top 100%' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="credit-progress">
        <div class="progress-info">
          <span>下一等级: {{ creditData.nextLevelName || '资深领养人' }}</span>
          <span>{{ creditData.score || 0 }}/{{ creditData.nextLevelThreshold || 1000 }}</span>
        </div>
        <el-progress 
          :percentage="progressPercentage" 
          :color="progressColor"
          :stroke-width="8"
          :show-text="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Trophy } from '@element-plus/icons-vue'

const props = defineProps({
  creditData: {
    type: Object,
    default: () => ({
      score: 0,
      levelName: '新手领养人',
      totalCheckins: 0,
      consecutiveCheckins: 0,
      ranking: 'Top 100%',
      nextLevelName: '资深领养人',
      nextLevelThreshold: 1000
    })
  }
})

const progressPercentage = computed(() => {
  const { score, nextLevelThreshold } = props.creditData
  if (!nextLevelThreshold || nextLevelThreshold <= 0) return 0
  return Math.min(Math.round((score / nextLevelThreshold) * 100), 100)
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 50) return '#E6A23C'
  return '#F56C6C'
})
</script>

<style scoped>
.credit-board {
  margin-bottom: var(--spacing-lg);
}

.credit-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.credit-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.credit-icon {
  flex-shrink: 0;
}

.credit-info {
  flex: 1;
}

.credit-score {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.score {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
}

.level {
  font-size: 16px;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.credit-stats {
  display: flex;
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color-primary);
}

.credit-progress {
  margin-top: var(--spacing-lg);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-size: 14px;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .credit-card {
    padding: var(--spacing-lg);
  }
  
  .credit-header {
    flex-direction: column;
    text-align: center;
  }
  
  .credit-stats {
    justify-content: center;
    gap: var(--spacing-lg);
  }
  
  .score {
    font-size: 28px;
  }
}
</style>