<template>
  <div class="admin-dashboard">
    <!-- 装饰背景 -->
    <div class="dashboard-bg"></div>

    <PageHeader title="系统管理概览">
      <template #actions>
        <el-button type="primary" plain @click="loadDashboardData" :loading="loading" round>
          <el-icon><Refresh /></el-icon> 刷新看板
        </el-button>
        <el-button type="primary" @click="goToUserHome" round>
          <el-icon><House /></el-icon> 返回门户
        </el-button>
      </template>
    </PageHeader>

    <div class="dashboard-content">
      <!-- 1. 核心指标卡片 (更加扁平现代) -->
      <section class="stat-container">
        <div class="glass-stat-card" v-for="item in statConfigs" :key="item.label">
          <div class="stat-icon" :style="{ background: item.color }">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-main">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
          <div class="stat-trend">
            <span class="up">+{{ item.trend }}%</span>
            <span class="trend-label">较上周</span>
          </div>
        </div>
      </section>

      <!-- 2. 图表分析区 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :xs="24" :lg="16">
          <el-card class="modern-card">
            <template #header>
              <div class="card-title">
                <el-icon><TrendCharts /></el-icon> 平台活跃度趋势
              </div>
            </template>
            <div class="chart-box">
              <v-chart class="chart" :option="growthChartOption" autoresize />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :lg="8">
          <el-card class="modern-card">
            <template #header>
              <div class="card-title">
                <el-icon><PieChart /></el-icon> 领养分配占比
              </div>
            </template>
            <div class="chart-box">
              <v-chart class="chart" :option="distributionChartOption" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 3. 下方混合区：待办机构 + 快捷入口 -->
      <el-row :gutter="20" class="bottom-row">
        <!-- 待审核机构列表 -->
        <el-col :xs="24" :md="14">
          <el-card class="modern-card">
            <template #header>
              <div class="card-header-flex">
                <div class="card-title"><el-icon><Bell /></el-icon> 待审核机构</div>
                <el-tag type="danger" effect="dark" round v-if="pendingOrgs.length">
                  {{ pendingOrgs.length }} 项待办
                </el-tag>
              </div>
            </template>
            
            <div v-if="pendingOrgs.length === 0" class="empty-state">
              <el-empty description="暂无新的机构申请" :image-size="100" />
            </div>
            <div v-else class="org-audit-list">
              <div v-for="org in pendingOrgs" :key="org.id" class="org-audit-item">
                <div class="org-info-box">
                  <div class="org-logo">
                    <el-icon><OfficeBuilding /></el-icon>
                  </div>
                  <div class="org-text">
                    <h4>{{ org.name }}</h4>
                    <p>申请人：{{ org.contact }} · {{ formatTime(org.createdAt) }}</p>
                  </div>
                </div>
                <div class="org-btns">
                  <el-button type="success" size="small" @click="handleAuditOrg(org.id, 'approve')" round>通过</el-button>
                  <el-button type="danger" size="small" plain @click="handleAuditOrg(org.id, 'reject')" round>拒绝</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 快捷操作格栅 -->
        <el-col :xs="24" :md="10">
          <div class="quick-nav-grid">
            <div v-for="nav in quickNavs" :key="nav.path" class="nav-card" @click="router.push(nav.path)">
              <div class="nav-icon-wrap" :style="{ color: nav.color }">
                <el-icon size="28"><component :is="nav.icon" /></el-icon>
              </div>
              <span class="nav-name">{{ nav.name }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { 
  User, OfficeBuilding, Files, Select, Bell, Collection, 
  Setting, House, Refresh, TrendCharts, PieChart, Document 
} from '@element-plus/icons-vue'

// ECharts 引入 (假设你已安装 vue-echarts)
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart as EPieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, EPieChart, GridComponent, TooltipComponent, LegendComponent])

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

// 统计数据
const stats = ref({
  totalUsers: 1250,
  totalOrgs: 45,
  totalPets: 680,
  totalAdoptions: 320
})

const statConfigs = computed(() => [
  { label: '总用户数', value: stats.value.totalUsers, icon: 'User', color: '#409EFF', trend: 12 },
  { label: '机构数量', value: stats.value.totalOrgs, icon: 'OfficeBuilding', color: '#67C23A', trend: 5 },
  { label: '宠物总数', value: stats.value.totalPets, icon: 'Files', color: '#E6A23C', trend: 8 },
  { label: '成功领养', value: stats.value.totalAdoptions, icon: 'Select', color: '#F56C6C', trend: 15 }
])

