<template>

    <PageHeader title="标签管理">
      <template #actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增标签
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <!-- 搜索区域 -->
      <el-card class="search-card">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="标签名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入标签名称"
              clearable
              @clear="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="标签类型">
            <el-select v-model="searchForm.tagType" placeholder="全部" clearable>
              <el-option label="物种" value="SPECIES" />
              <el-option label="性格特征" value="PERSONALITY" />
              <el-option label="健康状况" value="HEALTH" />
              <el-option label="外貌特征" value="FEATURE" />
            </el-select>
          </el-form-item>

          <el-form-item label="启用状态">
            <el-select v-model="searchForm.enabled" placeholder="全部" clearable>
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 标签列表 -->
      <el-card>
        <el-table
          :data="tagList"
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" />
          
          <el-table-column prop="name" label="标签名称" min-width="150" />
          
          <el-table-column prop="tagType" label="标签类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTagTypeTag(row.tagType)">
                {{ formatTagType(row.tagType) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="启用状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.enabled"
                :active-value="true"
                :inactive-value="false"
                @change="(val) => handleStatusChange(row, val)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="180" />

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          class="pagination"
        />
      </el-card>
    </div>

    <!-- 标签表单对话框 -->
    <TagFormDialog
      v-model="dialogVisible"
      :data="currentTag"
      @success="loadData"
    />

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import TagFormDialog from '@/components/admin/TagFormDialog.vue'
import { useTagStore } from '@/stores/tag.js'

const tagStore = useTagStore()

// 对话框控制
const dialogVisible = ref(false)
const currentTag = ref(null)

// 搜索表单
const searchForm = ref({
  name: '',
  tagType: '',
  enabled: ''
})

// 分页
const pagination = ref({
  page: 1,
  pageSize: 10
})

// 计算属性
const tagList = computed(() => tagStore.tagList)
const total = computed(() => tagStore.total)
const loading = computed(() => tagStore.loading)

// 标签类型格式化
const formatTagType = (type) => {
  const typeMap = {
    'SPECIES': '物种',
    'PERSONALITY': '性格特征',
    'HEALTH': '健康状况',
    'FEATURE': '外貌特征'
  }
  return typeMap[type] || type
}

const getTagTypeTag = (type) => {
  const typeMap = {
    'SPECIES': 'primary',
    'PERSONALITY': 'success',
    'HEALTH': 'warning',
    'FEATURE': 'info'
  }
  return typeMap[type] || 'info'
}

// 加载数据
const loadData = async () => {
  console.log('开始加载标签数据...')
  try {
    await tagStore.fetchTagList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    console.log('标签数据加载完成')
  } catch (error) {
    console.error('加载标签数据失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  tagStore.setSearchParams(searchForm.value)
  pagination.value.page = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    tagType: '',
    enabled: ''
  }
  tagStore.resetSearch()
  pagination.value.page = 1
  loadData()
}

// 分页
const handlePageChange = (page) => {
  pagination.value.page = page
  loadData()
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  loadData()
}

// 新增标签
const handleAdd = () => {
  currentTag.value = null
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row) => {
  currentTag.value = row
  dialogVisible.value = true
}

// 删除标签
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签 "${row.name}" 吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await tagStore.deleteTag(row.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除标签失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 切换状态
const handleStatusChange = async (row, enabled) => {
  try {
    // 转换为数字发送给后端
    const enabledValue = enabled ? 1 : 0
    await tagStore.toggleTagStatus(row.id, enabledValue)
    ElMessage.success(enabled ? '启用成功' : '禁用成功')
  } catch (error) {
    // 失败时恢复状态
    row.enabled = !enabled
    ElMessage.error('状态更新失败')
  }
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>