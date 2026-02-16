<template>
  <div class="pet-create-container">
    <!-- 装饰性背景光晕 -->
    <div class="bg-glow-1"></div>
    <div class="bg-glow-2"></div>

    <PageHeader title="发布新成员" class="modern-header">
      <template #actions>
        <div class="header-action-group">
          <el-button class="glass-btn" @click="handleSaveDraft" :loading="submitting" :disabled="!canSave">
            保存草稿
          </el-button>
          <el-button class="glass-btn" @click="handlePreview" :disabled="!petId">
            预览
          </el-button>
          <el-button type="primary" class="gradient-btn" @click="handleSubmit" :loading="submitting" :disabled="!canSubmit">
            提交审核
          </el-button>
        </div>
      </template>
    </PageHeader>

    <div class="pet-create-content">
      <!-- 科技感步骤指示器 -->
      <div class="steps-wrapper">
        <el-steps :active="currentStep" align-center class="custom-steps">
          <el-step title="基本信息" />
          <el-step title="健康状况" />
          <el-step title="性格特征" />
          <el-step title="领养要求" />
        </el-steps>
      </div>

      <div class="form-glass-card">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" class="pet-form" label-position="top">
          <!-- 步骤1: 基本信息 -->
          <Transition name="fade-slide">
            <div v-show="currentStep === 1" class="step-content">
              <h2 class="section-title">🐾 基本档案</h2>
              
              <el-form-item label="宠物名称" prop="name" class="custom-form-item">
                <el-input v-model="formData.name" placeholder="给它起个响亮的名字" maxlength="64" show-word-limit />
              </el-form-item>

              <div class="form-row-grid">
                <el-form-item label="物种" prop="species" class="custom-form-item">
                  <el-radio-group v-model="formData.species" class="pill-radio">
                    <el-radio-button label="CAT">猫咪</el-radio-button>
                    <el-radio-button label="DOG">狗狗</el-radio-button>
                    <el-radio-button label="OTHER">其他</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="性别" prop="gender" class="custom-form-item">
                  <el-radio-group v-model="formData.gender" class="pill-radio">
                    <el-radio-button label="MALE">男孩</el-radio-button>
                    <el-radio-button label="FEMALE">女孩</el-radio-button>
                    <el-radio-button label="UNKNOWN">未知</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>

              <div class="form-row-grid">
                <el-form-item label="品种" prop="breed" class="custom-form-item">
                  <el-input v-model="formData.breed" placeholder="例如：英国短毛猫" />
                </el-form-item>
                <el-form-item label="毛色" prop="color" class="custom-form-item">
                  <el-input v-model="formData.color" placeholder="例如：橘白相间" />
                </el-form-item>
              </div>

              <!-- 优化后的年龄选择器 -->
              <el-form-item label="估计年龄" class="custom-form-item">
                <div class="modern-age-picker">
                  <div class="age-block">
                    <el-input-number v-model="formData.ageYears" :min="0" :max="30" controls-position="right" />
                    <span class="age-unit">岁</span>
                  </div>
                  <div class="age-separator"></div>
                  <div class="age-block">
                    <el-input-number v-model="formData.ageMonths" :min="0" :max="11" controls-position="right" />
                    <span class="age-unit">个月</span>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="所在位置" class="custom-form-item">
                <el-input v-model="formData.location.address" readonly class="location-input-styled">
                  <template #append>
                    <el-button @click="handleEditLocation">
                      <el-icon><Location /></el-icon> 获取位置
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>

              <!-- 优化后的照片上传区域 -->
              <el-form-item label="美照上传" class="custom-form-item">
                <div class="modern-uploader-container">
                  <div class="uploader-header">
                    <span class="hint">第一张将默认作为头像，建议上传 3 张以上</span>
                  </div>
                  <MediaUploader
                    :media-list="mediaList"
                    @upload="handleUploadImage"
                    @remove="handleRemoveMedia"
                    @set-cover="handleSetCover"
                  />
                </div>
              </el-form-item>
            </div>
          </Transition>

          <!-- 步骤2/3/4 ... 保持原样 -->
          <Transition name="fade-slide">
            <div v-show="currentStep === 2" class="step-content">
              <h2 class="section-title">🏥 健康档案</h2>
              <el-form-item label="医疗状态">
                <el-checkbox-group v-model="healthStatusList" class="modern-checkbox">
                  <el-checkbox-button label="已绝育" />
                  <el-checkbox-button label="已疫苗" />
                  <el-checkbox-button label="已驱虫" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="详细健康描述">
                <el-input v-model="formData.health.healthDesc" type="textarea" :rows="6" placeholder="描述病情、饮食习惯等..." />
              </el-form-item>
            </div>
          </Transition>

          <Transition name="fade-slide">
            <div v-show="currentStep === 3" class="step-content">
              <h2 class="section-title">🌟 性格名片</h2>
              <el-form-item label="性格描述">
                <el-input v-model="formData.personality.desc" type="textarea" :rows="6" placeholder="分享一些它的逗趣故事吧..." />
              </el-form-item>
              <el-form-item label="特征标签">
                <TagSelector :tag-list="tagList" :selected="formData.personality.tags" @toggle="handleToggleTag" />
              </el-form-item>
            </div>
          </Transition>

          <Transition name="fade-slide">
            <div v-show="currentStep === 4" class="step-content">
              <h2 class="section-title">🏠 领养契约</h2>
              <el-form-item label="领养要求">
                <el-input v-model="formData.adoptRequirements" type="textarea" :rows="10" placeholder="写下你对新家长的期待..." />
              </el-form-item>
            </div>
          </Transition>
        </el-form>
      </div>

      <!-- 底部控制 -->
      <div class="sticky-actions">
        <el-button v-if="currentStep > 1" round class="nav-btn" @click="handlePrevStep">上一步</el-button>
        <el-button v-if="currentStep < 4" type="primary" round class="nav-btn next" @click="handleNextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Location } from '@element-plus/icons-vue'
