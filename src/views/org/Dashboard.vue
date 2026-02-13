<template>
  <div class="org-dashboard">
    <PageHeader title="机构管理首页">
      <template #actions>
        <el-button type="primary" @click="router.push('/org/pets/create')">
          <el-icon><Plus /></el-icon>
          发布宠物
        </el-button>
      </template>
    </PageHeader>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="page-container">
        <el-row :gutter="24">
          <el-col :xs="12" :sm="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background: linear-gradient(45deg, #67C23A, #85CE61);">
                  <el-icon size="24"><Files /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.totalPets }}</div>
                  <div class="stat-label">在养宠物</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background: linear-gradient(45deg, #E6A23C, #EEBE77);">
                  <el-icon size="24"><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.pendingApplications }}</div>
                  <div class="stat-label">待处理申请</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background: linear-gradient(45deg, #409EFF, #66B1FF);">
                  <el-icon size="24"><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.monthlyAdoptions }}</div>
                  <div class="stat-label">本月领养</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background: linear-gradient(45deg, #F56C6C, #F78989);">
                  <el-icon size="24"><Clock /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.pendingFollowups }}</div>
                  <div class="stat-label">待回访</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 待办事项 -->
    <div class="todo-section">
      <div class="page-container">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>待办事项</h3>
              <el-button text @click="router.push('/org/applications')">
                查看全部
              </el-button>
            </div>
          </template>
          
          <div v-if="todos.length === 0" class="empty-todos">
            <el-empty description="暂无待办事项" />
          </div>
          
          <div v-else class="todo-list">
            <div 
              v-for="todo in todos" 
              :key="todo.id"
              class="todo-item"
            >
              <div class="todo-icon">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="todo-content">
                <div class="todo-title">{{ todo.title }}</div>
                <div class="todo-time">{{ formatTime(todo.createdAt) }}</div>
              </div>
              <el-button 
                type="primary" 
                size="small"
                @click="handleTodoClick(todo)"
              >
                处理
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <div class="page-container">
        <el-row :gutter="16">
          <el-col :xs="12" :sm="6">
            <div class="action-item" @click="router.push('/org/pets')">
              <el-icon size="32"><Management /></el-icon>
              <div>宠物管理</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <div class="action-item" @click="router.push('/org/applications')">
              <el-icon size="32"><Document /></el-icon>
              <div>申请管理</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <div class="action-item" @click="router.push('/org/followup')">
              <el-icon size="32"><Phone /></el-icon>
              <div>回访管理</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <div class="action-item" @click="router.push('/org/statistics')">
              <el-icon size="32"><DataAnalysis /></el-icon>
              <div>统计数据</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import PageHeader from '@/components/common/PageHeader.vue'
import { 
  Plus, Files, Document, Check, Clock, Warning, 
  Management, Phone, DataAnalysis 
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const stats = ref({
  totalPets: 0,
  pendingApplications: 0,
  monthlyAdoptions: 0,
  pendingFollowups: 0
})

const todos = ref([])

// 方法
const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

const handleTodoClick = (todo) => {
  // 根据待办类型跳转到相应页面
  switch (todo.type) {
    case 'application':
      router.push(`/org/applications/${todo.id}`)
      break
    case 'followup':
      router.push(`/org/followup`)
      break
    default:
      break
  }
}

const loadDashboardData = async () => {
  try {
    // TODO: 调用API获取数据
    // 模拟数据
    stats.value = {
      totalPets: 25,
      pendingApplications: 8,
      monthlyAdoptions: 12,
      pendingFollowups: 3
    }
    
    todos.value = [
      {
        id: 1,
        type: 'application',
        title: '张三的领养申请待审核',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: 'followup',
        title: '李四家的回访已超期',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 检查权限
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  if (!authStore.checkPermission('org:access')) {
    router.push('/403')
    return
  }
  
  loadDashboardData()
})
</script>

<style scoped>
.org-dashboard {
  min-height: 100vh;
  background: var(--bg-light);
}

.stats-section {
  padding: var(--spacing-lg) 0;
}

.stat-card {
  margin-bottom: var(--spacing-md);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.todo-section {
  padding: 0 0 var(--spacing-lg) 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.empty-todos {
  padding: var(--spacing-xl) 0;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-fast);
}

.todo-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-light);
}

.todo-icon {
  color: var(--warning-color);
  flex-shrink: 0;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.todo-time {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.quick-actions {
  padding: var(--spacing-lg) 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--border-radius-large);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-regular);
}

.action-item:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

@media (max-width: 768px) {
  .stats-section {
    padding: var(--spacing-md) 0;
  }
  
  .todo-section {
    padding: var(--spacing-md) 0;
  }
  
  .quick-actions {
    padding: var(--spacing-md) 0;
  }
  
  .stat-content {
    gap: var(--spacing-sm);
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
  }
  
  .stat-number {
    font-size: var(--font-size-lg);
  }
  
  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>