const quickNavs = [
  { name: '用户管理', icon: 'User', path: '/admin/users', color: '#409EFF' },
  { name: '公告管理', icon: 'Bell', path: '/admin/notices', color: '#E6A23C' },
  { name: '标签字典', icon: 'Collection', path: '/admin/tags', color: '#67C23A' },
  { name: '系统配置', icon: 'Setting', path: '/admin/config', color: '#909399' },
  { name: '审计日志', icon: 'Document', path: '/admin/audit-logs', color: '#F56C6C' }
]

const pendingOrgs = ref([
  { id: 1, name: '萌宠避难所', contact: '张馆长', createdAt: new Date() }
])

// 图表配置
const growthChartOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{
    name: '活跃量', type: 'line', smooth: true,
    data: [150, 230, 224, 218, 135, 147, 260],
    itemStyle: { color: '#409EFF' },
    areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
  }]
})

const distributionChartOption = ref({
  tooltip: { trigger: 'item' },
  legend: { bottom: '0', icon: 'circle' },
  series: [{
    type: 'pie', radius: ['40%', '70%'],
    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    data: [
      { value: 1048, name: '已完成' },
      { value: 735, name: '进行中' },
      { value: 580, name: '已退回' }
    ]
  }]
})

// 方法
const formatTime = (t) => new Date(t).toLocaleDateString()
const goToUserHome = () => router.push('/home')

const handleAuditOrg = (id, action) => {
  pendingOrgs.value = pendingOrgs.value.filter(o => o.id !== id)
}

const loadDashboardData = async () => {
  loading.value = true
  // 模拟 API 请求
  setTimeout(() => { loading.value = false }, 800)
}

onMounted(() => {
  if (!authStore.isLoggedIn) router.push('/login')
  loadDashboardData()
})
</script>

<style lang="scss" scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f6f8fb;
  position: relative;
  overflow: hidden;
}

.dashboard-bg {
  position: absolute;
  top: 0; left: 0; right: 0; height: 300px;
  background: linear-gradient(180deg, #ecf5ff 0%, #f6f8fb 100%);
  z-index: 0;
}

.dashboard-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 统计卡片区 */
.stat-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.glass-stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  transition: transform 0.3s ease;
  &:hover { transform: translateY(-5px); }

  .stat-icon {
    width: 54px; height: 54px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 24px;
    margin-right: 18px;
  }

  .stat-main {
    flex: 1;
    .stat-value { font-size: 28px; font-weight: 800; color: #303133; line-height: 1.2; }
    .stat-label { font-size: 13px; color: #909399; }
  }

  .stat-trend {
    display: flex; flex-direction: column; align-items: flex-end;
    .up { color: #67C23A; font-weight: bold; font-size: 14px; }
    .trend-label { font-size: 11px; color: #ccc; }
  }
}

/* 通用卡片样式 */
.modern-card {
  border-radius: 20px;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02) !important;
  margin-bottom: 20px;

  .card-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 16px; font-weight: 700; color: #303133;
  }
}

.chart-box {
  height: 320px;
  .chart { width: 100%; height: 100%; }
}

/* 机构审核列表 */
.org-audit-list {
  display: flex; flex-direction: column; gap: 15px;
}

.org-audit-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 15px; background: #fafafa; border-radius: 16px;
  
  .org-info-box {
    display: flex; align-items: center; gap: 15px;
    .org-logo {
      width: 45px; height: 45px; background: white;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      color: #909399; font-size: 20px;
    }
    .org-text {
      h4 { margin: 0; font-size: 15px; color: #333; }
      p { margin: 2px 0 0; font-size: 12px; color: #999; }
    }
  }
}

/* 快捷导航网格 */
.quick-nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.nav-card {
  background: white; border-radius: 20px; padding: 25px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  cursor: pointer; transition: 0.3s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);

  &:hover { background: #409EFF; color: white !important;
    .nav-icon-wrap { color: white !important; transform: scale(1.1); }
    .nav-name { color: white; }
  }

  .nav-icon-wrap { transition: 0.3s; }
  .nav-name { font-size: 14px; font-weight: 600; color: #606266; }
}

.card-header-flex {
  display: flex; justify-content: space-between; align-items: center;
}

@media (max-width: 768px) {
  .quick-nav-grid { grid-template-columns: 1fr 1fr; }
  .stat-container { grid-template-columns: 1fr 1fr; }
}
</style>