import { locationService, MapUtils } from '@/utils/map.js'
import PageHeader from '@/components/common/PageHeader.vue'
import MediaUploader from '@/components/org/MediaUploader.vue'
import TagSelector from '@/components/org/TagSelector.vue'
import { orgAPI } from '@/api/modules/org.js'
import { uploadPetPhoto } from '@/api/modules/upload.js'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = ref({
  name: '',
  species: 'CAT',
  breed: '',
  ageYears: 0,
  ageMonths: 0,
  gender: 'UNKNOWN',
  size: 'M',
  color: '',
  location: {
    address: '',
    city: '',
    district: '',
    lng: null,
    lat: null
  },
  health: {
    sterilized: false,
    vaccinated: false,
    dewormed: false,
    healthDesc: ''
  },
  personality: {
    desc: '',
    tags: []
  },
  adoptRequirements: ''
})

// 健康状态列表
const healthStatusList = computed({
  get() {
    const list = []
    if (formData.value.health.sterilized) list.push('已绝育')
    if (formData.value.health.vaccinated) list.push('已疫苗')
    if (formData.value.health.dewormed) list.push('已驱虫')
    return list
  },
  set(value) {
    formData.value.health.sterilized = value.includes('已绝育')
    formData.value.health.vaccinated = value.includes('已疫苗')
    formData.value.health.dewormed = value.includes('已驱虫')
  }
})

// 图片/视频列表
const mediaList = ref([])

// 页面状态
const loading = ref(false)
const submitting = ref(false)
const currentStep = ref(1)
const petId = ref(null)

