<template>
  <div class="org-dashboard">
    <PageHeader title="机构首页">
      <template #actions>
        <el-button @click="goToHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button type="primary" @click="handleCreatePet">
          <el-icon><Plus /></el-icon>
          发布宠物
        </el-button>
      </template>
    </PageHeader>

    <!-- 机构状态提示 -->
    <OrgStatusAlert :only-org="true" />

    <div class="dashboard-content">
      <!-- 统计卡片 -->
      <div class="stats-section">
        <el-row :gutter="16">
          <el-col :xs="12" :sm="6">
            <StatCard
              title="在养宠物"
              :value="stats.totalPets"
              icon="Files"
              color="#67C23A"
              @click="router.push('/org/pet')"
            />
          </el-col>

          <el-col :xs="12" :sm="6">
            <StatCard
              title="待处理申请"
              :value="stats.pendingApplications"
              icon="Document"
              color="#E6A23C"
              @click="router.push('/org/adoptions')"
            />
          </el-col>

          <el-col :xs="12" :sm="6">
            <StatCard
              title="本月领养"
              :value="stats.monthlyAdoptions"
              icon="Check"
              color="#409EFF"
              @click="router.push('/org/adoptions')"
            />
          </el-col>

          <el-col :xs="12" :sm="6">
            <StatCard
              title="待回访"
              :value="stats.pendingFollowups"
              icon="Clock"
              color="#F56C6C"
              @click="router.push('/org/followup')"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions-section">
        <QuickActions @action="handleQuickAction" />
      </div>

      <!-- 待办事项 -->
      <div class="todos-section">
        <DashboardTodoList
          :todos="todos"
          :total-count="todosTotalCount"
          :loading="loading"
          @refresh="loadDashboardData"
        />
      </div>

      <!-- 最近宠物 -->
      <div class="recent-pets-section">
        <DashboardRecentPets
          :pets="recentPets"
          :loading="loading"
          @refresh="loadDashboardData"
        />
      </div>

      <!-- 最近申请 -->
      <div class="recent-applications-section">
        <DashboardRecentApplications
          :applications="recentApplications"
          :loading="loading"
          @refresh="loadDashboardData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { orgAPI } from '@/api/modules/org.js'
import { ElMessage } from 'element-plus'
import { Plus, House } from '@element-plus/icons-vue'

// 组件导入
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/org/StatCard.vue'
import QuickActions from '@/components/org/QuickActions.vue'
import DashboardTodoList from '@/components/org/DashboardTodoList.vue'
import DashboardRecentPets from '@/components/org/DashboardRecentPets.vue'
import DashboardRecentApplications from '@/components/org/DashboardRecentApplications.vue'
import OrgStatusAlert from '@/components/common/OrgStatusAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const error = ref(null)

// 统计数据
const stats = ref({
  totalPets: 0,
  pendingApplications: 0,
  monthlyAdoptions: 0,
  pendingFollowups: 0,
  totalAdoptions: 0,
  publishedPets: 0,
  draftPets: 0,
  underReviewPets: 0
})

// 待办事项
const todos = ref([])
const todosTotalCount = ref(0)

// 最近宠物
const recentPets = ref([])

// 最近申请
const recentApplications = ref([])

// 机构信息
const orgInfo = ref(null)

// 定时刷新定时器
let refreshTimer = null

// 加载首页数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('开始加载首页数据...')

    // 使用综合接口获取所有数据
    const response = await orgAPI.getDashboardHome()

console.log('综合接口响应:', response)

    // 更新统计数据
    stats.value = response.data?.statistics || {}

    // 更新待办事项
    todos.value = response.data?.todos || []
    todosTotalCount.value = response.data?.todos?.length || 0

    // 更新最近宠物
    recentPets.value = response.data?.recentPets || []

    // 更新最近申请
    recentApplications.value = response.data?.recentApplications || []

    // 更新机构信息
    orgInfo.value = response.data?.orgInfo || null

    console.log('首页数据加载成功', response)
  } catch (err) {
    console.error('加载首页数据失败:', err)
    console.error('错误详情:', err.message)
    error.value = err.message

    // 如果综合接口失败，尝试单独接口
    console.log('尝试降级加载...')
    await loadFallbackData()
  } finally {
    loading.value = false
  }
}

