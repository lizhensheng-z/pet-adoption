<template>

    <PageHeader :title="isEdit ? '编辑宠物' : '新增宠物'" :custom-breadcrumb="[
      { path: '/', title: '首页' },
      { path: '/org', title: '机构首页' },
      { path: '/org/pet', title: '宠物管理' },
      { path: null, title: isEdit ? '编辑宠物' : '新增宠物' }
    ]">
      <template #actions>
        <el-button @click="handleBack">
          <el-icon><Back /></el-icon>
          返回
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <el-form
        ref="formRef"
        :model="petForm"
        :rules="formRules"
        label-width="120px"
        v-loading="loading"
      >
        <!-- 基本信息 -->
        <el-card class="form-section">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="宠物名称" prop="name">
                <el-input v-model="petForm.name" placeholder="请输入宠物名称" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物种" prop="species">
                <el-select v-model="petForm.species" placeholder="请选择物种" style="width: 100%">
                  <el-option label="猫" value="CAT" />
                  <el-option label="狗" value="DOG" />
                  <el-option label="其他" value="OTHER" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="品种" prop="breed">
                <el-input v-model="petForm.breed" placeholder="请输入品种" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="petForm.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="公" value="MALE" />
                  <el-option label="母" value="FEMALE" />
                  <el-option label="未知" value="UNKNOWN" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="年龄" prop="ageMonth">
                <el-input-number 
                  v-model="petForm.ageMonth" 
                  :min="0" 
                  :max="300"
                  controls-position="right"
                  style="width: 100%"
                >
                  <template #append>月</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体型" prop="size">
                <el-select v-model="petForm.size" placeholder="请选择体型" style="width: 100%">
                  <el-option label="小型" value="S" />
                  <el-option label="中型" value="M" />
                  <el-option label="大型" value="L" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="毛色" prop="color">
                <el-input v-model="petForm.color" placeholder="请输入毛色" maxlength="30" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="封面图片" prop="coverUrl">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :http-request="uploadCoverImage"
                  :show-file-list="false"
                  :on-success="handleCoverSuccess"
                  :before-upload="beforeImageUpload"
                >
                  <img v-if="petForm.coverUrl" :src="petForm.coverUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 健康信息 -->
        <el-card class="form-section">
          <template #header>
            <div class="card-header">
              <span>健康信息</span>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="是否绝育">
                <el-switch v-model="petForm.sterilized" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否疫苗">
                <el-switch v-model="petForm.vaccinated" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否驱虫">
                <el-switch v-model="petForm.dewormed" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="健康描述">
            <el-input
              v-model="petForm.healthDesc"
              type="textarea"
              :rows="3"
              placeholder="请输入健康描述"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-card>

        <!-- 性格与领养要求 -->
        <el-card class="form-section">
          <template #header>
            <div class="card-header">
              <span>性格与领养要求</span>
            </div>
          </template>
          
          <el-form-item label="性格描述">
            <el-input
              v-model="petForm.personalityDesc"
              type="textarea"
              :rows="3"
              placeholder="请输入性格描述"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="领养要求">
            <el-input
              v-model="petForm.adoptRequirements"
              type="textarea"
              :rows="3"
              placeholder="请输入领养要求"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-card>

        <!-- 位置信息 -->
        <el-card class="form-section">
          <template #header>
            <div class="card-header">
              <span>位置信息</span>
              <el-tag size="small" type="info">支持地址搜索自动定位</el-tag>
            </div>
          </template>
          
          <!-- 地址搜索输入 -->
          <el-form-item label="所在位置">
            <div class="location-input-wrapper">
              <el-autocomplete
                v-model="addressInput"
                :fetch-suggestions="searchAddress"
                placeholder="请输入地址搜索，如：北京市朝阳区三里屯"
                style="flex: 1"
                @select="handleAddressSelect"
                :debounce="500"
                clearable
              >
                <template #prefix>
                  <el-icon><Location /></el-icon>
                </template>
                <template #default="{ item }">
                  <div class="address-suggestion">
                    <div class="address-name">{{ item.name }}</div>
                    <div class="address-detail">{{ item.address }}</div>
                  </div>
                </template>
              </el-autocomplete>
              <el-button type="primary" :loading="locating" @click="getCurrentLocation">
                <el-icon><Aim /></el-icon>
                自动定位
              </el-button>
            </div>
          </el-form-item>

          <!-- 当前选中地址显示 -->
          <el-form-item label="当前地址" v-if="currentAddress">
            <div class="current-address">
              <el-icon class="location-icon"><Location /></el-icon>
              <span>{{ currentAddress }}</span>
            </div>
          </el-form-item>

          <!-- 经纬度显示 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="经度">
                <el-input-number 
                  v-model="petForm.lng" 
                  :precision="6"
                  :step="0.000001"
                  style="width: 100%"
                  placeholder="通过地址搜索获取"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度">
                <el-input-number 
                  v-model="petForm.lat" 
                  :precision="6"
                  :step="0.000001"
                  style="width: 100%"
                  placeholder="通过地址搜索获取"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

              </el-form>
    </div>

</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Back, Check, Plus, Location, Aim } from '@element-plus/icons-vue'

import PageHeader from '@/components/common/PageHeader.vue'
import {petAPI} from '@/api/modules/pet.js'
import {orgAPI} from '@/api/modules/org.js'
import { uploadPetPhoto } from '@/api/modules/upload.js'
import { MapUtils, locationService } from '@/utils/map.js'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const loading = ref(false)
const submitLoading = ref(false)