// 标签列表
const tagList = ref([])
const orgInfo = ref(null)

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入宠物名称', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在1-64个字符', trigger: 'blur' }
  ],
  species: [
    { required: true, message: '请选择物种', trigger: 'change' }
  ],
  breed: [
    { required: true, message: '请输入品种', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  size: [
    { required: true, message: '请选择体型', trigger: 'change' }
  ],
  color: [
    { required: true, message: '请输入毛色', trigger: 'blur' }
  ]
}

// 计算属性
const ageMonth = computed(() => {
  return formData.value.ageYears * 12 + formData.value.ageMonths
})

const hasCoverImage = computed(() => {
  return mediaList.value.some(m => m.isCover && m.mediaType === 'IMAGE')
})

const imageCount = computed(() => {
  return mediaList.value.filter(m => m.mediaType === 'IMAGE').length
})

const canSave = computed(() => {
  return formData.value.name && formData.value.breed
})

const canSubmit = computed(() => {
  // 必须有封面图
  if (!hasCoverImage.value) return false
  // 图片数量2-9张（建议3-9张）
  if (imageCount.value < 2 || imageCount.value > 9) return false
  // 基本信息必填
  if (!formData.value.name || !formData.value.breed) return false
  return true
})

// 加载机构信息
const loadOrgInfo = async () => {
  try {
    const response = await orgAPI.getOrgProfile()
    orgInfo.value = response.data

    // 设置默认地理位置
    if (orgInfo.value.lng && orgInfo.value.lat) {
      formData.value.location = {
        address: orgInfo.value.address || '',
        city: orgInfo.value.city || '',
        district: orgInfo.value.district || '',
        lng: orgInfo.value.lng,
        lat: orgInfo.value.lat
      }
    }
  } catch (error) {
    console.error('加载机构信息失败:', error)
  }
}

// 加载标签列表
const loadTagList = async () => {
  try {
    const response = await orgAPI.getTagList({ enabled: 1 })
    tagList.value = response.data.list || []
  } catch (error) {
    console.error('加载标签列表失败:', error)
  }
}

// 上传图片
const handleUploadImage = async (file) => {
  if (imageCount.value >= 9) {
    ElMessage.warning('最多只能上传9张图片')
    return
  }

  const media = {
    url: '',
    mediaType: 'IMAGE',
    sort: mediaList.value.length,
    isCover: !hasCoverImage.value,
    isUploading: true,
    uploadProgress: 0
  }

  mediaList.value.push(media)

  try {
    // 步骤1: 使用公共上传接口上传文件
    const uploadResponse = await uploadPetPhoto(file, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        media.uploadProgress = percentCompleted
      }
    })

    media.url = uploadResponse.data.url
    media.isUploading = false
    media.uploadProgress = 100

    // 步骤2: 如果已有宠物ID,保存媒体关联信息
    if (petId.value) {
      const mediaResponse = await orgAPI.savePetMedia(petId.value, {
        url: media.url,
        mediaType: 'IMAGE',
        sort: media.sort
      })
      media.id = mediaResponse.data.id
    }

    ElMessage.success('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败,请重试')
    // 从列表中移除失败的媒体
    const index = mediaList.value.indexOf(media)
    if (index > -1) {
      mediaList.value.splice(index, 1)
    }
  }
}

// 删除媒体
const handleRemoveMedia = async (index) => {
  const media = mediaList.value[index]

  // 如果是已上传的媒体,调用删除接口
  if (media.id && petId.value) {
    try {
      await orgAPI.deletePetMedia(petId.value, media.id)
    } catch (error) {
      console.error('删除媒体失败:', error)
      return
    }
  }

  // 从列表中移除
  mediaList.value.splice(index, 1)

  // 如果删除的是封面图,设置第一张为封面
  if (media.isCover && mediaList.value.length > 0) {
    mediaList.value[0].isCover = true
  }
}

// 设置封面图
const handleSetCover = (index) => {
  mediaList.value.forEach((media, i) => {
    media.isCover = i === index
  })
}

