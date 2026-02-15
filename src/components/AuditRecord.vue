<template>
  <div class="audit-record">
    <div class="record-timeline">
      <div
        v-for="(record, index) in records"
        :key="record.id"
        class="timeline-item"
        :class="{ 'is-last': index === records.length - 1 }"
      >
        <div class="timeline-marker">
          <div class="marker-dot" :class="getMarkerClass(record.action)"></div>
          <div class="marker-line" v-if="index < records.length - 1"></div>
        </div>
        <div class="timeline-content">
          <div class="content-header">
            <span class="action-label">{{ getActionLabel(record.action) }}</span>
            <span class="action-time">{{ formatTime(record.createdAt) }}</span>
          </div>
          <div class="content-body">
            <div class="action-note" v-if="record.note">
              {{ record.note }}
            </div>
            <div class="action-operator">
              操作人：{{ record.operatorName || '系统' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

const getActionLabel = (action) => {
  const actionMap = {
    'SUBMITTED': '提交申请',
    'UNDER_REVIEW': '开始审核',
    'INTERVIEW': '约见面谈',
    'HOME_VISIT': '安排家访',
    'APPROVED': '通过申请',
    'REJECTED': '拒绝申请',
    'CANCELLED': '取消申请'
  }
  return actionMap[action] || action
}

const getMarkerClass = (action) => {
  const classMap = {
    'SUBMITTED': 'marker-submitted',
    'UNDER_REVIEW': 'marker-review',
    'INTERVIEW': 'marker-interview',
    'HOME_VISIT': 'marker-visit',
    'APPROVED': 'marker-approved',
    'REJECTED': 'marker-rejected',
    'CANCELLED': 'marker-cancelled'
  }
  return classMap[action] || 'marker-default'
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.audit-record {
  .record-timeline {
    position: relative;
  }

  .timeline-item {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    position: relative;

    &.is-last {
      margin-bottom: 0;
    }
  }

  .timeline-marker {
    position: relative;
    flex-shrink: 0;

    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: relative;
      z-index: 1;

      &.marker-submitted {
        background: var(--el-color-info);
      }

      &.marker-review {
        background: var(--el-color-warning);
      }

      &.marker-interview,
      &.marker-visit {
        background: var(--el-color-warning);
      }

      &.marker-approved {
        background: var(--el-color-success);
      }

      &.marker-rejected,
      &.marker-cancelled {
        background: var(--el-color-danger);
      }

      &.marker-default {
        background: var(--el-color-info);
      }
    }

    .marker-line {
      position: absolute;
      top: 12px;
      left: 6px;
      width: 2px;
      height: 24px;
      background: var(--el-border-color-lighter);
      transform: translateX(-50%);
    }
  }

  .timeline-content {
    flex: 1;
    min-width: 0;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .action-label {
      font-weight: bold;
      color: var(--el-text-color-primary);
    }

    .action-time {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .content-body {
    .action-note {
      color: var(--el-text-color-regular);
      margin-bottom: 4px;
      line-height: 1.5;
    }

    .action-operator {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>