// 位置相关状态
const addressInput = ref('')
const currentAddress = ref('')
const locating = ref(false)

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const petForm = reactive({
  name: '',
  species: '',
  breed: '',
  gender: '',
  ageMonth: 0,
  size: '',
  color: '',
  coverUrl: '',
  sterilized: false,
  vaccinated: false,
  dewormed: false,
  healthDesc: '',
  personalityDesc: '',
  adoptRequirements: '',
  lng: undefined,
  lat: undefined
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入宠物名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  species: [
    { required: true, message: '请选择物种', trigger: 'change' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  ageMonth: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 0, max: 300, message: '年龄必须在 0-300 月之间', trigger: 'blur' }
  ],
  size: [
    { required: true, message: '请选择体型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取宠物详情
const getPetDetail = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    // 使用机构端接口获取完整信息（包括经纬度）
    const { data } = await orgAPI.getOrgPetDetail(Number(route.params.id))

    // 检查宠物状态，已领养的宠物禁止编辑
    if (data.status === 'ADOPTED') {
      ElMessage.warning('已领养的宠物不能修改')
      router.push('/org/pets')
      return
    }

    // 赋值表单数据，确保经纬度正确转换
    Object.assign(petForm, {
      ...data,
      lng: data.lng ? Number(data.lng) : undefined,
      lat: data.lat ? Number(data.lat) : undefined
    })

    // 如果有经纬度，解析地址
    if (petForm.lng && petForm.lat) {
      reverseGeocode(petForm.lat, petForm.lng)
    }
  } catch (error) {
    ElMessage.error('获取宠物详情失败')
    console.error('获取宠物详情失败:', error)
  } finally {
    loading.value = false
  }
}

// ========== 位置相关功能 ==========

// 搜索地址（自动补全）
const searchAddress = async (queryString, cb) => {
  if (!queryString || queryString.length < 2) {
    cb([])
    return
  }

  try {
    // 使用高德地图 POI 搜索
    const results = await MapUtils.amap.searchPOI(queryString, '', 10)
    const suggestions = results.map(item => ({
      value: item.name,
      name: item.name,
      address: item.address || item.cityname || '',
      lng: item.location.longitude,
      lat: item.location.latitude
    }))
    cb(suggestions)
  } catch (error) {
    console.error('搜索地址失败:', error)
    cb([])
  }
}

// 选择地址建议项
const handleAddressSelect = async (item) => {
  console.log('选择地址:', item)
  petForm.lng = item.lng
  petForm.lat = item.lat
  currentAddress.value = item.name + (item.address ? ` (${item.address})` : '')
  addressInput.value = item.name
  
  ElMessage.success('已获取位置坐标')
}

// 自动定位（获取当前位置）
const getCurrentLocation = async () => {
  locating.value = true
  try {
    // 先尝试浏览器定位
    const position = await locationService.getCurrentPosition()
    petForm.lat = position.latitude
    petForm.lng = position.longitude
    
    // 逆地理编码获取地址
    await reverseGeocode(position.latitude, position.longitude)
    
    ElMessage.success('定位成功')
  } catch (error) {
    console.error('自动定位失败:', error)
    ElMessage.warning('自动定位失败，请手动搜索地址')
  } finally {
    locating.value = false
  }
}

// 逆地理编码（坐标转地址）
const reverseGeocode = async (lat, lng) => {
  try {
    const result = await MapUtils.amap.reverseGeocode(lat, lng)
    if (result && result.formattedAddress) {
      currentAddress.value = result.formattedAddress
      addressInput.value = result.formattedAddress
    }
  } catch (error) {
    console.error('逆地理编码失败:', error)
  }
}

// 返回
const handleBack = () => {
  router.push('/org/pet')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      // 构建提交数据，确保经纬度正确传递
      const submitData = {
        ...petForm,
        lng: petForm.lng ? Number(petForm.lng) : null,
        lat: petForm.lat ? Number(petForm.lat) : null
      }

      if (isEdit.value) {
        await orgAPI.updatePet(Number(route.params.id), submitData)
        ElMessage.success('更新成功')
      } else {
        await orgAPI.createPet(submitData)
        ElMessage.success('创建成功')
      }
      router.push('/org/pet')
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      console.error('提交失败:', error)
    } finally {
      submitLoading.value = false
    }
  })
}

// 封面图片上传成功
const handleCoverSuccess = (response) => {
  petForm.coverUrl = response.url || response.data?.url
}

// 图片上传前验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 封面上传
const uploadCoverImage = async (options) => {
  const { file, onSuccess, onError } = options
  try {
    const response = await uploadPetPhoto(file)
    onSuccess(response.data)
  } catch (error) {
    console.error('封面上传失败:', error)
    ElMessage.error('封面上传失败，请重试')
    onError(error)
  }
}

// 初始化
onMounted(() => {
  getPetDetail()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
}

.form-section {
  margin-bottom: var(--spacing-lg);
}

.card-header {
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

/* 位置相关样式 */
.location-input-wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
}

.current-address {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.location-icon {
  color: #FF8C42;
  font-size: 16px;
}

.address-suggestion {
  padding: 4px 0;
}

.address-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.address-detail {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>