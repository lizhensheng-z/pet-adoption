<template>

    <PageHeader title="机构资料管理">
      <template #actions>
        <el-button 
          v-if="!isEditing && hasProfile" 
          type="primary" 
          @click="startEdit"
        >
          <el-icon><Edit /></el-icon>
          编辑资料
        </el-button>
        <el-button 
          v-if="isEditing" 
          type="success" 
          @click="saveProfile" 
          :loading="saving"
        >
          <el-icon><Check /></el-icon>
          保存修改
        </el-button>
        <el-button 
          v-if="isEditing" 
          @click="cancelEdit"
        >
          <el-icon><Close /></el-icon>
          取消
        </el-button>
      </template>
    </PageHeader>

    <!-- 机构状态提示 -->
    <OrgStatusAlert :only-org="true" />

    <div class="page-container">
      <el-row :gutter="24">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>机构基本信息</span>
                <el-tag :type="statusTagType">{{ statusText }}</el-tag>
              </div>
            </template>

            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="140px"
              :disabled="!isEditing"
            >
              <el-form-item label="机构名称" prop="orgName">
                <el-input v-model="form.orgName" placeholder="请输入机构全称" />
              </el-form-item>



              <el-form-item label="统一社会信用代码" prop="licenseNo">
                <el-input v-model="form.licenseNo" placeholder="请输入18位统一社会信用代码" />
              </el-form-item>

              <el-form-item label="联系人姓名" prop="contactName">
                <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
              </el-form-item>

              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
              </el-form-item>



              <el-form-item label="机构地址" prop="address">
               <el-input
                  v-model="form.address"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入详细地址，如：北京市朝阳区建国路88号"
                />
                <div style="margin-top: 8px" v-if="isEditing">
                  <el-button type="primary" size="small" @click="getCurrentLocation">
                    <el-icon><Location /></el-icon>
                    获取当前位置
                  </el-button>
                  <el-button 
                    type="text" 
                    size="small" 
                    @click="parseAddress" 
                    :disabled="!form.address.trim()"
                    style="margin-left: 8px"
                  >
                    <el-icon><Search /></el-icon>
                    智能解析地址
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item label="所在地区" required>
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-input v-model="form.province" placeholder="请输入省份" :disabled="!isEditing" />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="form.city" placeholder="请输入城市" :disabled="!isEditing" />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="form.district" placeholder="请输入区县" :disabled="!isEditing" />
                  </el-col>
                </el-row>
              </el-form-item>



              <el-form-item label="机构封面" prop="coverUrl">
               <el-upload
                  class="avatar-uploader"
                  action="#"
                  :http-request="uploadCover"
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                  :disabled="!isEditing"
                >
                  <img v-if="form.coverUrl" :src="form.coverUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <div class="upload-tip">建议尺寸：800x600px，大小不超过2MB</div>
              </el-form-item>

              <el-form-item label="地理位置" v-if="!isEditing">
                <div class="location-info">
                  <el-icon><Location /></el-icon>
                  <span>经度: {{ form.lng || '未设置' }}，纬度: {{ form.lat || '未设置' }}</span>
                  <el-button 
                    v-if="isEditing" 
                    type="text" 
                    @click="openMapSelector"
                  >
                    在地图上选择
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 审核信息 -->
          <el-card v-if="profileData.verifyStatus !== 'PENDING'" class="mb-4">
            <template #header>
              <span>审核信息</span>
            </template>
            <div class="verify-info">
              <p><strong>审核状态：</strong><el-tag :type="statusTagType">{{ statusText }}</el-tag></p>
              <p v-if="profileData.verifyRemark"><strong>审核意见：</strong>{{ profileData.verifyRemark }}</p>
              <p><strong>审核时间：</strong>{{ formatDate(profileData.verifyTime) }}</p>
            </div>
          </el-card>

          <!-- 操作指南 -->
          <el-card>
            <template #header>
              <span>操作指南</span>
            </template>
            <div class="guide-content">
              <div v-if="profileData.verifyStatus === 'PENDING'">
                <p>✅ 您的机构资料正在审核中</p>
                <p>⏰ 审核通常需要1-3个工作日</p>
                <p>📞 请保持电话畅通</p>
              </div>
              <div v-else-if="profileData.verifyStatus === 'REJECTED'">
                <p>❌ 审核未通过</p>
                <p>📝 请根据审核意见修改资料</p>
                <p>🔄 修改后可重新提交审核</p>
              </div>
              <div v-else-if="profileData.verifyStatus === 'APPROVED'">
                <p>✅ 机构已认证</p>
                <p>🎉 可以正常使用所有功能</p>
                <p>📋 如需修改信息，请点击编辑</p>
              </div>
            </div>
          </el-card>

          <!-- 快速操作 -->
          <el-card class="mt-4" v-if="profileData.verifyStatus === 'APPROVED'">
            <template #header>
              <span>快速操作</span>
            </template>
            <div class="quick-actions">
              <el-button type="primary" @click="$router.push('/org/pet/create')" style="width: 100%; margin-bottom: 8px">
                <el-icon><Plus /></el-icon>
                发布新宠物
              </el-button>
              <el-button @click="$router.push('/org/pet')" style="width: 100%; margin-bottom: 8px">
                <el-icon><Files /></el-icon>
                管理宠物
              </el-button>
              <el-button @click="$router.push('/org/adoptions')" style="width: 100%">
                <el-icon><Document /></el-icon>
                查看申请
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 地图选择器对话框 -->
    <el-dialog
      v-model="mapDialogVisible"
      title="选择机构位置"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="map-container">
        <div id="map-container" style="height: 400px;"></div>
        <div class="map-tip">
          点击地图选择机构位置，或使用搜索框搜索地址
        </div>
      </div>
      <template #footer>
        <el-button @click="mapDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmLocation">确认位置</el-button>
      </template>
    </el-dialog>

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Check, Close, Plus, Location, Files, Document, Search } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import OrgStatusAlert from '@/components/common/OrgStatusAlert.vue'
import { useAuthStore } from '@/stores/auth.js'
import { orgAPI } from '@/api/modules/org.js'
import { regionData } from '@/utils/region.js'
import { MapUtils, locationService } from '@/utils/map.js'
import { uploadAvatar } from '@/api/modules/upload.js'

