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
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <el-loading :loading="loading" text="正在加载数据..." />
      </div>
      
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
                    <h4>{{ org.orgName || org.name }}</h4>
                    <p>申请人：{{ org.contactName || org.contact }} · {{ formatTime(org.applyTime || org.createdAt) }}</p>
                  </div>
                </div>
                <div class="org-btns">
                  <el-button type="primary" size="small" plain @click="viewOrgDetail(org)" round>查看详情</el-button>
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

    <!-- 机构详情审核弹窗 -->
    <el-dialog
      v-model="orgDetailVisible"
      title="机构详情审核"
      width="600px"
      destroy-on-close
    >
      <div v-if="orgDetailLoading" class="detail-loading">
        <el-skeleton :rows="6" animated />
      </div>
      <div v-else-if="currentOrgDetail" class="org-detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h4 class="section-title">基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">机构名称：</span>
              <span class="value">{{ currentOrgDetail.orgName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">资质登记号：</span>
              <span class="value">{{ currentOrgDetail.licenseNo || '未填写' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">联系人：</span>
              <span class="value">{{ currentOrgDetail.contactName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">联系电话：</span>
              <span class="value">{{ currentOrgDetail.contactPhone }}</span>
            </div>
            <div class="detail-item full-width">
              <span class="label">详细地址：</span>
              <span class="value">{{ formatAddress(currentOrgDetail) }}</span>
            </div>
            <div class="detail-item full-width">
              <span class="label">申请时间：</span>
              <span class="value">{{ currentOrgDetail.createTime }}</span>
            </div>
          </div>
        </div>

        <!-- 机构封面 -->
        <div class="detail-section" v-if="currentOrgDetail.coverUrl">
          <h4 class="section-title">机构封面</h4>
          <el-image
            :src="currentOrgDetail.coverUrl"
            :preview-src-list="[currentOrgDetail.coverUrl]"
            fit="cover"
            class="org-cover"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="orgDetailVisible = false">取消</el-button>
          <el-button type="danger" plain @click="handleRejectOrg" :loading="auditLoading">拒绝</el-button>
          <el-button type="success" @click="handleApproveOrg" :loading="auditLoading">通过审核</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { statsApi as adminAPI, orgApi } from '@/api/modules/admin.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, OfficeBuilding, Files, Select, Bell, Collection, 
  Setting, House, Refresh, TrendCharts, PieChart, Document 
} from '@element-plus/icons-vue'

// ECharts 引入
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
  totalUsers: 0,
  totalOrgs: 0,
  totalPets: 0,
  totalAdoptions: 0
})

const statConfigs = computed(() => [
  { label: '总用户数', value: stats.value.totalUsers, icon: 'User', color: '#409EFF', trend: 12 },
  { label: '机构数量', value: stats.value.totalOrgs, icon: 'OfficeBuilding', color: '#67C23A', trend: 5 },
  { label: '宠物总数', value: stats.value.totalPets, icon: 'Files', color: '#E6A23C', trend: 8 },
  { label: '成功领养', value: stats.value.totalAdoptions, icon: 'Select', color: '#F56C6C', trend: 15 }
])

const quickNavs = [
  { name: '用户管理', icon: 'User', path: '/admin/users', color: '#409EFF' },
  { name: '宠物审核', icon: 'Files', path: '/admin/pet-audits', color: '#E6A23C' },
  { name: '公告管理', icon: 'Bell', path: '/admin/notices', color: '#67C23A' },
  { name: '标签字典', icon: 'Collection', path: '/admin/tags', color: '#909399' },
  { name: '系统配置', icon: 'Setting', path: '/admin/config', color: '#F56C6C' }
]

const pendingOrgs = ref([])
const noticeSummary = ref({})

// 机构详情弹窗相关
const orgDetailVisible = ref(false)
const orgDetailLoading = ref(false)
const currentOrgDetail = ref(null)
const currentOrgId = ref(null)
const auditLoading = ref(false)

// 图表配置
const growthChartOption = ref({
  tooltip: { 
    trigger: 'axis',
    formatter: '{b}<br/>{a}: {c}'
  },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { 
    type: 'category', 
    boundaryGap: false, 
    data: []
  },
  yAxis: { 
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    }
  },
  series: [{
    name: '活跃量',
    type: 'line',
    smooth: true,
    data: [],
    itemStyle: { color: '#409EFF' },
    areaStyle: { 
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ]
      }
    }
  }]
})

