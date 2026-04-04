<template>
  <div class="pet-create-container">
    <!-- 装饰性背景光晕 - 增加 pointer-events: none 确保不遮挡点击 -->
    <div class="bg-glow-1"></div>
    <div class="bg-glow-2"></div>

    <PageHeader title="发布新成员" class="modern-header" :custom-breadcrumb="[
      { path: '/', title: '首页' },
      { path: '/org', title: '机构首页' },
      { path: '/org/pet', title: '宠物管理' },
      { path: null, title: '发布新成员' }
    ]">
      <template #actions>
        <div class="header-action-group">
          <el-button type="primary" class="gradient-btn" @click="handlePublish" :loading="submitting">
            立即发布
          </el-button>
        </div>
      </template>
    </PageHeader>

    <div class="pet-create-content">
      <!-- 科技感步骤指示器 -->
      <div class="steps-wrapper">
        <el-steps :active="currentStep" align-center class="custom-steps">
          <el-step title="基本信息" @click="currentStep = 1" style="cursor: pointer" />
          <el-step title="健康状况" @click="currentStep = 2" style="cursor: pointer" />
          <el-step title="性格特征" @click="currentStep = 3" style="cursor: pointer" />
          <el-step title="领养要求" @click="currentStep = 4" style="cursor: pointer" />
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

              <el-form-item label="美照上传" class="custom-form-item">
                <div class="modern-uploader-container">
                  <div class="uploader-header">
                    <span class="hint">第一张将默认作为头像，建议上传 2 张以上</span>
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

          <!-- 步骤2: 健康状况 -->
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

          <!-- 步骤3: 性格特征 -->
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

          <!-- 步骤4: 领养要求 -->
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

const router = useRouter()
const formRef = ref(null)

// 响应式数据
const petId = ref(null)
const currentStep = ref(1)
const submitting = ref(false)
const mediaList = ref([])
const tagList = ref([])