const authStore = useAuthStore()

// 状态管理
const isEditing = ref(false)
const saving = ref(false)
const loading = ref(false)
const hasProfile = ref(false)
const mapDialogVisible = ref(false)

// 上传请求头 - 使用 upload.js 中的方法，不再需要手动设置

// 表单数据
const formRef = ref()
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

// 原始数据（用于取消编辑）
const originalForm = reactive({})
const profileData = ref({})

// 地区数据 - 不再需要下拉选择器
// const provinces = ref(regionData)
// const cities = ref([])
// const districts = ref([])

// 表单验证规则
const rules = {
  orgName: [
    { required: true, message: '请输入机构名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],

  licenseNo: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-Z]{18}$/, message: '请输入18位统一社会信用代码', trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],

  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],

}

// 计算属性
const statusTagType = computed(() => {
  const status = profileData.value.verifyStatus
  switch (status) {
    case 'APPROVED': return 'success'
    case 'REJECTED': return 'danger'
    case 'PENDING': return 'warning'
    default: return 'info'
  }
})

const statusText = computed(() => {
  const status = profileData.value.verifyStatus
  switch (status) {
    case 'APPROVED': return '已认证'
    case 'REJECTED': return '审核拒绝'
    case 'PENDING': return '审核中'
    default: return '未认证'
  }
})

// 方法
const loadProfile = async () => {
  try {
    loading.value = true
    const { data } = await orgAPI.getOrgProfile()
    profileData.value = data
    
    if (data && data.id) {
      hasProfile.value = true
      Object.assign(form, {
        orgName: data.orgName || '',
        orgType: data.orgType || '',
        licenseNo: data.licenseNo || '',
        contactName: data.contactName || '',
        contactPhone: data.contactPhone || '',
        email: data.email || '',
        address: data.address || '',
        province: data.province || '',
        city: data.city || '',
        district: data.district || '',
        lng: data.lng || null,
        lat: data.lat || null,
        coverUrl: data.coverUrl || '',
        description: data.description || ''
      })
      
      // 地区数据直接加载，不再需要下拉选择器联动
      // 省市区信息直接显示在输入框中
    }
  } catch (error) {
    console.error('获取机构资料失败:', error)
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  Object.assign(originalForm, form)
  isEditing.value = true
}

const cancelEdit = () => {
  Object.assign(form, originalForm)
  isEditing.value = false
}

const saveProfile = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    saving.value = true
    await orgAPI.updateOrgProfile(form)
    ElMessage.success('保存成功')
    await loadProfile()
    isEditing.value = false
    
    // 刷新用户信息
    await authStore.getCurrentUser()
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
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

// 地区选择器相关方法已移除，改为用户手动填写
// const onProvinceChange = (province, resetDistrict = true) => { ... }
// const onCityChange = (city, resetDistrict = true) => { ... }

const openMapSelector = async () => {
  mapDialogVisible.value = true
  
  try {
    // 使用封装的地理位置服务
    const position = await locationService.getCurrentPosition()
    form.lng = position.longitude
    form.lat = position.latitude
    
    // 使用高德地图逆地理编码获取地址信息
    const addressInfo = await MapUtils.amap.reverseGeocode(position.latitude, position.longitude)
    if (addressInfo) {
      // 自动填充地址信息
      form.address = addressInfo.formattedAddress
      form.province = addressInfo.province
      form.city = addressInfo.city
      form.district = addressInfo.district
      
      // 地区信息已直接填充到输入框中，无需更新下拉选择器
    }
    
    ElMessage.success('已获取当前位置')
  } catch (error) {
    console.error('获取位置失败:', error)
    ElMessage.warning('无法获取当前位置，请手动填写地址')
  }
}

// 获取当前位置（直接填充，不打开地图对话框）
const getCurrentLocation = async () => {
  try {
    ElMessage.info('正在获取位置信息...')
    
    // 使用封装的地理位置服务
    const position = await locationService.getCurrentPosition()
    
    // 使用高德地图逆地理编码获取详细地址
    const addressInfo = await MapUtils.amap.reverseGeocode(position.latitude, position.longitude)
    
    if (addressInfo) {
      // 自动填充所有地址信息
      form.address = addressInfo.formattedAddress
      form.province = addressInfo.province
      form.city = addressInfo.city
      form.district = addressInfo.district
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

const confirmLocation = () => {
  mapDialogVisible.value = false
  // 位置已确认，可以在这里进行额外的验证或处理
  if (form.lng && form.lat) {
    ElMessage.success(`已选择位置：经度 ${form.lng.toFixed(6)}，纬度 ${form.lat.toFixed(6)}`)
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 地址智能解析
const parseAddress = async () => {
  if (!form.address.trim()) {
    ElMessage.warning('请先输入详细地址')
    return
  }

  try {
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

// 生命周期
onMounted(() => {
  loadProfile()
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

.verify-info p {
  margin: 8px 0;
  line-height: 1.6;
}

.guide-content p {
  margin: 8px 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

.quick-actions .el-button {
  margin-bottom: 8px;
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

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.map-container {
  text-align: center;
}

.map-tip {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>