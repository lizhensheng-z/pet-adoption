<template>
  <div class="applications">
    <div class="page-header">
      <h2>我的申请</h2>
      <p class="page-desc">查看和管理您的领养申请记录</p>
    </div>

    <!-- 筛选和排序 -->
    <div class="filter-bar">
      <el-select
        v-model="filterStatus"
        placeholder="全部状态"
        clearable
        style="width: 120px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select
        v-model="sortOrder"
        placeholder="排序方式"
        style="width: 120px; margin-left: 12px"
        @change="handleFilterChange"
      >
        <el-option label="最新" value="desc" />
        <el-option label="最早" value="asc" />
      </el-select>
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
                  <h3 @click="viewApplication(application.id)">{{ application.petName || '未知宠物' }}</h3>
                  <el-tag
                    :type="ApplicationStatusColor[application.status]"
                    effect="plain"
                    class="status-tag"
                  >
                    {{ ApplicationStatusMap[application.status] }}
                  </el-tag>
                </div>
                <p class="pet-breed">{{ application.petBreed || '未知品种' }}</p>
                <p class="organization">{{ application.orgName || '爱心救助站' }}</p>
                <p class="apply-time">
                  申请时间：{{ formatTime(application.submitTime) }}
                </p>
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
                v-if="canCancel(application.status)"
                type="danger"
                text
                @click="handleCancel(application)"
              >
                取消申请
              </el-button>
              <el-button
                v-if="application.status === 'APPROVED'"
                type="success"
                text
                @click="contactOrganization(application)"
              >
                联系机构
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
          <el-button type="primary" @click="goToPets">去领养宠物</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 取消申请弹窗 -->
    <el-dialog
      v-model="cancelDialogVisible"
      title="取消申请"
      width="500px"
    >
      <el-form :model="cancelForm" label-width="80px">
        <el-form-item label="取消原因">
          <el-input
            v-model="cancelForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请说明取消申请的原因..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="canceling"
          @click="confirmCancel"
        >
          确认取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { getApplications, cancelApplication } from '@/api/modules/application'
import { 
  ApplicationStatusMap, 
  ApplicationStatusColor 
} from '@/api/modules/application'

const router = useRouter()

const loading = ref(false)
const applications = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const filterStatus = ref('')
const sortOrder = ref('desc')

const cancelDialogVisible = ref(false)
const canceling = ref(false)
const cancelForm = reactive({
  reason: '',
  applicationId: null
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
      sort: sortOrder.value
    }
    
    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    const { data } = await getApplications(params)
    applications.value = data.records || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('获取申请列表失败')
    console.error('获取申请列表失败:', error)
  } finally {
    loading.value = false
  }
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

const viewApplication = (id) => {
  router.push(`/applications/${id}`)
}

const canCancel = (status) => {
  return ['SUBMITTED', 'UNDER_REVIEW'].includes(status)
}

const handleCancel = (application) => {
  cancelForm.applicationId = application.id
  cancelForm.reason = ''
  cancelDialogVisible.value = true
}

const confirmCancel = async () => {
  if (!cancelForm.reason.trim()) {
    ElMessage.warning('请填写取消原因')
    return
  }

  canceling.value = true
  try {
    await cancelApplication(cancelForm.applicationId, {
      reason: cancelForm.reason
    })
    
    ElMessage.success('申请已取消')
    cancelDialogVisible.value = false
    loadApplications()
  } catch (error) {
    ElMessage.error(error?.response?.data?.message || '取消申请失败')
    console.error('取消申请失败:', error)
  } finally {
    canceling.value = false
  }
}

const contactOrganization = (application) => {
  const phone = application.orgPhone || '400-123-4567'
  
  ElMessageBox.confirm(
    `机构电话：${phone}\n是否拨打电话联系机构？`,
    '联系机构',
    {
      confirmButtonText: '拨打电话',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    window.location.href = `tel:${phone}`
  }).catch(() => {})
}

const goToPets = () => {
  router.push('/pets')
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

onMounted(() => {
  loadApplications()
})
</script>

<style lang="scss" scoped>
.applications {
  max-width: 1000px;
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
    justify-content: flex-end;
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
        cursor: pointer;
        flex-shrink: 0;
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

        .pet-breed,
        .organization,
        .apply-time {
          margin: 4px 0;
          color: var(--el-text-color-regular);
          font-size: 14px;
        }

        .organization {
          color: var(--el-color-primary);
        }

        .apply-time {
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
    .applications {
      padding: 10px;
    }

    .filter-bar {
      justify-content: center;
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