const formData = ref({
  name: '',
  species: 'CAT',
  breed: '',
  ageYears: 0,
  ageMonths: 0,
  gender: 'UNKNOWN',
  size: 'M',
  color: '',
  location: { address: '', city: '', district: '', lng: null, lat: null },
  health: { sterilized: false, vaccinated: false, dewormed: false, healthDesc: '' },
  personality: { desc: '', tags: [] },
  adoptRequirements: ''
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '宠物名称必须填写', trigger: 'blur' }],
  species: [{ required: true, message: '请选择物种', trigger: 'change' }],
  breed: [{ required: true, message: '品种必须填写', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

// 计算属性：健康状态转换
const healthStatusList = computed({
  get: () => {
    const list = []
    if (formData.value.health.sterilized) list.push('已绝育')
    if (formData.value.health.vaccinated) list.push('已疫苗')
    if (formData.value.health.dewormed) list.push('已驱虫')
    return list
  },
  set: (val) => {
    formData.value.health.sterilized = val.includes('已绝育')
    formData.value.health.vaccinated = val.includes('已疫苗')
    formData.value.health.dewormed = val.includes('已驱虫')
  }
})

const ageMonth = computed(() => formData.value.ageYears * 12 + formData.value.ageMonths)

// --- 核心方法：直接发布 ---
const handlePublish = async () => {
  console.log('点击发布');
  try {
    // 1. 验证表单规则
    await formRef.value.validate();

    // 2. 验证业务规则
    if (mediaList.value.length < 1) {
      currentStep.value = 1;
      return ElMessage.warning('请至少上传一张照片');
    }

    // 3. 二次确认
    await ElMessageBox.confirm('确认信息准确并发布吗？发布后即可被用户看到。', '提示', {
      confirmButtonText: '确定发布',
      cancelButtonText: '取消',
      type: 'info'
    });

    submitting.value = true;

    // 4. 构建发布数据（使用后端期望的嵌套结构）
    const postData = {
      name: formData.value.name,
      species: formData.value.species,
      breed: formData.value.breed,
      gender: formData.value.gender,
      size: formData.value.size,
      color: formData.value.color,
      ageMonth: ageMonth.value,
      adoptRequirements: formData.value.adoptRequirements,
      coverUrl: mediaList.value.find(m => m.isCover)?.url || mediaList.value[0]?.url || '',
      // 嵌套结构 - 健康信息
      health: {
        sterilized: formData.value.health.sterilized,
        vaccinated: formData.value.health.vaccinated,
        dewormed: formData.value.health.dewormed,
        healthDesc: formData.value.health.healthDesc
      },
      // 嵌套结构 - 位置信息
      location: {
        lng: formData.value.location.lng,
        lat: formData.value.location.lat
      },
      // 嵌套结构 - 性格信息
      personality: {
        desc: formData.value.personality.desc,
        tags: formData.value.personality.tags
      }
    };

    // 5. 创建宠物（后端会自动设置为 PUBLISHED 状态）
    const res = await orgAPI.createPet(postData);
    petId.value = res.data?.id || res.id;

    // 6. 处理图片关联
    await uploadPendingMedia();

    ElMessage.success('发布成功！');
    router.push('/org/pet');
  } catch (e) {
    if (e === 'cancel') return;
    console.error(e);
    ElMessage.error('发布失败，请检查必填项');
  } finally {
    submitting.value = false;
  }
}

// --- 媒体管理 ---
const handleUploadImage = async (file) => {
  const localUrl = URL.createObjectURL(file);
  const mediaObj = { url: localUrl, mediaType: 'IMAGE', isCover: mediaList.value.length === 0, isUploading: true };
  mediaList.value.push(mediaObj);

  try {
    const res = await uploadPetPhoto(file);
    mediaObj.url = res.data.url;
    mediaObj.isUploading = false;
    // 如果已经有 petId，实时保存关联
    if (petId.value) {
      const savedMedia = await orgAPI.savePetMedia(petId.value, { url: mediaObj.url, mediaType: 'IMAGE' });
      mediaObj.id = savedMedia.data?.id;
    }
  } catch (e) {
    ElMessage.error('图片上传失败');
    mediaList.value = mediaList.value.filter(m => m.url !== localUrl);
  }
}

const handleRemoveMedia = async (index) => {
  const item = mediaList.value[index];
  if (item.id && petId.value) {
    await orgAPI.deletePetMedia(petId.value, item.id);
  }
  mediaList.value.splice(index, 1);
}

const handleSetCover = (index) => {
  mediaList.value.forEach((m, i) => m.isCover = i === index);
}

const uploadPendingMedia = async () => {
  if (!petId.value) return;
  for (const m of mediaList.value) {
    if (!m.id && !m.isUploading) {
      const res = await orgAPI.savePetMedia(petId.value, { url: m.url, mediaType: 'IMAGE' });
      m.id = res.data?.id;
    }
  }
}

// --- 地理位置 ---
const handleEditLocation = async () => {
  try {
    ElMessage.info('正在定位...');
    const pos = await locationService.getCurrentPosition();
    const addr = await MapUtils.amap.reverseGeocode(pos.latitude, pos.longitude);
    formData.value.location = {
      address: addr.formattedAddress,
      city: addr.city,
      district: addr.district,
      lng: pos.longitude,
      lat: pos.latitude
    };
    ElMessage.success('定位成功');
  } catch (e) {
    ElMessage.error('定位失败');
  }
}

// --- 其他 UI 控制 ---
const handlePrevStep = () => currentStep.value--;
const handleNextStep = async () => {
  if (currentStep.value === 1) {
    try { await formRef.value.validate(); } catch { return ElMessage.warning('请完善必填信息'); }
  }
  currentStep.value++;
}
const handleToggleTag = (tag) => {
  const idx = formData.value.personality.tags.indexOf(tag.id);
  idx > -1 ? formData.value.personality.tags.splice(idx, 1) : formData.value.personality.tags.push(tag.id);
}

onMounted(async () => {
  const res = await orgAPI.getTagList({ enabled: 1 });
  tagList.value = res.data.list || [];
  // 自动填充机构默认位置
  const org = await orgAPI.getOrgProfile();
  if (org.data) {
    formData.value.location = { ...formData.value.location, ...org.data };
  }
});
</script>

<style lang="scss" scoped>
$primary-gradient: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%);

.pet-create-container {
  min-height: 100vh; background: #f6f9fc; position: relative; overflow-x: hidden;
}

/* 装饰背景 - pointer-events: none 核心修复 */
.bg-glow-1, .bg-glow-2 {
  position: absolute; pointer-events: none; z-index: 0;
}
.bg-glow-1 { top: -10%; right: -5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,140,66,0.1) 0%, transparent 70%); }
.bg-glow-2 { bottom: -10%; left: -5%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(64,158,255,0.08) 0%, transparent 70%); }

.pet-create-content { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 40px 15px 120px; }

.form-glass-card {
  background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border-radius: 24px; padding: 35px;
  border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 15px 35px rgba(0,0,0,0.03);
}

.section-title { font-size: 20px; font-weight: bold; margin-bottom: 25px; color: #333; }

.modern-age-picker {
  display: flex; align-items: center; background: #fff; border-radius: 12px; border: 1px solid #eef0f2; width: fit-content;
  .age-block { display: flex; align-items: center; padding: 0 12px; }
  .age-separator { width: 1px; height: 24px; background: #eee; }
}

.modern-uploader-container {
  background: #fcfdfe; border: 2px dashed #e4e7ed; border-radius: 16px; padding: 20px;
}

.pill-radio {
  :deep(.el-radio-button__inner) { border-radius: 20px !important; margin-right: 10px; border: 1px solid #dcdfe6 !important; }
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) { background: $primary-gradient !important; border-color: transparent !important; }
}

.sticky-actions {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 15px; padding: 10px 25px; background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px); border-radius: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100;
  .nav-btn { padding: 10px 30px; height: 42px; font-weight: 600; &.next { background: $primary-gradient; border: none; color: #fff; } }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 600px) { .form-row-grid { grid-template-columns: 1fr; } }
</style>
