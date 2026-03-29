<template>
  <div class="apply-pet">
    <div class="page-header">
      <el-button type="text" @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>申请领养</h2>
    </div>

    <div class="content-wrapper">
      <!-- 宠物信息卡片 -->
      <div class="pet-card" v-if="petInfo">
        <div class="pet-info">
          <el-image
            :src="petInfo.images?.[0] || '/default-pet.jpg'"
            :alt="petInfo.name"
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
            <h3>{{ petInfo.name }}</h3>
            <p class="pet-meta">
              {{ petInfo.age }}岁 · {{ petInfo.gender === 'MALE' ? '公' : '母' }} · {{ petInfo.breed }}
            </p>
            <p class="pet-status">
              {{ petInfo.isNeutered ? '已绝育' : '未绝育' }} · {{ petInfo.isVaccinated ? '已疫苗' : '未疫苗' }}
            </p>
            <p class="organization">
              发布机构：{{ petInfo.organization?.name || '爱心救助站' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 申请表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="apply-form"
        v-loading="loading"
      >
        <!-- 领养问卷 -->
        <div class="form-section">
          <h4>领养问卷</h4>
          <p class="section-desc">请认真回答以下问题，这将帮助我们更好地评估您的领养条件</p>

          <el-form-item label="居住环境" prop="questionnaire.housing">
            <el-radio-group v-model="form.questionnaire.housing">
              <el-radio value="自有住房">自有住房</el-radio>
              <el-radio value="租房">租房</el-radio>
              <el-radio value="其他">其他</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="养宠经验" prop="questionnaire.experience">
            <el-radio-group v-model="form.questionnaire.experience">
              <el-radio value="无经验">无经验</el-radio>
              <el-radio value="1-3年">1-3年</el-radio>
              <el-radio value="3年以上">3年以上</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="家庭成员" prop="questionnaire.familySize">
            <el-radio-group v-model="form.questionnaire.familySize">
              <el-radio value="1人">1人</el-radio>
              <el-radio value="2人">2人</el-radio>
              <el-radio value="3人">3人</el-radio>
              <el-radio value="4人及以上">4人及以上</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="陪伴时间" prop="questionnaire.dailyTime">
            <el-radio-group v-model="form.questionnaire.dailyTime">
              <el-radio value="1-2小时">1-2小时</el-radio>
              <el-radio value="3-4小时">3-4小时</el-radio>
              <el-radio value="5-6小时">5-6小时</el-radio>
              <el-radio value="6小时以上">6小时以上</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="每月预算" prop="questionnaire.monthlyBudget">
            <el-radio-group v-model="form.questionnaire.monthlyBudget">
              <el-radio value="500以下">500以下</el-radio>
              <el-radio value="500-1000">500-1000</el-radio>
              <el-radio value="1000-2000">1000-2000</el-radio>
              <el-radio value="2000以上">2000以上</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="疫苗计划" prop="questionnaire.vaccinationPlan">
            <el-radio-group v-model="form.questionnaire.vaccinationPlan">
              <el-radio value="会按时接种">会按时接种</el-radio>
              <el-radio value="暂不确定">暂不确定</el-radio>
              <el-radio value="不打算接种">不打算接种</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="应急处理" prop="questionnaire.emergencyPlan">
            <el-input
              v-model="form.questionnaire.emergencyPlan"
              type="textarea"
              :rows="3"
              placeholder="请描述如果宠物生病或遇到紧急情况，您会如何处理？"
            />
          </el-form-item>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            @click="submitForm"
            :loading="submitting"
            class="submit-btn"
          >
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Picture } from '@element-plus/icons-vue'
import { submitApplication } from '@/api/modules/application'
import { petAPI } from '@/api/modules/pet'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const petInfo = ref(null)

const form = reactive({
  petId: '',
  questionnaire: {
    housing: '',
    experience: '',
    familySize: '',
    dailyTime: '',
    monthlyBudget: '',
    vaccinationPlan: '',
    emergencyPlan: ''
  }
})

const rules = {
  questionnaire: {
    housing: [
      { required: true, message: '请选择居住环境', trigger: 'change' }
    ],
    experience: [
      { required: true, message: '请选择养宠经验', trigger: 'change' }
    ],
    familySize: [
      { required: true, message: '请选择家庭成员数量', trigger: 'change' }
    ],
    dailyTime: [
      { required: true, message: '请选择每日陪伴时间', trigger: 'change' }
    ],
    monthlyBudget: [
      { required: true, message: '请选择每月预算', trigger: 'change' }
    ],
    vaccinationPlan: [
      { required: true, message: '请选择疫苗接种计划', trigger: 'change' }
    ],
    emergencyPlan: [
      { required: true, message: '请填写紧急情况处理方案', trigger: 'blur' },
      { min: 5, message: '请详细描述处理方案', trigger: 'blur' }
    ]
  }
}

const goBack = () => {
  router.back()
}

const loadPetDetail = async () => {
  const petId = route.params.petId
  if (!petId) {
    ElMessage.error('宠物ID不存在')
    router.push('/')
    return
  }

  loading.value = true
  try {
    const { data } = await petAPI.getPetDetail(petId)
    petInfo.value = data
    form.petId = petId
  } catch (error) {
    ElMessage.error('获取宠物信息失败')
    console.error('获取宠物信息失败:', error)
  } finally {
    loading.value = false
  }
}

  const submitForm = async () => {
  if (!formRef.value) return

  // 先进行表单验证
  formRef.value.validate(async (valid, fields) => {
    if (!valid) {
      // 表单验证失败，显示具体错误
      if (fields) {
        const firstError = Object.values(fields)[0][0]
        ElMessage.error(firstError.message || '请完善表单信息后再提交')
      }
      return
    }

    try {
      await ElMessageBox.confirm(
        '请确认您填写的信息真实有效，提交后将进入审核流程',
        '确认提交',
        {
          confirmButtonText: '确认提交',
          cancelButtonText: '再检查一下',
          type: 'info'
        }
      )

      submitting.value = true
      await submitApplication(form)
      
      ElMessage.success('申请提交成功！')
      router.push('/applications')
    } catch (error) {
      if (error !== 'cancel') {
        // 处理后端返回的错误
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors
          const errorMessages = Object.values(errors).flat()
          ElMessage.error(errorMessages[0] || '提交失败，请检查表单')
        } else if (error?.response?.data?.message) {
          ElMessage.error(error.response.data.message)
        } else {
          ElMessage.error('提交失败，请重试')
        }
        console.error('提交申请失败:', error)
      }
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  loadPetDetail()
})
</script>

<style lang="scss" scoped>
.apply-pet {
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

  .pet-card {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .pet-info {
      display: flex;
      gap: 20px;

      .pet-image {
        width: 120px;
        height: 120px;
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
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          color: var(--el-text-color-primary);
        }

        .pet-meta,
        .pet-status,
        .organization {
          margin: 4px 0;
          color: var(--el-text-color-regular);
          font-size: 14px;
        }

        .organization {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .apply-form {
    padding: 20px;

    .form-section {
      margin-bottom: 30px;

      h4 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: var(--el-text-color-primary);
        border-left: 4px solid var(--el-color-primary);
        padding-left: 12px;
      }

      .section-desc {
        margin: -8px 0 16px 0;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }

    .submit-btn {
      width: 200px;
      margin: 0 auto;
      display: block;
    }
  }

  @media (max-width: 768px) {
    .apply-pet {
      padding: 10px;
    }

    .pet-card .pet-info {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .pet-image {
        width: 100px;
        height: 100px;
      }
    }

    .apply-form {
      padding: 15px;
    }
  }
}
</style>