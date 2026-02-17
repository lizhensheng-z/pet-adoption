<template>
  <div class="org-adoptions">
    <PageHeader title="领养申请管理" :custom-breadcrumb="[
      { path: '/', title: '首页' },
      { path: '/org', title: '机构首页' },
      { path: null, title: '领养申请管理' }
    ]">
      <template #actions>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </template>
    </PageHeader>

    <!-- 筛选和搜索 -->
    <div class="filter-bar">
      <el-select
        v-model="filterPetId"
        placeholder="全部宠物"
        clearable
        style="width: 150px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="pet in petOptions"
          :key="pet.id"
          :label="pet.name"
          :value="pet.id"
        />
      </el-select>

      <el-select
        v-model="filterStatus"
        placeholder="全部状态"
        clearable
        style="width: 120px; margin-left: 12px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-input
        v-model="searchKeyword"
        placeholder="搜索申请人或宠物名"
        style="width: 200px; margin-left: 12px"
        @keyup.enter="handleFilterChange"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button
        type="primary"
        style="margin-left: 12px"
        @click="handleFilterChange"
      >
        搜索
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">总申请数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-label">待处理</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ stats.processing }}</div>
            <div class="stat-label">处理中</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 申请列表 -->
    <div class="applications-list" v-loading="loading">
      <template v-if="applications.length > 0">
        <div
          v-for="application in applications"
          :key="application.id"
          class="application-card"
        >
          <div class="card-content">
            <div class="pet-info">
              <el-image
                :src="application.petCoverUrl || '/default-pet.jpg'"
                :alt="application.petName"
                class="pet-image"
                fit="cover"
                @click="viewApplication(application.id)"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="pet-details">
                <div class="pet-header">
                  <h3 @click="viewApplication(application.id)">{{ application.petName }}</h3>
                  <el-tag
                    :type="OrgApplicationStatusColor[application.status]"
                    effect="plain"
                    class="status-tag"
                  >
                    {{ OrgApplicationStatusMap[application.status] }}
                  </el-tag>
                </div>
                <p class="applicant">申请人：{{ application.userName }}</p>
                <p class="submit-time">提交时间：{{ formatTime(application.submitTime) }}</p>
                <p class="latest-flow">{{ application.statusDesc || '暂无流程' }}</p>
              </div>
            </div>

            <div class="card-actions">
              <el-button
                type="primary"
                text
                @click="viewApplication(application.id)"
              >
                查看详情
              </el-button>
              <el-button
                v-if="application.canModify"
                type="success"
                text
                @click="handleQuickAction(application)"
              >
                处理申请
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty
          image="/empty-applications.svg"
          :image-size="200"
          description="暂无申请记录"
        >
          <el-button type="primary" @click="loadApplications">重新加载</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Picture, Refresh } from '@element-plus/icons-vue'
import { getOrgApplications, OrgApplicationStatusMap, OrgApplicationStatusColor } from '@/api/modules/org-adoption'
import { petAPI } from '@/api/modules/pet'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()

const loading = ref(false)
const applications = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const filterPetId = ref('')
const filterStatus = ref('')
const searchKeyword = ref('')

const petOptions = ref([])

const stats = reactive({
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0
})

const statusOptions = [
  { value: 'SUBMITTED', label: '已提交' },
  { value: 'UNDER_REVIEW', label: '审核中' },
  { value: 'INTERVIEW', label: '已约面谈' },
  { value: 'HOME_VISIT', label: '家访中' },
  { value: 'APPROVED', label: '已通过' },
  { value: 'REJECTED', label: '已拒绝' },
  { value: 'CANCELLED', label: '已取消' }
]

