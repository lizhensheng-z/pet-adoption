<template>

    <PageHeader title="偏好设置" subtitle="设置您的领养偏好，获得更精准的宠物推荐">
      <template #actions>
        <el-button @click="resetForm" :disabled="loading">重置</el-button>
        <el-button type="primary" @click="savePreference" :loading="saving">保存设置</el-button>
      </template>
    </PageHeader>

    <div class="preference-page" v-loading="loading">
      <!-- 宠物类型偏好 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">🐱 宠物类型</span>
          </div>
        </template>
        <div class="option-group">
          <el-check-tag
            v-for="item in petTypeOptions"
            :key="item.value"
            :checked="form.petTypes?.includes(item.value)"
            @change="togglePetType(item.value)"
          >
            <span class="tag-content">
              {{ item.icon }} {{ item.label }}
            </span>
          </el-check-tag>
        </div>
      </el-card>

      <!-- 体型偏好 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">📏 体型偏好</span>
          </div>
        </template>
        <div class="option-group">
          <el-check-tag
            v-for="item in sizeOptions"
            :key="item.value"
            :checked="form.sizes?.includes(item.value)"
            @change="toggleSize(item.value)"
          >
            {{ item.label }}
          </el-check-tag>
        </div>
      </el-card>

      <!-- 年龄偏好 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">🎂 年龄偏好</span>
          </div>
        </template>
        <div class="age-range">
          <el-slider
            v-model="ageRangeValue"
            range
            :min="0"
            :max="120"
            :marks="ageMarks"
            :format-tooltip="formatAgeTooltip"
          />
          <div class="age-display">
            {{ formatAgeRange(form.ageRange) }}
          </div>
        </div>
      </el-card>

      <!-- 性别偏好 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">⚥ 性别偏好</span>
          </div>
        </template>
        <el-radio-group v-model="form.gender" class="radio-group">
          <el-radio-button value="">不限</el-radio-button>
          <el-radio-button value="MALE">公</el-radio-button>
          <el-radio-button value="FEMALE">母</el-radio-button>
        </el-radio-group>
      </el-card>

      <!-- 健康要求 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">🏥 健康要求</span>
          </div>
        </template>
        <el-checkbox-group v-model="form.healthRequirements" class="checkbox-group">
          <el-checkbox label="已绝育" value="已绝育" />
          <el-checkbox label="已疫苗" value="已疫苗" />
          <el-checkbox label="已驱虫" value="已驱虫" />
        </el-checkbox-group>
      </el-card>

      <!-- 距离偏好 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">📍 距离偏好</span>
          </div>
        </template>
        <div class="distance-setting">
          <el-slider
            v-model="form.distance"
            :min="1"
            :max="100"
            :marks="distanceMarks"
            show-input
            :show-input-controls="false"
          />
          <div class="distance-hint">
            只显示距离您 {{ form.distance || 50 }} 公里内的宠物
          </div>
        </div>
      </el-card>

      <!-- 标签偏好 -->
      <el-card class="preference-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">🏷 性格标签</span>
          </div>
        </template>
        <div class="tags-container">
          <el-check-tag
            v-for="tag in availableTags"
            :key="tag"
            :checked="form.tags?.includes(tag)"
            @change="toggleTag(tag)"
            class="tag-item"
          >
            {{ tag }}
          </el-check-tag>
        </div>
        <div class="tags-hint" v-if="!availableTags.length">
          正在加载标签...
        </div>
      </el-card>

      <!-- 底部操作栏 -->
      <div class="bottom-actions">
        <el-button size="large" @click="resetForm">重置为默认</el-button>
        <el-button type="primary" size="large" @click="savePreference" :loading="saving">
          保存偏好设置
        </el-button>
      </div>
    </div>

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { userAPI } from '@/api/modules/auth.js'
import { tagApi } from '@/api/modules/admin.js'

const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const availableTags = ref([])

// 表单数据
const form = reactive({
  petTypes: [],
  sizes: [],
  ageRange: [0, 120],
  gender: '',
  healthRequirements: [],
  distance: 50,
  tags: []
})

// 年龄范围计算属性
const ageRangeValue = computed({
  get: () => form.ageRange || [0, 120],
  set: (val) => { form.ageRange = val }
})

// 宠物类型选项
const petTypeOptions = [
  { value: 'CAT', label: '猫咪', icon: '🐱' },
  { value: 'DOG', label: '狗狗', icon: '🐕' },
  { value: 'OTHER', label: '其他', icon: '🐾' }
]

// 体型选项
const sizeOptions = [
  { value: 'S', label: '小型（<10kg）' },
  { value: 'M', label: '中型（10-25kg）' },
  { value: 'L', label: '大型（>25kg）' }
]

// 年龄标记
const ageMarks = {
  0: '幼崽',
  12: '1岁',
  36: '3岁',
  60: '5岁',
  120: '10岁+'
}

