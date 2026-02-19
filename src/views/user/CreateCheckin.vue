<template>

    <PageHeader title="发布打卡">
      <template #actions>
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <el-card class="create-card">
        <el-form 
          ref="formRef" 
          :model="formData" 
          :rules="formRules" 
          label-width="80px"
          v-loading="loading"
        >
          <!-- 选择宠物 -->
          <el-form-item label="选择宠物" prop="petId">
            <el-select 
              v-model="formData.petId" 
              placeholder="请选择要打卡的宠物"
              filterable
              class="full-width"
            >
              <el-option
                v-for="pet in myPets"
                :key="pet.petId"
                :label="pet.name"
                :value="pet.petId"
              >
                <div class="pet-option">
                  <el-avatar :src="pet.coverUrl" :size="24" />
                  <span>{{ pet.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 打卡内容 -->
          <el-form-item label="打卡内容" prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="4"
              :maxlength="500"
              show-word-limit
              placeholder="分享今天和宠物的温馨时刻..."
              class="full-width"
            />
          </el-form-item>

          <!-- 图片上传 -->
          <el-form-item label="上传图片">
            <div class="upload-section">
              <el-upload
                ref="uploadRef"
                v-model:file-list="fileList"
                class="upload-area"
                action="#"
                :auto-upload="false"
                :multiple="true"
                :limit="9"
                :accept="'image/*'"
                list-type="picture-card"
                :on-exceed="handleExceed"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
                <template #tip>
                  <div class="upload-tip">
                    支持 JPG、PNG、GIF 格式，单张不超过 5MB，最多上传 9 张
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 预览区域 -->
          <el-form-item v-if="uploadedUrls.length > 0" label="已上传">
            <div class="preview-grid">
              <div 
                v-for="(url, index) in uploadedUrls" 
                :key="index"
                class="preview-item"
              >
                <el-image :src="url" fit="cover" class="preview-image" />
                <div class="preview-overlay">
                  <el-button 
                    type="danger" 
                    circle 
                    size="small"
                    @click="removeUploadedImage(index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item>
            <div class="form-actions">
              <el-button @click="handleBack">取消</el-button>
              <el-button 
                type="primary" 
                @click="handleSubmit"
                :loading="submitting"
                :disabled="!canSubmit"
              >
                发布打卡
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, 
  Plus, 
  Delete,
  Picture,
  Camera
} from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { getMyAdoptedPets, createCheckin } from '@/api/modules/checkin.js'
import { uploadPetPhoto } from '@/api/modules/upload.js'

const router = useRouter()
const route = useRoute()

// 响应式数据
const formRef = ref()
const uploadRef = ref()
const loading = ref(false)
const submitting = ref(false)
const myPets = ref([])
const fileList = ref([])
const uploadedUrls = ref([])

const formData = reactive({
  petId: null,
  content: '',
  mediaUrls: []
})

const formRules = {
  petId: [
    { required: true, message: '请选择要打卡的宠物', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入打卡内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 计算属性
const canSubmit = computed(() => {
  return formData.petId && formData.content.trim().length >= 5
})

// 获取已领养宠物
const fetchMyPets = async () => {
  loading.value = true
  try {
    const res = await getMyAdoptedPets()
    myPets.value = res.data || []
    
    // 如果有路由参数，自动选择宠物
    const petId = route.query.petId
    if (petId && myPets.value.find(p => p.petId == petId)) {
      formData.petId = parseInt(petId)
    }
  } catch (error) {
    console.error('获取已领养宠物失败:', error)
    ElMessage.error('获取宠物列表失败')
  } finally {
    loading.value = false
  }
}

// 处理文件上传
const handleFileChange = (file, fileList) => {
  // 文件变化时自动上传
  if (file.status === 'ready') {
    uploadImage(file.raw)
  }
}

const handleFileRemove = (file, fileList) => {
  // 移除文件时更新URL列表
  const index = uploadedUrls.value.findIndex(url => url === file.url)
  if (index > -1) {
    uploadedUrls.value.splice(index, 1)
    formData.mediaUrls.splice(index, 1)
  }
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传 9 张图片')
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 上传单张图片
const uploadImage = async (file) => {
  if (!beforeUpload(file)) return

  try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      
      const res = await uploadPetPhoto(uploadFormData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`上传进度: ${percent}%`)
      }
    })
    
    if (res.data?.url) {
      uploadedUrls.value.push(res.data.url)
      formData.mediaUrls.push(res.data.url)
      
      // 更新文件列表中的URL
      const fileItem = fileList.value.find(f => f.raw === file)
      if (fileItem) {
        fileItem.url = res.data.url
        fileItem.status = 'success'
      }
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('图片上传失败')
    
    // 移除失败的文件
    const index = fileList.value.findIndex(f => f.raw === file)
    if (index > -1) {
      fileList.value.splice(index, 1)
    }
  }
}

// 移除已上传的图片
const removeUploadedImage = (index) => {
  uploadedUrls.value.splice(index, 1)
  formData.mediaUrls.splice(index, 1)
  fileList.value.splice(index, 1)
}

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 检查是否还有正在上传的图片
    const uploadingFiles = fileList.value.filter(f => f.status === 'uploading')
    if (uploadingFiles.length > 0) {
      ElMessage.warning('请等待图片上传完成')
      return
    }
    
    submitting.value = true
    
    // 准备提交数据
    const submitData = {
      petId: formData.petId,
      content: formData.content.trim(),
      mediaUrls: uploadedUrls.value
    }
    
    const res = await createCheckin(submitData)
    
    ElMessage.success('打卡发布成功！')
    
    // 显示信用加分提示
    if (res.data?.creditDelta > 0) {
      ElMessage.success(`恭喜获得 ${res.data.creditDelta} 信用分！`)
    }
    
    // 返回打卡列表页
    router.push('/checkins')
    
  } catch (error) {
    if (error !== false) { // 不是表单验证错误
      console.error('发布打卡失败:', error)
      ElMessage.error('发布失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(() => {
  fetchMyPets()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.create-card {
  border-radius: var(--border-radius-large);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.full-width {
  width: 100%;
}

.pet-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.upload-section {
  width: 100%;
}

.upload-area {
  width: 100%;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-top: var(--spacing-xs);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--spacing-sm);
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--border-radius-small);
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-item:hover .preview-overlay {
  opacity: 1;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-container {
    padding: var(--spacing-md);
  }
  
  .preview-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>