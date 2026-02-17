<template>

    <PageHeader title="宠物管理" :custom-breadcrumb="[
      { path: '/', title: '首页' },
      { path: '/org', title: '机构首页' },
      { path: null, title: '宠物管理' }
    ]">
      <template #actions>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新增宠物
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <!-- 搜索栏 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline @keyup.enter="handleSearch">
          <el-form-item label="宠物名称">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入宠物名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="全部状态"
              clearable
              style="width: 120px"
            >
              <el-option label="已发布" value="PUBLISHED" />
              <el-option label="草稿" value="DRAFT" />
              <el-option label="已下架" value="OFFLINE" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select
              v-model="searchForm.auditStatus"
              placeholder="全部状态"
              clearable
              style="width: 120px"
            >
              <el-option label="待审核" value="PENDING" />
              <el-option label="已通过" value="APPROVED" />
              <el-option label="已拒绝" value="REJECTED" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 数据表格 -->
      <el-card class="table-card">
        <el-table
          v-loading="loading"
          :data="petList"
          style="width: 100%"
          border
        >
          <el-table-column prop="coverUrl" label="宠物图片" width="100">
            <template #default="{ row }">
              <el-image
                v-if="row.coverUrl"
                :src="row.coverUrl"
                :preview-src-list="[row.coverUrl]"
                style="width: 60px; height: 60px; border-radius: 4px"
                fit="cover"
              />
              <div v-else class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="宠物名称" min-width="120" />
          <el-table-column prop="species" label="物种" width="80">
            <template #default="{ row }">
              <el-tag :type="row.species === 'CAT' ? 'warning' : 'success'">
                {{ row.species === 'CAT' ? '猫' : row.species === 'DOG' ? '狗' : '其他' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="审核状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getAuditType(row.auditStatus)">
                {{ getAuditText(row.auditStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applicationCount" label="申请数" width="80" align="center" />
          <el-table-column prop="favoriteCount" label="收藏数" width="80" align="center" />
          <el-table-column prop="publishedTime" label="发布时间" width="160">
            <template #default="{ row }">
              {{ formatDate(row.publishedTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="success" link @click="handleView(row)">
                查看
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="handleDelete(row)"
                :disabled="row.status === 'PUBLISHED'"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.pageNo"
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

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Picture } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import {petAPI} from '@/api/modules/pet.js'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  auditStatus: ''
})

// 分页数据
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const petList = ref([])
const loading = ref(false)

// 获取宠物列表
const getPetList = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const { data } = await petAPI.getOrgPetList(params)
    petList.value = data.list || []
    pagination.total = data.total || 0
  } catch (error) {
    ElMessage.error('获取宠物列表失败')
    console.error('获取宠物列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNo = 1
  getPetList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.auditStatus = ''
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  getPetList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.pageNo = val
  getPetList()
}

// 新增宠物
const handleCreate = () => {
  router.push('/org/pet/create')
}

// 编辑宠物
const handleEdit = (row) => {
  router.push(`/org/pet/edit/${row.id}`)
}

// 查看宠物
const handleView = (row) => {
  router.push(`/org/pet/detail/${row.id}`)
}

// 删除宠物
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除宠物 "${row.name}" 吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await petAPI.deletePet(row.id)
    ElMessage.success('删除成功')
    getPetList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除宠物失败:', error)
    }
  }
}

// 状态类型映射
const getStatusType = (status) => {
  const map = {
    'PUBLISHED': 'success',
    'DRAFT': 'info',
    'OFFLINE': 'danger',
    'PENDING_AUDIT': 'warning'
  }
  return map[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const map = {
    'PUBLISHED': '已发布',
    'DRAFT': '草稿',
    'OFFLINE': '已下架',
    'PENDING_AUDIT': '待审核'
  }
  return map[status] || status
}

// 审核状态类型映射
const getAuditType = (auditStatus) => {
  const map = {
    'APPROVED': 'success',
    'PENDING': 'warning',
    'REJECTED': 'danger',
    'NONE': 'info'
  }
  return map[auditStatus] || 'info'
}

// 审核状态文本映射
const getAuditText = (auditStatus) => {
  const map = {
    'APPROVED': '已通过',
    'PENDING': '待审核',
    'REJECTED': '已拒绝',
    'NONE': '未提交'
  }
  return map[auditStatus] || auditStatus
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  getPetList()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
}

.search-card {
  margin-bottom: var(--spacing-lg);
}

.table-card {
  margin-bottom: var(--spacing-lg);
}

.pagination-container {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.image-placeholder {
  width: 60px;
  height: 60px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}
</style>