// 修改位置
const handleEditLocation = async () => {
  try {
    ElMessage.info('正在获取当前位置...')

    // 使用LocationService获取当前位置
    const position = await locationService.getCurrentPosition()
    
    // 使用高德地图逆地理编码获取详细地址
    const addressInfo = await MapUtils.amap.reverseGeocode(position.latitude, position.longitude)
    
    if (addressInfo) {
      // 更新表单数据
      formData.value.location = {
        address: addressInfo.formattedAddress,
        city: addressInfo.city,
        district: addressInfo.district,
        lng: position.longitude,
        lat: position.latitude
      }
      ElMessage.success('位置获取成功')
    } else {
      // 如果逆地理编码失败，使用基础位置信息
      formData.value.location = {
        address: `经度: ${position.longitude}, 纬度: ${position.latitude}`,
        city: '',
        district: '',
        lng: position.longitude,
        lat: position.latitude
      }
      ElMessage.warning('获取详细地址失败，已使用基础坐标')
    }
  } catch (error) {
    console.error('获取位置失败:', error)
    
    let errorMessage = '获取位置失败'
    if (error.message.includes('用户拒绝了位置请求')) {
      errorMessage = '用户拒绝了位置请求'
    } else if (error.message.includes('位置信息不可用')) {
      errorMessage = '位置信息不可用'
    } else if (error.message.includes('获取位置超时')) {
      errorMessage = '获取位置超时'
    }
    
    ElMessage.error(errorMessage)
  }
}

// 切换标签
const handleToggleTag = (tag) => {
  const index = formData.value.personality.tags.indexOf(tag.id)
  if (index > -1) {
    formData.value.personality.tags.splice(index, 1)
  } else {
    formData.value.personality.tags.push(tag.id)
  }
}

// 上一步
const handlePrevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 下一步
const handleNextStep = async () => {
  // 验证当前步骤
  if (currentStep.value === 1) {
    try {
      await formRef.value.validate()
    } catch (error) {
      ElMessage.warning('请填写完整的必填信息')
      return
    }
  }

  if (currentStep.value < 4) {
    currentStep.value++
  }
}

// 保存草稿
const handleSaveDraft = async () => {
  try {
    submitting.value = true

    const data = {
      ...formData.value,
      ageMonth: ageMonth.value,
      status: 'DRAFT',
      auditStatus: 'NONE',
      lng: formData.value.location.lng,
      lat: formData.value.location.lat,
      coverUrl: mediaList.value.find(m => m.isCover)?.url || ''
    }

    let response
    if (petId.value) {
      // 更新
      response = await orgAPI.updatePet(petId.value, data)
    } else {
      // 创建
      response = await orgAPI.createPet(data)
      petId.value = response.data.id
    }

    ElMessage.success('草稿保存成功')

    // 如果是首次保存,上传已选择的图片
    if (response.data.id && !petId.value) {
      petId.value = response.data.id
      await uploadPendingMedia()
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    ElMessage.error('保存失败,请重试')
  } finally {
    submitting.value = false
  }
}

// 提交审核
const handleSubmit = async () => {
  // 先保存草稿
  if (!petId.value) {
    await handleSaveDraft()
  }

  // 验证必填项
  if (!canSubmit.value) {
    ElMessage.warning('请完善所有必填信息')
    return
  }

  try {
    await ElMessageBox.confirm(
      '提交后需要等待管理员审核,确认要提交吗?',
      '提交审核',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    submitting.value = true

    await orgAPI.submitPetAudit(petId.value)

    ElMessage.success('提交审核成功')
    router.push('/org/pets')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提交审核失败:', error)
      ElMessage.error('提交失败,请重试')
    }
  } finally {
    submitting.value = false
  }
}

// 预览
const handlePreview = () => {
  if (!petId.value) {
    ElMessage.warning('请先保存草稿')
    return
  }
  ElMessage.info('预览功能开发中')
}

// 上传待上传的媒体
const uploadPendingMedia = async () => {
  for (let i = 0; i < mediaList.value.length; i++) {
    const media = mediaList.value[i]

    if (media.id) continue // 跳过已上传的

    try {
      const mediaResponse = await orgAPI.savePetMedia(petId.value, {
        url: media.url,
        mediaType: media.mediaType,
        sort: i
      })
      media.id = mediaResponse.data.id
    } catch (error) {
      console.error('上传媒体失败:', error)
    }
  }
}

// 组件挂载
onMounted(() => {
  loadOrgInfo()
  loadTagList()
})
</script>

<style lang="scss" scoped>
/* 原有基础变量 */
$primary-gradient: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%);
$bg-color: #f6f9fc;
$glass-bg: rgba(255, 255, 255, 0.8);