const loadApplications = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      sortBy: 'submit_time',
      order: 'desc'
    }
    
    if (filterPetId.value) params.petId = filterPetId.value
    if (filterStatus.value) params.status = filterStatus.value
    if (searchKeyword.value) params.keyword = searchKeyword.value

    const { data } = await getOrgApplications(params)
    applications.value = data.records || []
    total.value = data.total || 0
    
    // 更新统计数据
    updateStats()
  } catch (error) {
    ElMessage.error('获取申请列表失败')
    console.error('获取申请列表失败:', error)
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  // 这里应该从后端获取统计数据，暂时用前端计算
  const pendingCount = applications.value.filter(app => 
    ['SUBMITTED', 'UNDER_REVIEW'].includes(app.status)
  ).length
  const processingCount = applications.value.filter(app => 
    ['INTERVIEW', 'HOME_VISIT'].includes(app.status)
  ).length
  const completedCount = applications.value.filter(app => 
    ['APPROVED', 'REJECTED', 'CANCELLED'].includes(app.status)
  ).length
  
  stats.total = applications.value.length
  stats.pending = pendingCount
  stats.processing = processingCount
  stats.completed = completedCount
}

const handleFilterChange = () => {
  currentPage.value = 1
  loadApplications()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadApplications()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadApplications()
}

const handleRefresh = () => {
  loadApplications()
  loadPetOptions()
}

const viewApplication = (id) => {
  router.push(`/org/adoptions/${id}`)
}

const handleQuickAction = (application) => {
  router.push(`/org/adoptions/${application.id}`)
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadPetOptions = async () => {
  try {
    const { data } = await petAPI.getOrgPetList({
      pageNo: 1,
      pageSize: 100, // 获取所有宠物
      status: 'PUBLISHED' // 只获取已发布的宠物
    })
    
    if (data && data.list) {
      // 根据宠物名称去重，使用Map保持顺序
      const uniquePets = Array.from(
        new Map(data.list.map(pet => [pet.name, { id: pet.id, name: pet.name }])).values()
      )
      
      petOptions.value = uniquePets
    }
  } catch (error) {
    console.error('获取宠物列表失败:', error)
    ElMessage.error('获取宠物列表失败')
  }
}

onMounted(() => {
  loadApplications()
  loadPetOptions()
})
</script>

<style lang="scss" scoped>
.org-adoptions {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .page-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: var(--el-text-color-primary);
    }

    .page-desc {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 16px;
    }
  }

  .filter-bar {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .stats-cards {
    margin-bottom: 30px;

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .stat-number {
        font-size: 32px;
        font-weight: bold;
        color: var(--el-color-primary);
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .applications-list {
    min-height: 400px;
  }

  .application-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .card-content {
      padding: 20px;
    }

    .pet-info {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      .pet-image {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        flex-shrink: 0;
        cursor: pointer;
      }

      .image-error {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--el-fill-color-lighter);
        color: var(--el-text-color-secondary);
        font-size: 24px;
      }

      .pet-details {
        flex: 1;

        .pet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          h3 {
            margin: 0;
            font-size: 18px;
            color: var(--el-text-color-primary);
            cursor: pointer;

            &:hover {
              color: var(--el-color-primary);
            }
          }

          .status-tag {
            font-size: 12px;
          }
        }

        .applicant,
        .submit-time,
        .latest-flow {
          margin: 4px 0;
          color: var(--el-text-color-regular);
          font-size: 14px;
        }

        .latest-flow {
          color: var(--el-text-color-secondary);
          font-size: 13px;
        }
      }
    }

    .card-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 12px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }

  .pagination {
    margin-top: 30px;
    text-align: center;
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;
  }

  @media (max-width: 768px) {
    .org-adoptions {
      padding: 10px;
    }

    .filter-bar {
      flex-direction: column;
      align-items: stretch;

      .el-select,
      .el-input {
        width: 100% !important;
        margin-left: 0 !important;
        margin-bottom: 12px;
      }
    }

    .stats-cards {
      .el-col {
        margin-bottom: 12px;
      }
    }

    .application-card {
      .card-content {
        padding: 15px;
      }

      .pet-info {
        flex-direction: column;
        align-items: center;
        text-align: center;

        .pet-image {
          width: 80px;
          height: 80px;
        }

        .pet-details .pet-header {
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
      }

      .card-actions {
        justify-content: center;
      }
    }
  }
}
</style>