// 降级方案：单独加载各项数据
const loadFallbackData = async () => {
  try {
    // 加载统计数据
    try {
      const statsResponse = await orgAPI.getDashboardStatistics()
      stats.value = statsResponse || {}
    } catch (err) {
      console.warn('统计数据加载失败，使用模拟数据:', err)
      stats.value = getMockStats()
    }

    // 加载待办事项
    try {
      const todosResponse = await orgAPI.getDashboardTodos({ limit: 10 })
      todos.value = todosResponse.todos || []
      todosTotalCount.value = todosResponse.totalCount || 0
    } catch (err) {
      console.warn('待办事项加载失败，使用模拟数据:', err)
      const mockTodos = getMockTodos()
      todos.value = mockTodos
      todosTotalCount.value = mockTodos.length
    }

    // 加载最近宠物
    try {
      const petsResponse = await orgAPI.getRecentPets({ limit: 4 })
      recentPets.value = petsResponse.list || []
    } catch (err) {
      console.warn('最近宠物加载失败，使用模拟数据:', err)
      recentPets.value = getMockPets()
    }

    // 加载最近申请
    try {
      const appsResponse = await orgAPI.getRecentApplications({ limit: 5 })
      recentApplications.value = appsResponse.list || []
    } catch (err) {
      console.warn('最近申请加载失败，使用模拟数据:', err)
      recentApplications.value = getMockApplications()
    }

    console.log('降级加载完成')
  } catch (err) {
    console.error('降级加载失败:', err)
    ElMessage.warning('部分数据加载失败，显示模拟数据用于演示')
  }
}

// 模拟统计数据
const getMockStats = () => ({
  totalPets: 25,
  pendingApplications: 8,
  monthlyAdoptions: 12,
  pendingFollowups: 3,
  totalAdoptions: 156,
  publishedPets: 18,
  draftPets: 7,
  underReviewPets: 2
})

// 模拟待办事项
const getMockTodos = () => [
  {
    id: 1,
    type: 'application',
    title: '张三申请领养"小白"',
    petName: '小白',
    petId: 789,
    petCoverUrl: 'https://via.placeholder.com/100',
    userName: '张三',
    userId: 456,
    userAvatar: 'https://via.placeholder.com/50',
    status: 'SUBMITTED',
    submitTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: 'high'
  },
  {
    id: 2,
    type: 'followup',
    title: '"小花"回访已超期7天',
    petName: '小花',
    petId: 791,
    petCoverUrl: 'https://via.placeholder.com/100',
    adoptionTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    overdueDays: 7,
    lastFollowupTime: null,
    priority: 'urgent'
  },
  {
    id: 3,
    type: 'audit',
    title: '"旺财"待管理员审核',
    petName: '旺财',
    petId: 792,
    petCoverUrl: 'https://via.placeholder.com/100',
    submitTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING_AUDIT',
    priority: 'medium'
  }
]

// 模拟最近宠物
const getMockPets = () => [
  {
    id: 789,
    name: '小白',
    species: 'CAT',
    breed: '中华田园猫',
    ageMonth: 24,
    gender: 'FEMALE',
    coverUrl: 'https://via.placeholder.com/200',
    status: 'PUBLISHED',
    publishedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 156,
    favoriteCount: 23,
    applicationCount: 5
  },
  {
    id: 790,
    name: '小黑',
    species: 'DOG',
    breed: '拉布拉多',
    ageMonth: 36,
    gender: 'MALE',
    coverUrl: 'https://via.placeholder.com/200',
    status: 'PUBLISHED',
    publishedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 289,
    favoriteCount: 45,
    applicationCount: 12
  },
  {
    id: 791,
    name: '小花',
    species: 'CAT',
    breed: '英短',
    ageMonth: 18,
    gender: 'FEMALE',
    coverUrl: 'https://via.placeholder.com/200',
    status: 'PUBLISHED',
    publishedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 98,
    favoriteCount: 15,
    applicationCount: 3
  },
  {
    id: 792,
    name: '旺财',
    species: 'DOG',
    breed: '金毛',
    ageMonth: 48,
    gender: 'MALE',
    coverUrl: 'https://via.placeholder.com/200',
    status: 'PUBLISHED',
    publishedTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 312,
    favoriteCount: 56,
    applicationCount: 18
  }
]

