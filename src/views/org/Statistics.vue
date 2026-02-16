<template>
  <div class="org-statistics">
    <PageHeader title="机构运营看板" :custom-breadcrumb="[
      { path: '/', title: '首页' },
      { path: '/org', title: '机构首页' },
      { path: null, title: '机构运营看板' }
    ]">
      <template #actions>
        <el-button type="primary" @click="handleRefresh" :loading="loading" round>
          <el-icon><Refresh /></el-icon>
          同步最新数据
        </el-button>
      </template>
    </PageHeader>

    <div class="dashboard-content">
      <!-- 核心指标 - 顶部数字卡片 -->
      <section class="stats-grid">
        <div class="modern-stat-card primary">
          <div class="card-icon"><el-icon><Management /></el-icon></div>
          <div class="card-info">
            <span class="label">在册宠物</span>
            <span class="value">{{ statistics.totalPets || 0 }}</span>
          </div>
        </div>
        <div class="modern-stat-card warning">
          <div class="card-icon"><el-icon><Document /></el-icon></div>
          <div class="card-info">
            <span class="label">待审申请</span>
            <span class="value">{{ statistics.pendingApplications || 0 }}</span>
          </div>
        </div>
        <div class="modern-stat-card success">
          <div class="card-icon"><el-icon><Check /></el-icon></div>
          <div class="card-info">
            <span class="label">本月领养</span>
            <span class="value">{{ statistics.monthlyAdoptions || 0 }}</span>
          </div>
        </div>
        <div class="modern-stat-card danger">
          <div class="card-icon"><el-icon><Clock /></el-icon></div>
          <div class="card-info">
            <span class="label">待办回访</span>
            <span class="value">{{ statistics.pendingFollowups || 0 }}</span>
          </div>
        </div>
      </section>

      <!-- 图表区域 -->
      <el-row :gutter="20" class="charts-row">
        <!-- 领养趋势直方图 -->
        <el-col :xs="24" :lg="16">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span><el-icon><TrendCharts /></el-icon> 近半年领养趋势</span>
              </div>
            </template>
            <div class="chart-container">
              <v-chart class="chart" :option="adoptionTrendOption" autoresize />
            </div>
          </el-card>
        </el-col>

        <!-- 宠物状态分布饼图 -->
        <el-col :xs="24" :lg="8">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span><el-icon><PieChart /></el-icon> 宠物状态构成</span>
              </div>
            </template>
            <div class="chart-container">
              <v-chart class="chart" :option="statusPieOption" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="charts-row">
        <!-- 物种分布 -->
        <el-col :xs="24" :sm="12" :lg="8">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span><el-icon><Collection /></el-icon> 物种分布</span>
              </div>
            </template>
            <div class="chart-container small">
              <v-chart class="chart" :option="speciesPieOption" autoresize />
            </div>
          </el-card>
        </el-col>

        <!-- 快捷操作区 -->
        <el-col :xs="24" :sm="12" :lg="16">
          <el-card class="chart-card actions-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span><el-icon><Operation /></el-icon> 快速工作台</span>
              </div>
            </template>
            <div class="quick-nav">
              <div class="nav-item" @click="router.push('/org/pet')">
                <div class="nav-icon p-color"><el-icon><Management /></el-icon></div>
                <span>宠物管理</span>
              </div>
              <div class="nav-item" @click="router.push('/org/adoptions')">
                <div class="nav-icon w-color"><el-icon><Document /></el-icon></div>
                <span>申请审核</span>
              </div>
              <div class="nav-item" @click="router.push('/org/followup')">
                <div class="nav-icon s-color"><el-icon><Phone /></el-icon></div>
                <span>跟进回访</span>
              </div>
              <!-- <div class="nav-item" @click="handleExportData">
                <div class="nav-icon i-color"><el-icon><Download /></el-icon></div>
                <span>数据导出</span>
              </div> -->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Refresh, Management, Document, Check, Clock, 
  TrendCharts, PieChart, Collection, Operation, Phone, Download 
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'

// ECharts 引入
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart as EPieChart, BarChart as EBarChart } from 'echarts/charts'
import { 
  TitleComponent, TooltipComponent, LegendComponent, 
  GridComponent, DatasetComponent 
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer, EPieChart, EBarChart, 
  TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent
])

const router = useRouter()
const loading = ref(false)

