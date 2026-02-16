<template>
  <div class="tag-selector">
    <div
      v-for="(tags, type) in groupedTags"
      :key="type"
      class="tag-group"
    >
      <div class="group-title">{{ getTypeName(type) }}</div>
      <div class="tag-list">
        <el-tag
          v-for="tag in tags"
          :key="tag.id"
          :type="isSelected(tag.id) ? 'primary' : ''"
          :effect="isSelected(tag.id) ? 'dark' : 'plain'"
          size="large"
          class="tag-item"
          @click="toggle(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>

    <div v-if="tagList.length === 0" class="empty-state">
      <el-empty description="暂无可用标签" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tagList: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle'])

// 标签类型映射
const typeNames = {
  PERSONALITY: '性格特点',
  HEALTH: '健康状况',
  FEATURE: '特征标签'
}

// 按类型分组标签
const groupedTags = computed(() => {
  const groups = {
    PERSONALITY: [],
    HEALTH: [],
    FEATURE: []
  }

  props.tagList.forEach(tag => {
    if (groups[tag.tagType]) {
      groups[tag.tagType].push(tag)
    }
  })

  // 过滤掉空的分组
  const result = {}
  Object.keys(groups).forEach(type => {
    if (groups[type].length > 0) {
      result[type] = groups[type]
    }
  })

  return result
})

// 获取类型名称
const getTypeName = (type) => {
  return typeNames[type] || type
}

// 检查是否选中
const isSelected = (tagId) => {
  return props.selected.includes(tagId)
}

// 切换标签
const toggle = (tag) => {
  emit('toggle', tag)
}
</script>

<style scoped>
.tag-selector {
  width: 100%;
}

.tag-group {
  margin-bottom: var(--spacing-xl);
}

.group-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
  font-size: var(--font-size-md);
  padding: 8px 16px;
  user-select: none;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xxl);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .tag-item {
    font-size: var(--font-size-sm);
    padding: 6px 12px;
  }
}
</style>