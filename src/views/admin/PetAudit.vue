<template>
  <div class="pet-audit-page">
    <PageHeader title="宠物发布审核">
      <template #actions>
        <el-button type="primary" plain @click="loadPendingPets" :loading="loading" round>
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </template>
    </PageHeader>

    <!-- 筛选区 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="物种">
          <el-select v-model="filterForm.species" placeholder="全部" clearable style="width: 120px">
            <el-option label="猫咪" value="CAT" />
            <el-option label="狗狗" value="DOG" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" round>
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset" round>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 待审核列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>待审核列表</span>
          <el-tag type="warning" v-if="pagination.total > 0">{{ pagination.total }} 条待审核</el-tag>
        </div>
      </template>

      <el-table :data="petList" v-loading="loading" style="width: 100%">
        <el-table-column label="宠物信息" min-width="280">
          <template #default="{ row }">
            <div class="pet-info">
              <el-image
                :src="row.coverUrl || defaultCover"
                fit="cover"
                class="pet-cover"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="pet-detail">
                <div class="pet-name">{{ row.petName }}</div>
                <div class="pet-meta">
                  <el-tag size="small" effect="plain">{{ getSpeciesLabel(row.species) }}</el-tag>
                  <span class="breed">{{ row.breed }}</span>
                </div>
                <div class="pet-attrs">
                  <span>{{ getGenderLabel(row.gender) }}</span>
                  <span>·</span>
                  <span>{{ row.ageMonth }}个月</span>
                  <span>·</span>
                  <span>{{ getSizeLabel(row.size) }}型</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="发布机构" min-width="180">
          <template #default="{ row }">
            <div class="org-info">
              <div class="org-name">{{ row.orgName || '未知机构' }}</div>
              <div class="org-contact">{{ row.contactName }} · {{ row.contactPhone }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.submitTime) }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="warning" effect="dark">待审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDetail(row)" round>
              <el-icon><View /></el-icon> 审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageNo"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 审核详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="宠物审核详情"
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="audit-detail" v-if="currentPet">
        <!-- 宠物基本信息 -->
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="宠物名称">{{ currentPet.name }}</el-descriptions-item>
            <el-descriptions-item label="物种">{{ getSpeciesLabel(currentPet.species) }}</el-descriptions-item>
            <el-descriptions-item label="品种">{{ currentPet.breed }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ getGenderLabel(currentPet.gender) }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ currentPet.ageMonth }}个月</el-descriptions-item>
            <el-descriptions-item label="体型">{{ getSizeLabel(currentPet.size) }}</el-descriptions-item>
            <el-descriptions-item label="毛色">{{ currentPet.color }}</el-descriptions-item>
            <el-descriptions-item label="绝育">{{ currentPet.sterilized ? '已绝育' : '未绝育' }}</el-descriptions-item>
            <el-descriptions-item label="疫苗">{{ currentPet.vaccinated ? '已疫苗' : '未疫苗' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 健康与性格 -->
        <div class="detail-section">
          <h4>健康与性格</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="健康描述">{{ currentPet.healthDesc || '暂无' }}</el-descriptions-item>
            <el-descriptions-item label="性格描述">{{ currentPet.personalityDesc || '暂无' }}</el-descriptions-item>
            <el-descriptions-item label="领养要求">{{ currentPet.adoptRequirements || '暂无' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 标签 -->
        <div class="detail-section" v-if="currentPet.tags && currentPet.tags.length">
          <h4>标签</h4>
          <div class="tags-wrapper">
            <el-tag v-for="tag in currentPet.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
          </div>
        </div>

        <!-- 图片展示 -->
        <div class="detail-section" v-if="currentPet.images && currentPet.images.length">
          <h4>宠物照片</h4>
          <div class="images-wrapper">
            <el-image
              v-for="(img, index) in currentPet.images"
              :key="index"
              :src="img"
              :preview-src-list="currentPet.images"
              :initial-index="index"
              fit="cover"
              class="pet-image"
            />
          </div>
        </div>

        <!-- 机构信息 -->
        <div class="detail-section">
          <h4>发布机构</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="机构名称">{{ currentPet.orgName }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ currentPet.contactName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentPet.contactPhone }}</el-descriptions-item>
            <el-descriptions-item label="机构地址">{{ currentPet.orgAddress || '暂无' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 审核备注 -->
        <div class="detail-section">
          <h4>审核意见</h4>
          <el-input
            v-model="auditRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核意见（拒绝时必填拒绝原因）"
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false" round>取消</el-button>
        <el-button type="danger" @click="handleAudit('reject')" :loading="auditLoading" round>
          <el-icon><Close /></el-icon> 拒绝
        </el-button>
        <el-button type="success" @click="handleAudit('approve')" :loading="auditLoading" round>
          <el-icon><Check /></el-icon> 通过
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { petAuditApi } from '@/api/modules/admin.js'
import { Refresh, Search, Picture, View, Close, Check } from '@element-plus/icons-vue'

const defaultCover = 'https://via.placeholder.com/100x100?text=Pet'

// 筛选表单
const filterForm = reactive({
  species: ''
})

// 列表数据
const petList = ref([])
const loading = ref(false)
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

// 详情弹窗
const detailVisible = ref(false)
const currentPet = ref(null)
const auditRemark = ref('')
const auditLoading = ref(false)

// 加载待审核列表
const loadPendingPets = async () => {
  loading.value = true
  try {
    const res = await petAuditApi.getPendingPets({
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      species: filterForm.species || undefined
    })
    petList.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('加载待审核列表失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const handleViewDetail = async (row) => {
  try {
    const res = await petAuditApi.getPetAuditDetail(row.petId)
    currentPet.value = res.data
    auditRemark.value = ''
    detailVisible.value = true
  } catch (error) {
    console.error('加载详情失败:', error)
    ElMessage.error('加载详情失败')
  }
}

// 审核操作
const handleAudit = async (action) => {
  if (action === 'reject' && !auditRemark.value.trim()) {
    ElMessage.warning('拒绝时请填写拒绝原因')
    return
  }

  const actionText = action === 'approve' ? '通过' : '拒绝'

  try {
    await ElMessageBox.confirm(
      `确定要${actionText}该宠物的发布申请吗？`,
      '审核确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    auditLoading.value = true
    await petAuditApi.auditPet({
      petId: currentPet.value.petId,
      action: action,
      remark: auditRemark.value
    })

    ElMessage.success(`审核${actionText}成功`)
    detailVisible.value = false
    loadPendingPets()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审核失败:', error)
      ElMessage.error('审核失败')
    }
  } finally {
    auditLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNo = 1
  loadPendingPets()
}

// 重置
const handleReset = () => {
  filterForm.species = ''
  pagination.pageNo = 1
  loadPendingPets()
}

// 分页
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNo = 1
  loadPendingPets()
}

const handlePageChange = (page) => {
  pagination.pageNo = page
  loadPendingPets()
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取标签
const getSpeciesLabel = (species) => {
  const map = { CAT: '猫咪', DOG: '狗狗', OTHER: '其他' }
  return map[species] || species
}

const getGenderLabel = (gender) => {
  const map = { MALE: '公', FEMALE: '母', UNKNOWN: '未知' }
  return map[gender] || gender
}

const getSizeLabel = (size) => {
  const map = { S: '小', M: '中', L: '大' }
  return map[size] || size
}

onMounted(() => {
  loadPendingPets()
})
</script>

<style scoped>
.pet-audit-page {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pet-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pet-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.pet-detail {
  flex: 1;
}

.pet-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.pet-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.breed {
  color: #606266;
  font-size: 13px;
}

.pet-attrs {
  font-size: 12px;
  color: #909399;
}

.org-info {
  font-size: 13px;
}

.org-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.org-contact {
  color: #909399;
  font-size: 12px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 审核详情弹窗样式 */
.audit-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.images-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pet-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
}
</style>