// 基础统计数据
const statistics = ref({
  totalPets: 0,
  pendingApplications: 0,
  monthlyAdoptions: 0,
  pendingFollowups: 0,
  publishedPets: 0,
  draftPets: 0,
  underReviewPets: 0,
  catCount: 45, // 模拟数据
  dogCount: 32, // 模拟数据
  otherCount: 12 // 模拟数据
})

// --- 图表配置项 ---

// 1. 宠物状态饼图
const statusPieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: '0', left: 'center' },
  color: ['#67C23A', '#909399', '#E6A23C'],
  series: [
    {
      name: '宠物状态',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: statistics.value.publishedPets, name: '已发布' },
        { value: statistics.value.draftPets, name: '草稿' },
        { value: statistics.value.underReviewPets, name: '审核中' }
      ]
    }
  ]
}))

// 2. 领养趋势直方图
const adoptionTrendOption = computed(() => ({
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['9月', '10月', '11月', '12月', '1月', '2月'],
    axisLine: { lineStyle: { color: '#eee' } },
    axisLabel: { color: '#999' }
  },
  yAxis: { 
    type: 'value',
    splitLine: { lineStyle: { type: 'dashed', color: '#f5f5f5' } }
  },
  series: [
    {
      data: [12, 19, 15, 22, 30, 25],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#409EFF' }, { offset: 1, color: '#79bbff' }]
        },
        borderRadius: [5, 5, 0, 0]
      }
    }
  ]
}))

// 3. 物种分布饼图
const speciesPieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: '60%',
      data: [
        { value: statistics.value.catCount, name: '猫咪' },
        { value: statistics.value.dogCount, name: '狗狗' },
        { value: statistics.value.otherCount, name: '其他' }
      ],
      roseType: 'area',
      itemStyle: { borderRadius: 8 }
    }
  ]
}))

// API 请求
const fetchStatistics = async () => {
  try {
    loading.value = true
    // const response = await orgAPI.getDashboardStatistics()
    // 模拟数据填充以便预览
    statistics.value = {
      totalPets: 89,
      pendingApplications: 12,
      monthlyAdoptions: 25,
      pendingFollowups: 8,
      publishedPets: 60,
      draftPets: 15,
      underReviewPets: 14,
      catCount: 45,
      dogCount: 32,
      otherCount: 12
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => fetchStatistics()
const handleExportData = () => ElMessage.info('正在生成导出文件...')

onMounted(() => fetchStatistics())
</script>

<style scoped lang="scss">
.org-statistics {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-content {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

/* 顶部磁贴卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.modern-stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  &:hover { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .card-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-right: 18px;
  }

  .card-info {
    display: flex; flex-direction: column;
    .label { font-size: 14px; color: #909399; margin-bottom: 4px; }
    .value { font-size: 26px; font-weight: bold; color: #303133; }
  }

  /* 颜色主题 */
  &.primary { .card-icon { background: #ecf5ff; color: #409eff; } }
  &.warning { .card-icon { background: #fdf6ec; color: #e6a23c; } }
  &.success { .card-icon { background: #f0f9eb; color: #67c23a; } }
  &.danger  { .card-icon { background: #fef0f0; color: #f56c6c; } }
}

/* 图表卡片 */
.charts-row { margin-bottom: 20px; }

.chart-card {
  border-radius: 16px;
  border: none;
  background: #fff;
  height: 100%;

  .card-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 16px; font-weight: 600;
  }
}

.chart-container {
  height: 320px;
  width: 100%;
  &.small { height: 260px; }
  .chart { height: 100%; width: 100%; }
}

/* 快捷导航 */
.quick-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  padding: 20px 0;

  .nav-item {
    display: flex; flex-direction: column; align-items: center;
    cursor: pointer; transition: 0.3s;
    
    &:hover {
      .nav-icon { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      span { color: #409eff; }
    }

    .nav-icon {
      width: 60px; height: 60px;
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; margin-bottom: 12px;
      transition: 0.3s;
      
      &.p-color { background: #ecf5ff; color: #409eff; }
      &.w-color { background: #fdf6ec; color: #e6a23c; }
      &.s-color { background: #f0f9eb; color: #67c23a; }
      &.i-color { background: #f4f4f5; color: #909399; }
    }
    
    span { font-size: 14px; color: #606266; font-weight: 500; }
  }
}

@media (max-width: 768px) {
  .dashboard-content { padding: 12px; }
  .charts-row .el-col { margin-bottom: 15px; }
}
</style>