const distributionChartOption = ref({
  tooltip: { 
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: { 
    bottom: '0', 
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8
  },
  series: [{
    name: '领养状态',
    type: 'pie',
    radius: ['40%', '70%'],
    itemStyle: { 
      borderRadius: 10, 
      borderColor: '#fff', 
      borderWidth: 2 
    },
    label: { 
      show: false 
    },
    data: []
  }]
})

// 方法
const formatTime = (t) => new Date(t).toLocaleDateString()
const goToUserHome = () => router.push('/home')

// 格式化地址
const formatAddress = (org) => {
  const parts = [org.province, org.city, org.district, org.address].filter(Boolean)
  return parts.join(' ') || '未填写'
}

// 查看机构详情
const viewOrgDetail = async (org) => {
  currentOrgId.value = org.id || org.userId
  orgDetailVisible.value = true
  orgDetailLoading.value = true
  currentOrgDetail.value = null

  try {
    const res = await orgApi.getOrgDetail(currentOrgId.value)
    currentOrgDetail.value = res.data
  } catch (error) {
    ElMessage.error('获取机构详情失败')
    console.error('获取机构详情失败:', error)
    orgDetailVisible.value = false
  } finally {
    orgDetailLoading.value = false
  }
}

// 通过审核
const handleApproveOrg = async () => {
  auditLoading.value = true
  try {
    await adminAPI.auditOrganization(currentOrgId.value, {
      action: 'approve',
      reason: '资料完整，符合要求'
    })
    ElMessage.success('审核通过')
    orgDetailVisible.value = false
    await loadDashboardData()
  } catch (error) {
    ElMessage.error('审核操作失败')
    console.error('审核失败:', error)
  } finally {
    auditLoading.value = false
  }
}

// 拒绝审核
const handleRejectOrg = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因：', '审核拒绝', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '拒绝原因不能为空'
    })

    auditLoading.value = true
    await adminAPI.auditOrganization(currentOrgId.value, {
      action: 'reject',
      reason: value
    })
    ElMessage.success('已拒绝')
    orgDetailVisible.value = false
    await loadDashboardData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核操作失败')
      console.error('审核失败:', error)
    }
  } finally {
    auditLoading.value = false
  }
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    const [statsRes, chartRes, orgsRes, noticeRes] = await Promise.all([
      adminAPI.getDashboardStats(),
      adminAPI.getDashboardCharts({ range: '7days' }),
      adminAPI.getPendingOrgs({ limit: 5 }),
      adminAPI.getNoticesSummary()
    ])
    
    // 更新统计数据
    if (statsRes.data) {
      stats.value = {
        totalUsers: statsRes.data.totalUsers?.value || 0,
        totalOrgs: statsRes.data.totalOrgs?.value || 0,
        totalPets: statsRes.data.totalPets?.value || 0,
        totalAdoptions: statsRes.data.totalAdoptions?.value || 0
      }
      
      // 更新趋势数据
      const configs = statConfigs.value
      configs.forEach((stat, index) => {
        const keyMap = {
          '总用户数': 'totalUsers',
          '机构数量': 'totalOrgs', 
          '宠物总数': 'totalPets',
          '成功领养': 'totalAdoptions'
        }
        const data = statsRes.data[keyMap[stat.label]]
        if (data) {
          stat.value = data.value
          stat.trend = data.trend
        }
      })
    }
    
    // 更新图表数据
    if (chartRes.data) {
      // 活跃度趋势 - 处理null值，使用模拟数据
      if (chartRes.data.activityTrend && chartRes.data.activityTrend.dates && chartRes.data.activityTrend.values) {
        growthChartOption.value.xAxis.data = chartRes.data.activityTrend.dates
        growthChartOption.value.series[0].data = chartRes.data.activityTrend.values
      } else {
        // 使用模拟数据
        growthChartOption.value.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        growthChartOption.value.series[0].data = [120, 132, 101, 134, 90, 230, 210]
      }
      
      // 领养状态分布
      if (chartRes.data.adoptionDistribution && chartRes.data.adoptionDistribution.length > 0) {
        distributionChartOption.value.series[0].data = chartRes.data.adoptionDistribution
      } else {
        // 使用模拟数据
        distributionChartOption.value.series[0].data = [
          { value: 1048, name: '已完成' },
          { value: 735, name: '审核中' },
          { value: 580, name: '已拒绝' },
          { value: 484, name: '已取消' }
        ]
      }
    }
    
    // 更新待审核机构
    pendingOrgs.value = orgsRes.data || []
    
    // 更新公告信息
    noticeSummary.value = noticeRes.data || {}
    
  } catch (error) {
    console.error('加载Dashboard数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 权限检查已在路由守卫中完成，此处直接加载数据
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

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

@media (max-width: 768px) {
  .quick-nav-grid { grid-template-columns: 1fr 1fr; }
  .stat-container { grid-template-columns: 1fr 1fr; }
}

/* 机构详情弹窗样式 */
.detail-loading {
  padding: 20px;
}

.org-detail-content {
  .detail-section {
    margin-bottom: 24px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;

    .detail-item {
      display: flex;
      align-items: flex-start;

      .label {
        color: #909399;
        min-width: 80px;
        flex-shrink: 0;
      }

      .value {
        color: #303133;
        word-break: break-all;
      }

      &.full-width {
        grid-column: 1 / -1;
      }
    }
  }

  .org-cover {
    width: 100%;
    max-height: 200px;
    border-radius: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
