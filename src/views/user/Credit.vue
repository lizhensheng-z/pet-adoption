<template>
    <PageHeader title="信用中心" />
    
    <div class="credit-page">
      <div class="page-container">
        <!-- 信用分卡片 -->
        <el-card class="score-card">
          <div class="score-content">
            <div class="score-left">
              <div class="score-value">{{ creditInfo.currentScore || 0 }}</div>
              <div class="score-level">{{ creditInfo.levelName || '新注册' }}</div>
              <div class="score-desc">{{ creditInfo.levelDescription || '' }}</div>
            </div>
            <div class="score-right">
              <div class="progress-info">
                <div class="progress-label">距离下一等级</div>
                <el-progress 
                  :percentage="progressColor" 
                  :color="progressColor"
                  :stroke-width="8"
                />
                <div class="progress-text">
                  还差 {{ creditInfo.scoreToNextLevel || 0 }} 分
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 统计数据 -->
        <el-card class="stats-card">
          <template #header>
            <h3>统计数据</h3>
          </template>
          <el-row :gutter="24">
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ creditInfo.statistics?.totalApplications || 0 }}</div>
                <div class="stat-label">申请总数</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ creditInfo.statistics?.successfulAdoptions || 0 }}</div>
                <div class="stat-label">成功领养</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ Math.round((creditInfo.statistics?.successRate || 0) * 100) }}%</div>
                <div class="stat-label">领养成功率</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ creditInfo.statistics?.checkinCount || 0 }}</div>
                <div class="stat-label">打卡次数</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 徽章列表 -->
        <el-card class="badges-card">
          <template #header>
            <h3>我的徽章</h3>
          </template>
          <div v-if="creditInfo.badges?.length" class="badges-grid">
            <div 
              v-for="badge in creditInfo.badges" 
              :key="badge.id"
              class="badge-item"
            >
              <div class="badge-icon">
                <el-icon size="32"><Medal /></el-icon>
              </div>
              <div class="badge-name">{{ badge.name }}</div>
              <div class="badge-desc">{{ badge.description }}</div>
            </div>
          </div>
          <el-empty v-else description="暂无徽章，继续努力吧！" />
        </el-card>

        <!-- 最近活动 -->
        <el-card class="activities-card">
          <template #header>
            <div class="card-header">
              <h3>最近活动</h3>
              <el-button text @click="goToCreditLogs">查看全部</el-button>
            </div>
          </template>
          <div v-if="creditInfo.recentActivities?.length" class="activities-list">
            <div 
              v-for="activity in creditInfo.recentActivities" 
              :key="activity.logId"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.delta > 0 ? 'positive' : 'negative'">
                <el-icon>
                  <component :is="activity.delta > 0 ? Top : Bottom" />
                </el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.reasonDisplay || getReasonText(activity.reason) }}</div>
                <div class="activity-time">{{ formatTime(activity.createTime) }}</div>
              </div>
              <div class="activity-score" :class="activity.delta > 0 ? 'positive' : 'negative'">
                {{ activity.delta > 0 ? '+' : '' }}{{ activity.delta }}
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无活动记录" />
        </el-card>
      </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { creditAPI } from '@/api/modules/credit.js'
import PageHeader from '@/components/common/PageHeader.vue'
import { Medal, Top, Bottom } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const creditInfo = ref({
  currentScore: 0,
  level: '新注册',
  levelName: '新注册',
  levelDescription: '',
  scoreChange: 0,
  nextLevelScore: 0,
  scoreToNextLevel: 0,
  history: [],
  statistics: {
    totalApplications: 0,
    successfulAdoptions: 0,
    successRate: 0,
    checkinCount: 0,
    lastCheckinTime: null,
    violations: 0
  },
  badges: [],
  recentActivities: []
})

const progressPercentage = computed(() => {
  return creditInfo.value.scoreToNextLevel > 0 
    ? Math.round((creditInfo.value.currentScore / creditInfo.value.nextLevelScore) * 100) 
    : 0
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 50) return '#E6A23C'
  return '#409EFF'
})

const loadCreditInfo = async () => {
  try {
    loading.value = true
    const response = await creditAPI.getMyCredit()
    creditInfo.value = response.data
  } catch (error) {
    console.error('获取信用信息失败:', error)
  } finally {
    loading.value = false
  }
}

const getReasonText = (reason) => {
  const reasonMap = {
    'CHECKIN': '完成打卡',
    'APPROVED': '申请通过',
    'VIOLATION': '违规扣分'
  }
  return reasonMap[reason] || reason
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToCreditLogs = () => {
  router.push('/credit/logs')
}

onMounted(() => {
  loadCreditInfo()
})
</script>

<style scoped>
.credit-page {
  min-height: 100vh;
  background: var(--bg-light);
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.score-card {
  margin-bottom: var(--spacing-lg);
}

.score-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.score-left {
  text-align: center;
  flex-shrink: 0;
}

.score-value {
  font-size: 48px;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1;
}

.score-level {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: var(--spacing-sm);
}

.score-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.score-right {
  flex: 1;
}

.progress-info {
  padding: var(--spacing-lg);
  background: var(--bg-light);
  border-radius: var(--border-radius-large);
}

.progress-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
  text-align: right;
}

.stats-card {
  margin-bottom: var(--spacing-lg);
}

.stats-card h3 {
  margin: 0;
  color: var(--text-primary);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-lg);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
}

.badges-card {
  margin-bottom: var(--spacing-lg);
}

.badges-card h3 {
  margin: 0;
  color: var(--text-primary);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  background: var(--bg-light);
  border-radius: var(--border-radius-large);
  transition: all var(--transition-fast);
}

.badge-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

.badge-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: var(--spacing-md);
}

.badge-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.badge-desc {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.activities-card h3 {
  margin: 0;
  color: var(--text-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-fast);
}

.activity-item:hover {
  background: var(--bg-hover);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.positive {
  background: #f0f9ff;
  color: var(--success-color);
}

.activity-icon.negative {
  background: #fef2f2;
  color: var(--danger-color);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.activity-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.activity-score {
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.activity-score.positive {
  color: var(--success-color);
}

.activity-score.negative {
  color: var(--danger-color);
}

@media (max-width: 768px) {
  .page-container {
    padding: var(--spacing-md);
  }

  .score-content {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .score-value {
    font-size: 36px;
  }

  .badges-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .badge-item {
    padding: var(--spacing-lg);
  }

  .badge-icon {
    width: 48px;
    height: 48px;
  }
}
</style>