// 距离标记
const distanceMarks = {
  1: '1km',
  10: '10km',
  30: '30km',
  50: '50km',
  100: '100km'
}

// 切换宠物类型
const togglePetType = (value) => {
  if (!form.petTypes) form.petTypes = []
  const index = form.petTypes.indexOf(value)
  if (index > -1) {
    form.petTypes.splice(index, 1)
  } else {
    form.petTypes.push(value)
  }
}

// 切换体型
const toggleSize = (value) => {
  if (!form.sizes) form.sizes = []
  const index = form.sizes.indexOf(value)
  if (index > -1) {
    form.sizes.splice(index, 1)
  } else {
    form.sizes.push(value)
  }
}

// 切换标签
const toggleTag = (tag) => {
  if (!form.tags) form.tags = []
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else {
    form.tags.push(tag)
  }
}

// 格式化年龄提示
const formatAgeTooltip = (value) => {
  if (value < 12) return `${value}个月`
  const years = Math.floor(value / 12)
  const months = value % 12
  if (months === 0) return `${years}岁`
  return `${years}岁${months}个月`
}

// 格式化年龄范围显示
const formatAgeRange = (range) => {
  if (!range || range.length !== 2) return '不限'
  const [min, max] = range
  if (min === 0 && max === 120) return '不限'
  return `${formatAgeTooltip(min)} ~ ${formatAgeTooltip(max)}`
}

// 加载偏好设置
const loadPreference = async () => {
  loading.value = true
  try {
    const { data } = await userAPI.getPreference()
    if (data) {
      form.petTypes = data.petTypes || []
      form.sizes = data.sizes || []
      form.ageRange = data.ageRange || [0, 120]
      form.gender = data.gender || ''
      form.healthRequirements = data.healthRequirements || []
      form.distance = data.distance || 50
      form.tags = data.tags || []
    }
  } catch (error) {
    console.error('加载偏好设置失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载可用标签
const loadTags = async () => {
  try {
    const { data } = await tagApi.getTagList({ pageSize: 50 })
    if (data?.records) {
      availableTags.value = data.records
        .filter(tag => tag.status === 'ENABLED' || tag.status === 1)
        .map(tag => tag.name || tag.tagName)
    } else if (Array.isArray(data)) {
      availableTags.value = data
        .filter(tag => tag.status === 'ENABLED' || tag.status === 1)
        .map(tag => tag.name || tag.tagName)
    }
  } catch (error) {
    // 使用默认标签
    availableTags.value = ['温顺', '活泼', '亲人', '独立', '安静', '爱叫', '粘人', '高冷', '聪明', '乖巧']
  }
}

// 保存偏好设置
const savePreference = async () => {
  saving.value = true
  try {
    await userAPI.updatePreference({
      petTypes: form.petTypes,
      sizes: form.sizes,
      ageRange: form.ageRange,
      gender: form.gender,
      healthRequirements: form.healthRequirements,
      distance: form.distance,
      tags: form.tags
    })
    ElMessage.success('偏好设置已保存')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
    console.error('保存偏好设置失败:', error)
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.petTypes = []
  form.sizes = []
  form.ageRange = [0, 120]
  form.gender = ''
  form.healthRequirements = []
  form.distance = 50
  form.tags = []
  ElMessage.info('已重置为默认设置')
}

onMounted(() => {
  loadPreference()
  loadTags()
})
</script>

<style scoped>
.preference-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px 100px;
}

.preference-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.header-title {
  color: #303133;
}

.option-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.option-group .el-check-tag {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
}

.tag-content {
  font-size: 15px;
}

.radio-group {
  display: flex;
  gap: 12px;
}

.radio-group .el-radio-button {
  border-radius: 20px;
}

.radio-group .el-radio-button__inner {
  border-radius: 20px;
  padding: 10px 24px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.checkbox-group .el-checkbox {
  margin-right: 0;
}

.age-range {
  padding: 10px 0;
}

.age-display {
  text-align: center;
  margin-top: 12px;
  color: #FF8C42;
  font-weight: 600;
}

.distance-setting {
  padding: 10px 0;
}

.distance-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #909399;
  font-size: 13px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  padding: 8px 16px;
  border-radius: 16px;
}

.tags-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
}

.bottom-actions {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.bottom-actions .el-button {
  min-width: 140px;
}

@media (max-width: 768px) {
  .preference-page {
    padding: 0 12px 120px;
  }

  .option-group .el-check-tag {
    padding: 8px 16px;
    font-size: 13px;
  }

  .radio-group {
    flex-wrap: wrap;
  }

  .bottom-actions {
    bottom: 60px;
    padding: 12px;
  }

  .bottom-actions .el-button {
    min-width: 120px;
  }
}
</style>