// 模拟最近申请
const getMockApplications = () => [
  {
    id: 1001,
    petId: 789,
    petName: '小白',
    petCoverUrl: 'https://via.placeholder.com/100',
    userId: 456,
    userName: '张三',
    userAvatar: 'https://via.placeholder.com/50',
    status: 'SUBMITTED',
    statusDesc: '已提交',
    submitTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1002,
    petId: 790,
    petName: '小黑',
    petCoverUrl: 'https://via.placeholder.com/100',
    userId: 457,
    userName: '李四',
    userAvatar: 'https://via.placeholder.com/50',
    status: 'UNDER_REVIEW',
    statusDesc: '审核中',
    submitTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 1003,
    petId: 791,
    petName: '小花',
    petCoverUrl: 'https://via.placeholder.com/100',
    userId: 458,
    userName: '王五',
    userAvatar: 'https://via.placeholder.com/50',
    status: 'SUBMITTED',
    statusDesc: '已提交',
    submitTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]

// 创建宠物
const handleCreatePet = () => {
  router.push('/org/pet/create')
}

// 返回普通用户首页
const goToHome = () => {
  router.push('/home')
}

// 快捷操作处理
const handleQuickAction = (action) => {
  switch (action) {
    case 'pets':
      router.push('/org/pet')
      break
    case 'applications':
      router.push('/org/adoptions')
      break
    case 'followup':
      router.push('/org/followup')
      break
    case 'statistics':
      router.push('/org/statistics')
      break
  }
}

// 手动刷新
const handleRefresh = () => {
  loadDashboardData()
}

// 初始化定时刷新
const startAutoRefresh = () => {
  // 每5分钟自动刷新一次
  refreshTimer = setInterval(() => {
    console.log('自动刷新首页数据')
    loadDashboardData()
  }, 5 * 60 * 1000)
}

// 清除定时刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 生命周期
onMounted(async () => {
  console.log('=== Dashboard 组件挂载 ===')
  console.log('登录状态:', authStore.isLoggedIn)
  console.log('当前用户:', authStore.user)
  console.log('当前角色:', authStore.userRole)
  console.log('权限列表:', authStore.permissions)
  console.log('检查权限 org:access:', authStore.checkPermission('org:access'))

  // 检查权限
  if (!authStore.isLoggedIn) {
    console.log('未登录，跳转到登录页')
    router.push('/login')
    return
  }

  if (!authStore.checkPermission('org:access')) {
    console.log('无 org:access 权限，跳转到403页')
    router.push('/403')
    return
  }

  console.log('权限检查通过，开始加载首页数据...')

  // 加载首页数据
  await loadDashboardData()

  // 启动定时刷新
  startAutoRefresh()
})

onUnmounted(() => {
  // 清除定时刷新
  stopAutoRefresh()
})
</script>

<style scoped>
.org-dashboard {
  min-height: 100vh;
  background: var(--bg-light);
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.stats-section {
  margin-bottom: var(--spacing-lg);
}

.quick-actions-section {
  margin-bottom: var(--spacing-lg);
}

.todos-section {
  margin-bottom: var(--spacing-lg);
}

.recent-pets-section {
  margin-bottom: var(--spacing-lg);
}

.recent-applications-section {
  margin-bottom: var(--spacing-lg);
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: var(--spacing-md);
  }

  .stats-section,
  .quick-actions-section,
  .todos-section,
  .recent-pets-section,
  .recent-applications-section {
    margin-bottom: var(--spacing-md);
  }
}
</style>