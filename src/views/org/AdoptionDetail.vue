<template>
  <div class="org-adoption-detail">
    <div class="page-header">
      <el-button type="text" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h2>申请详情审核</h2>
    </div>

    <div v-loading="loading" class="detail-content">
      <template v-if="application">
        <!-- 申请状态进度条 -->
        <div class="status-progress">
          <el-steps :active="getCurrentStep" finish-status="success" align-center>
            <el-step title="提交申请" :description="formatTime(application.submitTime)" />
            <el-step title="机构审核" :description="getStepDescription('UNDER_REVIEW')" />
            <el-step title="约见面谈" :description="getStepDescription('INTERVIEW')" />
            <el-step title="家访调查" :description="getStepDescription('HOME_VISIT')" />
            <el-step title="最终审核" :description="getStepDescription('APPROVED')" />
          </el-steps>
        </div>

        <div class="detail-grid">
          <!-- 左侧：申请信息 -->
          <div class="left-panel">
            <!-- 宠物信息卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h3>宠物信息</h3>
                <el-tag :type="OrgApplicationStatusColor[application.status]" effect="dark">
                  {{ OrgApplicationStatusMap[application.status] }}
                </el-tag>
              </div>
              <div class="pet-info">
                <el-image
                  :src="application.petCoverUrl || '/default-pet.jpg'"
                  :alt="application.petName"
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
                  <h4>{{ application.petName }}</h4>
                  <p class="pet-breed">{{ application.petBreed }}</p>
                  <p class="pet-species">{{ application.petSpecies === 'DOG' ? '狗狗' : '猫咪' }}</p>
                </div>
              </div>
            </div>

            <!-- 申请人信息卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h3>申请人信息</h3>
              </div>
              <div class="applicant-info">
                <div class="info-item">
                  <span class="label">姓名：</span>
                  <span class="value">{{ application.userName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">电话：</span>
                  <span class="value">{{ application.userPhone }}</span>
                  <el-button
                    type="text"
                    size="small"
                    @click="callPhone(application.userPhone)"
                  >
                    <el-icon><Phone /></el-icon>
                    拨打
                  </el-button>
                </div>
                <div class="info-item">
                  <span class="label">邮箱：</span>
                  <span class="value">{{ application.userEmail }}</span>
                </div>
                <div class="info-item">
                  <span class="label">提交时间：</span>
                  <span class="value">{{ formatTime(application.submitTime) }}</span>
                </div>
              </div>
            </div>

            <!-- 申请理由卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h3>申请理由</h3>
              </div>
              <div class="application-reason">
                {{ application.reason || '申请人未填写申请理由' }}
              </div>
            </div>

            <!-- 问卷回答卡片 -->
            <div class="info-card">
              <div class="card-header">
                <h3>领养问卷</h3>
              </div>
              <div class="questionnaire">
                <div class="question-item">
                  <div class="question">1. 您的居住环境？</div>
                  <div class="answer">{{ application.questionnaire?.housing || '未回答' }}</div>
                </div>
                <div class="question-item">
                  <div class="question">2. 养宠经验？</div>
                  <div class="answer">{{ application.questionnaire?.experience || '未回答' }}</div>
                </div>
                <div class="question-item">
                  <div class="question">3. 家庭成员数量？</div>
                  <div class="answer">{{ application.questionnaire?.familySize || '未回答' }}</div>
                </div>
                <div class="question-item">
                  <div class="question">4. 每日陪伴时间？</div>
                  <div class="answer">{{ application.questionnaire?.dailyTime || '未回答' }}</div>
                </div>
                <div class="question-item">
                  <div class="question">5. 每月预算？</div>
                  <div class="answer">{{ application.questionnaire?.monthlyBudget || '未回答' }}</div>
                </div>
                <div class="question-item">
                  <div class="question">6. 疫苗接种计划？</div>
                  <div class="answer">{{ application.questionnaire?.vaccinationPlan || '未回答' }}</div>
                </div>
                <div class="question-item">
                  <div class="question">7. 紧急情况处理？</div>
                  <div class="answer">{{ application.questionnaire?.emergencyPlan || '未回答' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：审核操作 -->
          <div class="right-panel">
            <!-- 审核记录 -->
            <div class="info-card">
              <div class="card-header">
                <h3>审核记录</h3>
              </div>
              <div class="audit-records">
                <template v-if="auditRecords.length > 0">
                  <div
                    v-for="record in auditRecords"
                    :key="record.id"
                    class="record-item"
                  >
                    <div class="record-time">{{ formatTime(record.createdAt) }}</div>
                    <div class="record-content">
                      <div class="record-action">{{ record.action }}</div>
                      <div class="record-note" v-if="record.note">{{ record.note }}</div>
                    </div>
                  </div>
                </template>
                <div v-else class="no-records">
                  暂无审核记录
                </div>
              </div>
            </div>

            <!-- 审核操作 -->
            <div class="info-card" v-if="application.canModify">
              <div class="card-header">
                <h3>审核操作</h3>
              </div>
              <div class="audit-actions">
                <el-form
                  ref="auditFormRef"
                  :model="auditForm"
                  :rules="auditRules"
                  label-width="80px"
                >
                  <el-form-item label="操作" prop="action">
                    <el-select v-model="auditForm.action" placeholder="选择操作">
                      <el-option
                        v-for="action in availableActions"
                        :key="action.value"
                        :label="action.label"
                        :value="action.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="备注" prop="note">
                    <el-input
                      v-model="auditForm.note"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入审核备注..."
                      maxlength="500"
                      show-word-limit
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button
                      type="primary"
                      :loading="submitting"
                      @click="submitAudit"
                    >
                      提交审核
                    </el-button>
                    <el-button @click="resetForm">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 审核结果 -->
            <div class="info-card" v-if="application.status === 'APPROVED' || application.status === 'REJECTED'">
              <div class="card-header">
                <h3>审核结果</h3>
              </div>
              <div class="audit-result">
                <div class="result-status">
                  <el-tag
                    :type="application.status === 'APPROVED' ? 'success' : 'danger'"
                    effect="dark"
                    size="large"
                  >
                    {{ application.status === 'APPROVED' ? '已通过' : '已拒绝' }}
                  </el-tag>
                </div>
                <div class="result-time" v-if="application.decidedTime">
                  审核时间：{{ formatTime(application.decidedTime) }}
                </div>
                <div class="result-note" v-if="application.orgRemark">
                  机构备注：{{ application.orgRemark }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-else class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Picture, Phone } from '@element-plus/icons-vue'
import {
  getOrgApplicationDetail,
  auditApplication,
  getAuditRecords,
  OrgApplicationStatusMap,
  OrgApplicationStatusColor
} from '@/api/modules/org-adoption'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const application = ref(null)
const auditRecords = ref([])

const auditForm = reactive({
  action: '',
  note: ''
})

const auditRules = {
  action: [
    { required: true, message: '请选择审核操作', trigger: 'change' }
  ],
  note: [
    { required: true, message: '请输入审核备注', trigger: 'blur' },
    { min: 5, max: 500, message: '备注长度在 5-500 个字符之间', trigger: 'blur' }
  ]
}

const auditFormRef = ref()

const availableActions = computed(() => {
  if (!application.value) return []
  
  const status = application.value.status
  const actions = []
  
  switch (status) {
    case 'SUBMITTED':
      actions.push(
        { value: 'UNDER_REVIEW', label: '开始审核' },
        { value: 'REJECTED', label: '直接拒绝' }
      )
      break
    case 'UNDER_REVIEW':
      actions.push(
        { value: 'INTERVIEW', label: '约见面谈' },
        { value: 'REJECTED', label: '拒绝申请' }
      )
      break
    case 'INTERVIEW':
      actions.push(
        { value: 'HOME_VISIT', label: '安排家访' },
        { value: 'REJECTED', label: '拒绝申请' }
      )
      break
    case 'HOME_VISIT':
      actions.push(
        { value: 'APPROVED', label: '通过申请' },
        { value: 'REJECTED', label: '拒绝申请' }
      )
      break
  }
  
  return actions
})

const getCurrentStep = computed(() => {
  if (!application.value) return 0
  
  const status = application.value.status
  const stepMap = {
    'SUBMITTED': 1,
    'UNDER_REVIEW': 2,
    'INTERVIEW': 3,
    'HOME_VISIT': 4,
    'APPROVED': 5,
    'REJECTED': 5
  }
  
  return stepMap[status] || 0
})

const loadApplicationDetail = async () => {
  loading.value = true
  try {
    const { data } = await getOrgApplicationDetail(route.params.id)
    application.value = data
    await loadAuditRecords()
  } catch (error) {
    ElMessage.error('获取申请详情失败')
    console.error('获取申请详情失败:', error)
  } finally {
    loading.value = false
  }
}

const loadAuditRecords = async () => {
  try {
    const { data } = await getAuditRecords(route.params.id)
    auditRecords.value = data || []
  } catch (error) {
    console.error('获取审核记录失败:', error)
  }
}

const submitAudit = async () => {
  if (!auditFormRef.value) return
  
  try {
    await auditFormRef.value.validate()
    
    await ElMessageBox.confirm(
      `确定要${getActionLabel(auditForm.action)}该申请吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    submitting.value = true
    
    await auditApplication(route.params.id, {
      action: auditForm.action,
      note: auditForm.note
    })
    
    ElMessage.success('审核操作成功')
    await loadApplicationDetail()
    resetForm()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核操作失败')
      console.error('审核操作失败:', error)
    }
  } finally {
    submitting.value = false
  }
}

const getActionLabel = (action) => {
  const actionMap = {
    'UNDER_REVIEW': '开始审核',
    'INTERVIEW': '约见面谈',
    'HOME_VISIT': '安排家访',
    'APPROVED': '通过申请',
    'REJECTED': '拒绝申请'
  }
  return actionMap[action] || action
}

const getStepDescription = (step) => {
  if (!application.value) return ''
  
  const records = auditRecords.value.filter(record => 
    record.action === step
  )
  
  if (records.length > 0) {
    return formatTime(records[0].createdAt)
  }
  
  return ''
}

const resetForm = () => {
  auditForm.action = ''
  auditForm.note = ''
  auditFormRef.value?.resetFields()
}

const goBack = () => {
  router.push('/org/adoptions')
}

const callPhone = (phone) => {
  if (phone) {
    window.location.href = `tel:${phone}`
  }
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
  loadApplicationDetail()
})
</script>

<style lang="scss" scoped>
.org-adoption-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .page-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: var(--el-text-color-primary);
    }
  }

  .status-progress {
    background: white;
    border-radius: 8px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .info-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin: 0;
        font-size: 18px;
        color: var(--el-text-color-primary);
      }
    }

    .pet-info {
      display: flex;
      gap: 16px;
      align-items: center;

      .pet-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
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
        h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: var(--el-text-color-primary);
        }

        .pet-breed,
        .pet-species {
          margin: 4px 0;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
      }
    }

    .applicant-info {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .label {
          color: var(--el-text-color-secondary);
          margin-right: 8px;
          min-width: 80px;
        }

        .value {
          color: var(--el-text-color-primary);
          flex: 1;
        }
      }
    }

    .application-reason {
      color: var(--el-text-color-primary);
      line-height: 1.6;
      padding: 12px;
      background: var(--el-fill-color-lighter);
      border-radius: 4px;
    }

    .questionnaire {
      .question-item {
        margin-bottom: 16px;

        .question {
          font-weight: bold;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .answer {
          color: var(--el-text-color-regular);
          padding: 8px 12px;
          background: var(--el-fill-color-lighter);
          border-radius: 4px;
        }
      }
    }

    .audit-records {
      .record-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .record-time {
          color: var(--el-text-color-secondary);
          font-size: 12px;
          min-width: 120px;
        }

        .record-content {
          flex: 1;

          .record-action {
            font-weight: bold;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
          }

          .record-note {
            color: var(--el-text-color-regular);
            font-size: 14px;
          }
        }
      }

      .no-records {
        text-align: center;
        color: var(--el-text-color-secondary);
        padding: 20px;
      }
    }

    .audit-actions {
      .el-form {
        .el-form-item:last-child {
          margin-bottom: 0;
        }
      }
    }

    .audit-result {
      text-align: center;

      .result-status {
        margin-bottom: 16px;
      }

      .result-time,
      .result-note {
        color: var(--el-text-color-regular);
        margin-bottom: 8px;
      }
    }
  }

  .loading-state {
    text-align: center;
    padding: 60px 0;
  }

  @media (max-width: 768px) {
    .org-adoption-detail {
      padding: 10px;
    }

    .status-progress {
      padding: 20px;
    }

    .info-card {
      padding: 16px;
    }
  }
}
</style>