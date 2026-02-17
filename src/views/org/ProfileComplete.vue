<template>

    <PageHeader title="机构资料完善">
      <template #actions>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          提交审核
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <el-row :gutter="24">
        <el-col :span="18">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
                <el-tag type="warning">待完善</el-tag>
              </div>
            </template>

            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="120px"
              size="large"
            >
              <el-form-item label="机构名称" prop="orgName">
                <el-input v-model="form.orgName" placeholder="请输入机构全称" />
              </el-form-item>



              <el-form-item label="联系人" prop="contactName">
                <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
              </el-form-item>

              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
              </el-form-item>



              <el-form-item label="统一社会信用代码" prop="licenseNo">
                <el-input v-model="form.licenseNo" placeholder="请输入18位统一社会信用代码" />
              </el-form-item>

              <el-form-item label="所在地区" required>
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-input v-model="form.province" placeholder="请输入省份" />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="form.city" placeholder="请输入城市" />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="form.district" placeholder="请输入区县" />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="详细地址" prop="address">
                <el-input
                  v-model="form.address"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入详细地址，如：北京市朝阳区建国路88号"
                />
                <div style="margin-top: 8px">
                  <el-button type="primary" size="small" @click="getCurrentLocation">
                    <el-icon><Location /></el-icon>
                    获取当前位置
                  </el-button>
                  <el-button type="text" size="small" @click="parseAddress" :disabled="!form.address.trim()">
                    <el-icon><Search /></el-icon>
                    智能解析地址
                  </el-button>
                </div>
              </el-form-item>



              <el-form-item label="机构封面" prop="coverUrl">
               <el-upload
                  class="avatar-uploader"
                  action="#"
                  :http-request="uploadCover"
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                >
                  <img v-if="form.coverUrl" :src="form.coverUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <div class="upload-tip">建议尺寸：800x600px，大小不超过2MB</div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <template #header>
              <span>填写须知</span>
            </template>
            <div class="tips-content">
              <p>1. 请确保填写的信息真实有效</p>
              <p>2. 机构资质号将用于身份验证</p>
              <p>3. 可使用"获取当前位置"快速填写地址</p>
              <p>4. 输入详细地址后可"智能解析"自动填充地区</p>
              <p>5. 审核通常需要1-3个工作日</p>
              <p>6. 审核通过后即可发布宠物信息</p>
            </div>
          </el-card>

          <el-card style="margin-top: 16px">
            <template #header>
              <span>审核状态</span>
            </template>
            <el-alert
              title="待完善资料"
              type="warning"
              description="请完善机构资料后提交审核"
              :closable="false"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Location, Search } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useAuthStore } from '@/stores/auth.js'
import { orgAPI } from '@/api/modules/org.js'
import { regionData } from '@/utils/region.js'
import { uploadAvatar } from '@/api/modules/upload.js'
import { MapUtils, locationService } from '@/utils/map.js'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const submitting = ref(false)

// 上传请求头 - 使用 upload.js 中的方法，不再需要手动设置

const form = reactive({
  orgName: '',
  licenseNo: '',
  contactName: '',
  contactPhone: '',
  address: '',
  province: '',
  city: '',
  district: '',
  lng: null,
  lat: null,
  coverUrl: ''
})

// 地区数据 - 不再需要下拉选择器
// const provinces = ref(regionData)
// const cities = ref([])
// const districts = ref([])

const rules = {
  orgName: [
    { required: true, message: '请输入机构名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],

  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],

  licenseNo: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-Z]{18}$/, message: '请输入18位统一社会信用代码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ],

}

const handleCoverSuccess = (response) => {
  form.coverUrl = response.data.url
}

const uploadCover = async (options) => {
  try {
    const response = await uploadAvatar(options.file)
    form.coverUrl = response.data.url
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
    throw error
  }
}

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

// 获取当前位置
const getCurrentLocation = async () => {
  try {
    ElMessage.info('正在获取位置信息...')
    
    // 使用封装的地理位置服务
    const position = await locationService.getCurrentPosition()
    
    // 使用高德地图逆地理编码获取详细地址
    const addressInfo = await MapUtils.amap.reverseGeocode(position.latitude, position.longitude)
    
    if (addressInfo) {
      // 自动填充所有地址信息
      form.province = addressInfo.province
      form.city = addressInfo.city
      form.district = addressInfo.district
      form.address = addressInfo.formattedAddress
      form.lng = position.longitude
      form.lat = position.latitude
      
      // 地区信息已直接填充到输入框中，无需更新下拉选择器
      
      ElMessage.success('位置获取成功，已自动填充地址信息')
    } else {
      ElMessage.warning('无法获取详细地址信息')
    }
  } catch (error) {
    console.error('获取位置失败:', error)
    ElMessage.error(error.message || '获取位置失败，请手动填写地址')
  }
}

// 智能解析地址
const parseAddress = async () => {
  if (!form.address.trim()) {
    ElMessage.warning('请先输入详细地址')
    return
  }

  try {
    ElMessage.info('正在解析地址...')
    
    const addressInfo = await MapUtils.amap.geocode(form.address)
    
    if (addressInfo) {
      // 自动填充地区信息
      form.province = addressInfo.province
      form.city = addressInfo.city
      form.district = addressInfo.district
      form.lng = addressInfo.longitude
      form.lat = addressInfo.latitude
      
      // 地区信息已直接填充到输入框中，无需更新下拉选择器
      
      ElMessage.success('地址解析成功，已自动填充地区信息')
    } else {
      ElMessage.warning('无法解析该地址，请手动选择地区')
    }
  } catch (error) {
    console.error('地址解析失败:', error)
    ElMessage.error('地址解析失败，请手动填写')
  }
}

// 地区选择器相关方法已移除，改为用户手动填写
// const onProvinceChange = (province, resetDistrict = true) => { ... }
// const onCityChange = (city, resetDistrict = true) => { ... }

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    submitting.value = true
    await orgAPI.createOrgProfile(form)
    ElMessage.success('提交成功，请等待审核')
    
    // 刷新用户信息
    await authStore.getCurrentUser()
    router.push('/org/waiting')
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // 检查是否已完善资料
  try {
    const { data } = await orgAPI.getOrgProfile()
    if (data && data.id) {
      router.push('/org/dashboard')
    }
  } catch (error) {
    // 未完善资料，继续当前页面
  }
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tips-content p {
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.avatar-uploader {
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: var(--primary-color);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>