.pet-create-container {
  min-height: 100vh; background: $bg-color; position: relative; overflow-x: hidden;
}

/* 装饰背景保持 */
.bg-glow-1 { position: absolute; top: -10%; right: -5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255, 140, 66, 0.1) 0%, transparent 70%); }
.bg-glow-2 { position: absolute; bottom: -10%; left: -5%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(64, 158, 255, 0.08) 0%, transparent 70%); }

.pet-create-content { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 40px 15px 120px; }

/* 玻璃拟态卡片 */
.form-glass-card {
  background: $glass-bg; backdrop-filter: blur(20px); border-radius: 24px; padding: 35px;
  border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.03);
}

.section-title { font-size: 20px; font-weight: bold; margin-bottom: 25px; color: #333; }

/* --- 重点优化：一体化年龄选择器 --- */
.modern-age-picker {
  display: flex; align-items: center; background: #fff; border-radius: 12px;
  border: 1px solid #eef0f2; width: fit-content; overflow: hidden;
  transition: all 0.3s;
  &:hover { border-color: #FF8C42; box-shadow: 0 4px 12px rgba(255, 140, 66, 0.08); }

  .age-block {
    display: flex; align-items: center; padding: 0 12px;
    :deep(.el-input-number) {
      width: 100px;
      .el-input__wrapper { box-shadow: none !important; border: none !important; }
    }
    .age-unit { font-size: 14px; color: #999; margin-left: 4px; font-weight: 500; }
  }

  .age-separator { width: 1px; height: 24px; background: #eee; }
}

/* --- 重点优化：上传容器 --- */
.modern-uploader-container {
  background: #fcfdfe; border: 2px dashed #e4e7ed; border-radius: 16px;
  padding: 20px; transition: all 0.3s;
  &:hover { border-color: #FF8C42; background: #fffaf7; }

  .uploader-header {
    margin-bottom: 15px;
    .hint { font-size: 12px; color: #999; }
  }
}

/* 调整原有表单间距 */
.custom-form-item {
  margin-bottom: 28px;
  :deep(.el-form-item__label) {
    font-weight: 600; color: #555; padding-bottom: 8px;
  }
}

/* 药丸单选美化 */
.pill-radio {
  :deep(.el-radio-button__inner) {
    border-radius: 20px !important; margin-right: 10px; border: 1px solid #dcdfe6 !important;
    padding: 8px 18px; font-size: 13px;
  }
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background: $primary-gradient !important; border-color: transparent !important; box-shadow: 0 4px 10px rgba(255, 107, 107, 0.2);
  }
}

/* 定位输入框 */
.location-input-styled {
  :deep(.el-input-group__append) {
    background: #fff; color: #FF8C42; font-weight: bold; border-left: 1px solid #eee;
    cursor: pointer;
  }
}

/* 底部浮动控制 */
.sticky-actions {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 15px; padding: 10px 25px; background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px); border-radius: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100;
  .nav-btn {
    padding: 10px 30px; height: 42px; font-weight: 600;
    &.next { background: $primary-gradient; border: none; color: #fff; }
  }
}

/* 动画保持 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 600px) { .form-row-grid { grid-template-columns: 1fr; } }
</style>