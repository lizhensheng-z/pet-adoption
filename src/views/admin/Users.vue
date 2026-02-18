<template>

    <PageHeader title="用户管理">
      <template #actions>
        <!-- <el-button @click="handleExport" :loading="exportLoading">
          <el-icon><Download /></el-icon>
          导出
        </el-button> -->
        <el-button @click="loadUserList">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </template>
    </PageHeader>

    <div class="user-management-container">
      <!-- 搜索筛选区域 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="用户名/手机号/邮箱"
              clearable
              @clear="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="角色">
            <el-select v-model="searchForm.role" placeholder="全部" clearable>
              <el-option label="普通用户" value="USER" />
              <el-option label="机构用户" value="ORG" />
              <el-option label="管理员" value="ADMIN" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable>
              <el-option label="正常" value="NORMAL" />
              <el-option label="已禁用" value="BANNED" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 批量操作区域 -->
      <div class="batch-actions" v-if="hasSelection">
        <el-button
          type="success"
          @click="batchEnableUsers"
          :disabled="batchDisabled"
          :loading="batchLoading"
        >
          批量启用
        </el-button>
        <el-button
          type="warning"
          @click="batchDisableUsers"
          :disabled="batchDisabled"
          :loading="batchLoading"
        >
          批量禁用
        </el-button>
        <el-button
          type="danger"
          @click="handleBatchDelete"
          :disabled="batchDisabled"
          :loading="batchLoading"
        >
          批量删除
        </el-button>
        <span class="selection-count">已选择 {{ selectedUsers.length }} 项</span>
      </div>

      <!-- 用户列表表格 -->
      <el-card>
        <el-table
          :data="tableData.list"
          v-loading="tableData.loading"
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="头像" width="80">
            <template #default="{ row }">
              <el-avatar :src="row.avatar" :size="40">
                {{ row.username?.charAt(0) }}
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="phone" label="手机号" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column label="角色" width="100">
            <template #default="{ row }">
              <el-tag :type="getRoleTagType(row.role)">
                {{ getRoleName(row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)">
                {{ getStatusName(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleViewDetail(row)">
                详情
              </el-button>
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                :type="row.status === 'NORMAL' ? 'warning' : 'success'"
                link
                @click="toggleUserStatus(row)"
              >
                {{ row.status === 'NORMAL' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :total="tableData.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          class="mt-4"
        />
      </el-card>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialog.visible"
      title="编辑用户"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editDialog.form"
        :rules="editDialog.rules"
        label-width="80px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editDialog.form.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editDialog.form.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editDialog.form.role" style="width: 100%">
            <el-option label="普通用户" value="USER" />
            <el-option label="机构用户" value="ORG" />
            <el-option label="管理员" value="ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editDialog.form.status">
            <el-radio label="NORMAL">正常</el-radio>
            <el-radio label="BANNED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="editDialog.loading">
          保存
        </el-button>
      </template>
    </el-dialog>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Refresh, Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'

import { userApi as adminAPI } from '@/api/modules/admin.js'

const router = useRouter()

// 搜索筛选条件
const searchForm = ref({
  keyword: '',
  role: '',
  status: '',
  dateRange: []
})

// 表格数据
const tableData = ref({
  list: [],
  total: 0,
  loading: false
})

// 分页信息
const pagination = ref({
  page: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100]
})

// 批量操作
const selectedUsers = ref([])
const batchLoading = ref(false)
const exportLoading = ref(false)

// 编辑对话框
const editDialog = ref({
  visible: false,
  loading: false,
  form: {
    id: null,
    phone: '',
    email: '',
    role: '',
    avatar: '',
    status: ''
  },
  rules: {
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  }
})

// 计算属性
const hasSelection = computed(() => selectedUsers.value.length > 0)
const batchDisabled = computed(() => !hasSelection.value || batchLoading.value)

// 角色/状态格式化方法
const getRoleTagType = (role) => ({ 'USER': 'primary', 'ORG': 'success', 'ADMIN': 'danger' }[role] || 'info')
const getStatusTagType = (status) => status === 'NORMAL' ? 'success' : 'danger'
const getRoleName = (role) => ({ 'USER': '普通用户', 'ORG': '机构用户', 'ADMIN': '管理员' }[role] || role)
const getStatusName = (status) => status === 'NORMAL' ? '正常' : '已禁用'

// 加载列表
const loadUserList = async () => {
  try {
    tableData.value.loading = true
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      keyword: searchForm.value.keyword,
      role: searchForm.value.role,
      status: searchForm.value.status
    }
    if (searchForm.value.dateRange?.length === 2) {
      params.startDate = searchForm.value.dateRange[0]
      params.endDate = searchForm.value.dateRange[1]
    }
    const response = await adminAPI.getUserList(params)
    tableData.value.list = response.data.list
    tableData.value.total = response.data.total
  } catch (error) {
    ElMessage.error('加载列表失败')
  } finally {
    tableData.value.loading = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  loadUserList()
}

const resetSearch = () => {
  searchForm.value = { keyword: '', role: '', status: '', dateRange: [] }
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.value.page = page
  loadUserList()
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  loadUserList()
}

const handleSelectionChange = (selection) => {
  selectedUsers.value = selection.map(item => item.id)
}

const handleViewDetail = (user) => router.push(`/admin/users/${user.id}`)

const handleEdit = (user) => {
  editDialog.value.form = { ...user }
  editDialog.value.visible = true
}

const saveEdit = async () => {
  try {
    editDialog.value.loading = true
    await adminAPI.updateUser(editDialog.value.form.id, editDialog.value.form)
    ElMessage.success('更新成功')
    editDialog.value.visible = false
    loadUserList()
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    editDialog.value.loading = false
  }
}

const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'NORMAL' ? 'BANNED' : 'NORMAL'
    await adminAPI.updateUser(user.id, { status: newStatus })
    ElMessage.success('操作成功')
    loadUserList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 批量启用
const batchEnableUsers = async () => {
  try {
    batchLoading.value = true
    await adminAPI.batchUpdateUserStatus(selectedUsers.value, 'NORMAL')
    ElMessage.success('批量启用成功')
    loadUserList()
  } finally {
    batchLoading.value = false
  }
}

// 批量禁用
const batchDisableUsers = async () => {
  try {
    batchLoading.value = true
    await adminAPI.batchUpdateUserStatus(selectedUsers.value, 'BANNED')
    ElMessage.success('批量禁用成功')
    loadUserList()
  } finally {
    batchLoading.value = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除选中的用户吗？操作不可恢复！', '警告', { type: 'warning' })
    batchLoading.value = true
    await adminAPI.batchDeleteUsers(selectedUsers.value)
    ElMessage.success('删除成功')
    loadUserList()
  } catch (err) {
    // 取消
  } finally {
    batchLoading.value = false
  }
}

// 2. 重要修复：将本地导出函数命名为 handleExport，避免和 import 进来的名称冲突
const handleExport = async () => {
  try {
    exportLoading.value = true
    const params = { ...searchForm.value }
    if (searchForm.value.dateRange?.length === 2) {
      params.startDate = searchForm.value.dateRange[0]
      params.endDate = searchForm.value.dateRange[1]
    }
    
    const response = await adminAPI.exportUsers(params)
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `用户列表_${new Date().toLocaleDateString()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.user-management-container { padding: 20px; }
.search-card { margin-bottom: 20px; }
.batch-actions { margin-bottom: 15px; display: flex; align-items: center; gap: 15px; }
.selection-count { color: #909399; font-size: 14px; }
.mt-4 { margin-top: 20px; }
</style>
