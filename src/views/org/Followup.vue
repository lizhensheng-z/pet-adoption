<template>

    <PageHeader title="回访管理" :custom-breadcrumb="[
      { path: '/', title: '首页' },
      { path: '/org', title: '机构首页' },
      { path: null, title: '回访管理' }
    ]">
      <template #actions>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <div class="filter-section">
        <el-card shadow="never">
          <el-form :inline="true" :model="filterForm" class="filter-form">
            <el-form-item label="回访状态">
              <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
                <el-option label="全部" value="" />
                <el-option label="待回访" value="WAITING" />
                <el-option label="已超期" value="OVERDUE" />
                <el-option label="已回访" value="COMPLETED" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button @click="handleReset">
                <el-icon><RefreshLeft /></el-icon>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <div class="content-section">
        <el-card shadow="never">
          <el-table
            v-loading="loading"
            :data="adoptedList"
            stripe
            style="width: 100%"
            empty-text="暂无领养记录"
          >
            <el-table-column prop="petCoverUrl" label="宠物照片" width="100">
              <template #default="{ row }">
                <el-image
                  :src="row.petCoverUrl || '/default-pet.jpg'"
                  :preview-src-list="[row.petCoverUrl || '/default-pet.jpg']"
                  style="width: 60px; height: 60px; border-radius: 4px"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </template>
            </el-table-column>

            <el-table-column prop="petName" label="宠物信息" min-width="120">
              <template #default="{ row }">
                <div class="pet-info">
                  <div class="pet-name">{{ row.petName }}</div>
                  <div class="adopt-time">领养时间：{{ formatDate(row.adoptedTime) }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="userName" label="领养人信息" min-width="150">
              <template #default="{ row }">
                <div class="user-info">
                  <div class="user-name">{{ row.userName }}</div>
                  <div class="user-phone">{{ row.userPhone }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="回访状态" width="120">
              <template #default="{ row }">
                <div class="followup-status">
                  <el-tag
                    :type="getStatusType(row.followupStatus)"
                    size="small"
                  >
                    {{ getStatusText(row.followupStatus) }}
                  </el-tag>
                  <div class="days-info">{{ getDaysInfo(row) }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="打卡记录" width="100">
              <template #default="{ row }">
                <el-button
                  type="info"
                  size="small"
                  text
                  @click="handleViewCheckins(row)"
                >
                  查看({{ row.checkinCount || 0 }})
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleContact(row)"
                >
                  <el-icon><Phone /></el-icon>
                  联系
                </el-button>
                <el-button
                  type="info"
                  size="small"
                  text
                  @click="handleViewDetail(row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="领养详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="宠物名称">{{ currentDetail.petName }}</el-descriptions-item>
          <el-descriptions-item label="领养人">{{ currentDetail.userName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentDetail.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="领养时间">{{ formatDate(currentDetail.adoptedTime) }}</el-descriptions-item>
          <el-descriptions-item label="回访状态">
            <el-tag :type="getStatusType(currentDetail.followupStatus)">
              {{ getStatusText(currentDetail.followupStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="已领养天数">{{ currentDetail.daysSinceAdoption }}天</el-descriptions-item>
        </el-descriptions>
        
        <div v-if="checkinList.length > 0" class="checkin-section">
          <h4>最近打卡记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="checkin in checkinList.slice(0, 3)"
              :key="checkin.id"
              :timestamp="formatDate(checkin.createTime)"
            >
              {{ checkin.content || '用户发布了打卡' }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleContact(currentDetail)">
          <el-icon><Phone /></el-icon>
          联系用户
        </el-button>
      </template>
    </el-dialog>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search, RefreshLeft, Phone, Picture } from '@element-plus/icons-vue'

import PageHeader from '@/components/common/PageHeader.vue'
import http from '@/api/request.js'

// 使用统一请求封装

// 响应式数据
const loading = ref(false)
const adoptedList = ref([])
const detailDialogVisible = ref(false)
const currentDetail = ref(null)
const checkinList = ref([])

// 筛选表单
const filterForm = reactive({
  status: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 获取已领养宠物列表
const fetchAdoptedPets = async () => {
  try {
    loading.value = true
      const response = await http.get('/org/adoptions', {
        params: {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          status: 'APPROVED' // 只获取已批准的领养记录
        }
      })
    
      if (response.code === 10000) {
        const records = response.data?.list || []
        adoptedList.value = records.map(item => ({
          ...item,
          followupStatus: calculateFollowupStatus(item),
          daysSinceAdoption: item.daysSinceAdoption || calculateDaysSinceAdoption(item.adoptedTime)
        }))
        pagination.total = response.data?.total || 0
      } else {
        ElMessage.error(response.message || '获取领养记录失败')
      }
  } catch (error) {
    console.error('获取领养记录失败:', error)
    ElMessage.error('获取领养记录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 计算回访状态
const calculateFollowupStatus = (item) => {
  const adoptedDate = new Date(item.adoptedTime)
  const now = new Date()
  const daysSinceAdoption = Math.floor((now - adoptedDate) / (1000 * 60 * 60 * 24))
  
  if (daysSinceAdoption < 30) {
    return 'WAITING'
  } else if (daysSinceAdoption < 35) {
    return 'UPCOMING'
  } else if (daysSinceAdoption < 90) {
    return 'OVERDUE'
  } else {
    const cycle = Math.floor(daysSinceAdoption / 90)
    const nextFollowup = cycle * 90 + 30
    const daysUntilNext = nextFollowup - daysSinceAdoption
    return daysUntilNext <= 5 ? 'UPCOMING' : 'OVERDUE'
  }
}

// 计算领养天数
const calculateDaysSinceAdoption = (adoptedTime) => {
  const adoptedDate = new Date(adoptedTime)
  const now = new Date()
  return Math.floor((now - adoptedDate) / (1000 * 60 * 60 * 24))
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'WAITING': return 'info'
    case 'UPCOMING': return 'warning'
    case 'OVERDUE': return 'danger'
    default: return 'success'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'WAITING': return '待回访'
    case 'UPCOMING': return '即将到期'
    case 'OVERDUE': return '已超期'
    default: return '已回访'
  }
}

// 获取天数信息
const getDaysInfo = (row) => {
  const days = row.daysSinceAdoption
  if (days < 30) {
    return `还有${30 - days}天`
  } else if (days < 90) {
    return `超期${days - 30}天`
  } else {
    const cycle = Math.floor(days / 90)
    const nextFollowup = cycle * 90 + 30
    const daysUntilNext = nextFollowup - days
    return daysUntilNext > 0 ? `还有${daysUntilNext}天` : `超期${Math.abs(daysUntilNext)}天`
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchAdoptedPets()
}

// 重置
const handleReset = () => {
  filterForm.status = ''
  pagination.currentPage = 1
  fetchAdoptedPets()
}

// 刷新
const handleRefresh = () => {
  fetchAdoptedPets()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchAdoptedPets()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchAdoptedPets()
}

// 查看详情
const handleViewDetail = async (row) => {
  currentDetail.value = row
  detailDialogVisible.value = true
  
  // 这里可以获取打卡记录，但暂时不实现
  checkinList.value = []
}

// 查看打卡记录
const handleViewCheckins = (row) => {
  ElMessage.info('打卡记录功能开发中...')
}

// 联系用户
const handleContact = (row) => {
  ElMessage.success(`已复制联系方式：${row.userPhone}`)
  // 这里可以实现复制到剪贴板的功能
  if (navigator.clipboard) {
    navigator.clipboard.writeText(row.userPhone)
  }
}

// 初始化
onMounted(() => {
  fetchAdoptedPets()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
}

.filter-section {
  margin-bottom: var(--spacing-lg);
}

.filter-form {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.content-section {
  background: white;
  border-radius: var(--border-radius-large);
}

.pet-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pet-name {
  font-weight: 600;
  color: var(--text-color-primary);
}

.adopt-time {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 600;
  color: var(--text-color-primary);
}

.user-phone {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.followup-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.days-info {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.image-error {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color-base);
  border-radius: 4px;
  color: var(--text-color-secondary);
}

.pagination-container {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: var(--spacing-md);
}

.checkin-section {
  margin-top: var(--spacing-lg);
}

.checkin-section h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color-primary);
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}
</style>