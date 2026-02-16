<template>

    <PageHeader title="系统配置">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增配置
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <!-- 搜索区域 -->
      <el-card class="search-card">
        <el-form :inline="true" :model="searchForm" @submit.prevent>
          <el-form-item label="配置键名">
            <el-input 
              v-model="searchForm.configKey" 
              placeholder="请输入配置键名" 
              clearable 
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input 
              v-model="searchForm.remark" 
              placeholder="请输入备注" 
              clearable 
              @clear="handleSearch"
            />
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

      <!-- 配置列表 -->
      <el-card>
        <el-table 
          :data="configList" 
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="configKey" label="配置键" width="200" />
          <el-table-column prop="configValue" label="配置值" min-width="300" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.configValue" placement="top" :disabled="row.configValue.length <= 50">
                <span>{{ row.configValue.length > 50 ? row.configValue.substring(0, 50) + '...' : row.configValue }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button 
                link 
                type="primary" 
                @click="handleEdit(row)"
                :disabled="isCoreConfig(row.configKey)"
              >
                编辑
              </el-button>
              <el-button 
                link 
                type="danger" 
                @click="handleDelete(row)"
                :disabled="isCoreConfig(row.configKey)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
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

    <!-- 配置表单弹窗 -->
    <ConfigFormDialog 
      v-model="dialogVisible" 
      :data="currentConfig" 
      @success="loadData" 
    />

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ConfigFormDialog from './components/ConfigFormDialog.vue'
import { configApi } from '@/api/modules/admin.js'

// 响应式数据
const loading = ref(false)
const configList = ref([])
const dialogVisible = ref(false)
const currentConfig = ref(null)

// 搜索表单
const searchForm = reactive({
  configKey: '',
  remark: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 核心配置键名（不允许删除）
const CORE_CONFIG_KEYS = [
  'app_name',
  'app_version',
  'upload_limit',
  'max_file_size'
]

// 判断是否为核心配置
const isCoreConfig = (configKey) => {
  return CORE_CONFIG_KEYS.includes(configKey)
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const params = {
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    
    const { data } = await configApi.getConfigList(params)
    configList.value = data.list || []
    pagination.total = data.total || 0
  } catch (error) {
    ElMessage.error('加载配置列表失败')
    console.error('加载配置列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

// 重置搜索
const handleReset = () => {
  searchForm.configKey = ''
  searchForm.remark = ''
  handleSearch()
}

// 新增配置
const handleAdd = () => {
  currentConfig.value = null
  dialogVisible.value = true
}

// 编辑配置
const handleEdit = (row) => {
  currentConfig.value = { ...row }
  dialogVisible.value = true
}

// 删除配置
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除配置 "${row.configKey}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await configApi.deleteConfig(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除配置失败:', error)
    }
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  loadData()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-lg);
}

.search-card {
  margin-bottom: var(--spacing-lg);
}

.search-card :deep(.el-card__body) {
  padding: var(--spacing-md);
}

.pagination-container {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table__cell) {
  padding: var(--spacing-sm) 0;
}
</style>