<template>

    <PageHeader title="公告管理">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增公告
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <!-- 搜索区域 -->
      <el-card class="search-card">
        <el-form :inline="true" :model="searchForm" @submit.prevent="handleSearch">
          <el-form-item label="公告标题">
            <el-input
              v-model="searchForm.title"
              placeholder="请输入公告标题"
              clearable
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select 
              v-model="searchForm.status" 
              placeholder="全部" 
              clearable
              @clear="handleSearch"
            >
              <el-option label="草稿" value="DRAFT" />
              <el-option label="已发布" value="PUBLISHED" />
              <el-option label="已删除" value="REMOVED" />
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

      <!-- 列表区域 -->
      <el-card>
        <el-table
          :data="noticeList"
          v-loading="loading"
          stripe
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="title" label="公告标题" min-width="200" show-overflow-tooltip />
          <el-table-column prop="contentSummary" label="内容摘要" min-width="300" show-overflow-tooltip />
          <el-table-column prop="statusText" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" effect="plain">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
          <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                link 
                @click="handleView(row)"
                v-if="row.status === 'PUBLISHED'"
              >
                查看
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="handleEdit(row)"
                v-if="row.status !== 'REMOVED'"
              >
                编辑
              </el-button>
              <el-button
                v-if="row.status === 'DRAFT'"
                type="success"
                link
                @click="handlePublish(row)"
              >
                发布
              </el-button>
              <el-button
                v-if="row.status === 'PUBLISHED'"
                type="warning"
                link
                @click="handleUnpublish(row)"
              >
                下架
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="handleDelete(row)"
                v-if="row.status !== 'REMOVED'"
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
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 新增/编辑对话框 -->
    <NoticeFormDialog
      v-model="dialogVisible"
      :notice="currentNotice"
      @success="handleSuccess"
    />

    <!-- 公告详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="公告详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="currentNotice" class="notice-detail">
        <h3>{{ currentNotice.title }}</h3>
        <div class="notice-meta">
          <span>状态：{{ getStatusText(currentNotice.status) }}</span>
          <span>创建时间：{{ currentNotice.createTime }}</span>
          <span v-if="currentNotice.updateTime !== currentNotice.createTime">
            更新时间：{{ currentNotice.updateTime }}
          </span>
        </div>
        <div class="notice-content" v-html="currentNotice.content"></div>
      </div>
    </el-dialog>

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useNoticeStore } from '@/stores/notice.js'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import NoticeFormDialog from '@/components/admin/NoticeFormDialog.vue'

const noticeStore = useNoticeStore()

// 搜索表单
const searchForm = reactive({
  title: '',
  status: ''
})

// 分页
const pagination = reactive({
  pageNo: 1,
  pageSize: 10
})

// 对话框控制
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentNotice = ref(null)

// 计算属性
const noticeList = computed(() => noticeStore.noticeList)
const total = computed(() => noticeStore.total)
const loading = computed(() => noticeStore.loading)

// 状态映射
const statusMap = {
  DRAFT: { type: 'info', text: '草稿' },
  PUBLISHED: { type: 'success', text: '已发布' },
  REMOVED: { type: 'danger', text: '已删除' }
}

// 方法
const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status

// 加载数据
const loadData = async () => {
  const params = {
    ...searchForm,
    page: pagination.pageNo,
    size: pagination.pageSize
  }
  await noticeStore.fetchNoticeList(params)
}

// 搜索处理
const handleSearch = () => {
  pagination.pageNo = 1
  loadData()
}

// 重置处理
const handleReset = () => {
  searchForm.title = ''
  searchForm.status = ''
  handleSearch()
}

// 新增公告
const handleAdd = () => {
  currentNotice.value = null
  dialogVisible.value = true
}

// 查看公告详情
const handleView = (row) => {
  currentNotice.value = { ...row }
  detailDialogVisible.value = true
}

// 编辑公告
const handleEdit = async (row) => {
  try {
    loading.value = true
    const response = await noticeStore.fetchNoticeDetail(row.id)
    if (response.code === 10000) {
      currentNotice.value = response.data
      dialogVisible.value = true
    } else {
      ElMessage.error('获取公告详情失败')
    }
  } catch (error) {
    ElMessage.error('获取公告详情失败')
  } finally {
    loading.value = false
  }
}

// 发布公告
const handlePublish = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要发布该公告吗？发布后用户将可以看到。',
      '发布确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await noticeStore.updateNoticeStatus(row.id, 'PUBLISHED')
    if (response.code === 10000) {
      ElMessage.success('发布成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('发布失败')
    }
  }
}

// 下架公告
const handleUnpublish = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要下架该公告吗？下架后用户将无法看到。',
      '下架确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await noticeStore.updateNoticeStatus(row.id, 'DRAFT')
    if (response.code === 10000) {
      ElMessage.success('下架成功')
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('下架失败')
    }
  }
}

// 删除公告
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该公告吗？删除后不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const response = await noticeStore.deleteNotice(row.id)
    if (response.code === 10000) {
      ElMessage.success('删除成功')
      // 如果删除的是当前页最后一条数据，返回上一页
      if (noticeList.value.length === 1 && pagination.pageNo > 1) {
        pagination.pageNo--
      }
      loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 操作成功回调
const handleSuccess = () => {
  dialogVisible.value = false
  loadData()
}

// 分页处理
const handlePageChange = (page) => {
  pagination.pageNo = page
  loadData()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNo = 1
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.search-card {
  margin-bottom: var(--spacing-lg);
}

.pagination-container {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.notice-detail {
  padding: var(--spacing-md);
}

.notice-detail h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  font-size: 18px;
}

.notice-meta {
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 14px;
}

.notice-meta span {
  margin-right: var(--spacing-lg);
}

.notice-content {
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
}

:deep(.el-table) {
  --el-table-header-bg-color: var(--bg-light);
}

:deep(.el-button.is-link) {
  padding: 0 4px;
}
</style>