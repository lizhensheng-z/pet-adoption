<template>
  <div class="application-detail">
    <div class="page-header">
      <el-button type="text" @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>申请详情</h2>
    </div>

    <div class="content-wrapper" v-loading="loading">
      <template v-if="application">
        <!-- 宠物信息 -->
        <div class="section-card">
          <h3>宠物信息</h3>
          <div class="pet-info">
            <el-image
              :src="application.pet?.images?.[0] || '/default-pet.jpg'"
              :alt="application.pet?.name"
              class="pet-image"
              fit="cover"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="pet-details">
              <div class="pet-header">
                <h4>{{ application.petName || '未知宠物' }}</h4>
                <el-tag
                  :type="ApplicationStatusColor[application.status]"
                  effect="dark"
                  class="status-tag"
                >
                  {{ ApplicationStatusMap[application.status] }}
                </el-tag>
              </div>
              <div class="pet-meta">
                <span>{{ application.petBreed || '未知品种' }}</span>
                <span>{{ application.petSpecies === 'DOG' ? '狗狗' : application.petSpecies === 'CAT' ? '猫咪' : '其他' }}</span>
              </div>
              <div class="organization-info">
                <p><strong>发布机构：</strong>{{ application.orgName || '爱心救助站' }}</p>
                <p><strong>联系电话：</strong>{{ application.orgPhone || '400-123-4567' }}</p>
                <p><strong>机构地址：</strong>{{ application.orgAddress || '暂无地址信息' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 申请信息 -->
        <div class="section-card">
          <h3>申请信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>提交时间：</label>
              <p>{{ formatTime(application.submitTime) }}</p>
            </div>
            <div class="info-item" v-if="application.status === 'SUBMITTED'">
              <label>预计审核：</label>
              <p>3个工作日内完成审核</p>
            </div>
          </div>
        </div>

        <!-- 问卷回答 -->
        <div class="section-card" v-if="application.questionnaire">
          <h3>问卷回答</h3>
          <div class="questionnaire">
            <div class="qa-item" v-for="(item, index) in questionnaireItems" :key="index">
              <div class="question">
                <span class="q-label">Q{{ index + 1 }}：</span>
                {{ item.question }}
              </div>
              <div class="answer">
                <span class="a-label">A：</span>
                {{ application.questionnaire[item.key] || '未回答' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 审核信息 -->
        <div class="section-card" v-if="hasReviewInfo">
          <h3>审核信息</h3>
          <div class="review-info">
            <div class="info-item">
              <label>审核结果：</label>
              <el-tag
                :type="ApplicationStatusColor[application.status]"
                effect="plain"
              >
                {{ ApplicationStatusMap[application.status] }}
              </el-tag>
            </div>
            <div class="info-item" v-if="application.decidedTime">
              <label>审核时间：</label>
              <p>{{ formatTime(application.decidedTime) }}</p>
            </div>
            <div class="info-item" v-if="application.orgRemark">
              <label>机构备注：</label>
              <p>{{ application.orgRemark }}</p>
            </div>
            <div class="info-item" v-if="application.status === 'REJECTED' && application.rejectReason">
              <label>拒绝原因：</label>
              <p class="rejection-reason">{{ application.rejectReason }}</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-button @click="goBack">返回列表</el-button>
          <el-button
            v-if="application.canCancel"
            type="danger"
            @click="handleCancel"
          >
            取消申请
          </el-button>
          <el-button
            v-if="application.status === 'APPROVED'"
            type="primary"
            @click="contactOrganization"
          >
            联系机构
          </el-button>
        </div>
      </template>

      <!-- 加载失败 -->
      <div v-else-if="!loading" class="error-state">
        <el-empty
          image="/error.svg"
          :image-size="200"
          description="获取申请详情失败"
        >
          <el-button type="primary" @click="loadApplication">重新加载</el-button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Picture } from '@element-plus/icons-vue'
import { getApplicationDetail, cancelApplication } from '@/api/modules/application'
import { 
  ApplicationStatusMap, 
  ApplicationStatusColor 
} from '@/api/modules/application'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const application = ref(null)

const cancelDialogVisible = ref(false)
const canceling = ref(false)
const cancelForm = reactive({
  reason: ''
})

const questionnaireItems = [
  { key: 'housing', question: '您的居住环境？' },
  { key: 'experience', question: '您的养宠经验？' },
  { key: 'familySize', question: '您的家庭成员数量？' },
  { key: 'dailyTime', question: '您每日能陪伴宠物的时间？' },
  { key: 'monthlyBudget', question: '您每月的养宠预算？' },
  { key: 'vaccinationPlan', question: '您对宠物疫苗接种的计划？' },
  { key: 'emergencyPlan', question: '遇到紧急情况时，您会如何处理？' }
]

const hasReviewInfo = computed(() => {
  return application.value && 
    (application.value.reviewedAt || 
     application.value.reviewNotes || 
     application.value.rejectionReason ||
     !['SUBMITTED', 'UNDER_REVIEW'].includes(application.value.status))
})

const goBack = () => {
  router.back()
}

const loadApplication = async () => {
  const id = route.params.id
  if (!id) {
    ElMessage.error('申请ID不存在')
    router.push('/applications')
    return
  }

  loading.value = true
  try {
    const { data } = await getApplicationDetail(id)
    application.value = data
  } catch (error) {
    ElMessage.error('获取申请详情失败')
    console.error('获取申请详情失败:', error)
  } finally {
    loading.value = false
  }
}

const maskContactInfo = (contact) => {
  if (!contact) return '暂无'
  
  // 如果是手机号，脱敏显示
  const phoneRegex = /^1[3-9]\d{9}$/
  if (phoneRegex.test(contact)) {
    return contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  
  return contact
}

// 保留这个函数用于兼容性，但主要使用后端返回的 canCancel 字段

const handleCancel = () => {
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
    await cancelApplication(application.value.id, {
      reason: cancelForm.reason
    })
    
    ElMessage.success('申请已取消')
    cancelDialogVisible.value = false
    loadApplication()
  } catch (error) {
    ElMessage.error(error?.response?.data?.message || '取消申请失败')
    console.error('取消申请失败:', error)
  } finally {
    canceling.value = false
  }
}

const contactOrganization = () => {
  const phone = application.value.orgPhone || '400-123-4567'
  
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

const formatTime = (time) => {
  if (!time) return '暂无'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  loadApplication()
})
</script>

<style lang="scss" scoped>
.application-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .back-btn {
      margin-right: 20px;
      color: var(--el-color-primary);
    }

    h2 {
      margin: 0;
      font-size: 24px;
      color: var(--el-text-color-primary);
    }
  }

  .content-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .section-card {
    padding: 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }

    h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
      border-left: 4px solid var(--el-color-primary);
      padding-left: 12px;
    }
  }

  .pet-info {
    display: flex;
    gap: 20px;

    .pet-image {
      width: 150px;
      height: 150px;
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
        margin-bottom: 12px;

        h4 {
          margin: 0;
          font-size: 20px;
          color: var(--el-text-color-primary);
        }

        .status-tag {
          font-size: 14px;
        }
      }

      .pet-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 12px;
        color: var(--el-text-color-regular);
        font-size: 14px;
      }

      .organization-info {
        p {
          margin: 4px 0;
          color: var(--el-text-color-regular);
          font-size: 14px;
        }
      }
    }
  }

  .info-grid {
    .info-item {
      margin-bottom: 16px;

      label {
        font-weight: 600;
        color: var(--el-text-color-primary);
        display: block;
        margin-bottom: 4px;
      }

      p {
        margin: 0;
        color: var(--el-text-color-regular);
        line-height: 1.6;
      }

      .rejection-reason {
        color: var(--el-color-danger);
        background: var(--el-color-danger-light-9);
        padding: 8px 12px;
        border-radius: 4px;
        border-left: 3px solid var(--el-color-danger);
      }
    }
  }

  .questionnaire {
    .qa-item {
      margin-bottom: 20px;
      padding: 16px;
      background: var(--el-fill-color-lighter);
      border-radius: 8px;

      .question {
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 8px;
        display: flex;
        align-items: flex-start;

        .q-label {
          color: var(--el-color-primary);
          margin-right: 8px;
          flex-shrink: 0;
        }
      }

      .answer {
        color: var(--el-text-color-regular);
        line-height: 1.6;
        display: flex;
        align-items: flex-start;

        .a-label {
          color: var(--el-color-success);
          margin-right: 8px;
          font-weight: 600;
          flex-shrink: 0;
        }
      }
    }
  }

  .actions {
    padding: 24px;
    display: flex;
    gap: 12px;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .error-state {
    padding: 60px 0;
    text-align: center;
  }

  @media (max-width: 768px) {
    .application-detail {
      padding: 10px;
    }

    .section-card {
      padding: 16px;
    }

    .pet-info {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .pet-image {
        width: 120px;
        height: 120px;
      }

      .pet-details .pet-header {
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .pet-meta {
        justify-content: center;
      }
    }

    .actions {
      flex-direction: column;
      align-items: center;

      .el-button {
        width: 100%;
        max-width: 200px;
      }
    }
  }
}
</style>