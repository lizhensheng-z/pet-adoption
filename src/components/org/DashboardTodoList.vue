<template>
  <el-card class="todo-list-card">
    <template #header>
      <div class="todo-list-card__header">
        <div class="todo-list-card__title">
          <el-icon><Bell /></el-icon>
          <span>待办事项</span>
          <el-badge
            v-if="totalCount > 0"
            :value="totalCount"
            class="todo-list-card__badge"
          />
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
    <div v-if="loading" class="todo-list-card__loading">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredTodos.length === 0" class="todo-list-card__empty">
      <el-empty
        :description="emptyText"
        :image-size="120"
      >
        <el-button
          v-if="activeFilter !== 'all'"
          type="primary"
          text
          @click="handleFilterChange('all')"
        >
          查看全部待办
        </el-button>
      </el-empty>
    </div>

    <!-- 待办列表 -->
    <div v-else class="todo-list-card__list">
      <DashboardTodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @click="handleTodoClick"
        @action="handleTodoAction"
      />
    </div>

    <!-- 更多按钮 -->
    <div
      v-if="hasMore"
      class="todo-list-card__more"
    >
      <el-button
        text
        type="primary"
        :loading="loadingMore"
        @click="handleLoadMore"
      >
        加载更多
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Bell } from '@element-plus/icons-vue'
import { orgAPI } from '@/api/modules/org.js'
import { ElMessage } from 'element-plus'
import DashboardTodoItem from './DashboardTodoItem.vue'

const props = defineProps({
  todos: {
    type: Array,
    default: () => []
  },
  totalCount: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

const router = useRouter()

// 当前过滤器
const activeFilter = ref('all')

// 加载更多状态
const loadingMore = ref(false)
const hasMore = ref(false)

// 过滤后的待办列表
const filteredTodos = computed(() => {
  if (activeFilter.value === 'all') {
    return props.todos
  }
  return props.todos.filter(todo => todo.type === activeFilter.value)
})

// 空状态文字
const emptyText = computed(() => {
  const textMap = {
    all: '暂无待办事项',
    application: '暂无待处理的申请',
    followup: '暂无待回访的宠物',
    audit: '暂无待审核的宠物'
  }
  return textMap[activeFilter.value]
})

// 切换过滤器
const handleFilterChange = (filter) => {
  activeFilter.value = filter
}

// 查看全部
const handleViewAll = () => {
  router.push('/org/adoptions')
}

// 点击待办事项
const handleTodoClick = (todo) => {
  console.log('点击待办:', todo)
}

// 点击处理按钮
const handleTodoAction = (todo) => {
  console.log('处理待办:', todo)
}

// 加载更多
const handleLoadMore = async () => {
  try {
    loadingMore.value = true
    // TODO: 调用API加载更多待办事项
    // const response = await orgAPI.getDashboardTodos({
    //   type: activeFilter.value === 'all' ? undefined : activeFilter.value,
    //   offset: props.todos.length
    // })
    // hasMore.value = response.todos.length >= 10
    ElMessage.info('加载更多功能待实现')
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 监听待办列表变化，更新是否还有更多
watch(() => props.totalCount, (newCount) => {
  hasMore.value = newCount > props.todos.length
}, { immediate: true })
</script>

<style scoped>
.todo-list-card {
  margin-bottom: var(--spacing-lg);
}

.todo-list-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.todo-list-card__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.todo-list-card__badge {
  :deep(.el-badge__content) {
    background: var(--primary-color);
  }
}

.todo-list-card__loading {
  padding: var(--spacing-lg) 0;
}

.todo-list-card__empty {
  padding: var(--spacing-xl) 0;
}

.todo-list-card__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.todo-list-card__more {
  display: flex;
  justify-content: center;
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--border-light);
  margin-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .todo-list-card__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>