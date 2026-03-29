<template>
  <div class="settings-page">
    <div class="page-header">
      <el-button type="text" @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>个人设置</h2>
    </div>

    <div class="settings-content" v-loading="loading">
      <!-- 头像设置 -->
      <div class="setting-section">
        <h4>头像</h4>
        <div class="avatar-setting">
          <el-avatar :size="80" :src="form.avatar">
            <el-icon :size="40"><User /></el-icon>
          </el-avatar>
          <div class="avatar-upload">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
              accept="image/*"
            >
              <el-button type="primary" plain :loading="uploading">
                <el-icon><Upload /></el-icon>
                更换头像
              </el-button>
            </el-upload>
            <p class="upload-tip">支持 JPG、PNG 格式，大小不超过 2MB</p>
          </div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="setting-section">
        <h4>基本信息</h4>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
          class="setting-form"
        >
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" disabled placeholder="用户名不可修改" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="128" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSave" :loading="saving">
              保存修改
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 账号信息 -->
      <div class="setting-section">
        <h4>账号信息</h4>
        <div class="account-info">
          <div class="info-item">
            <span class="label">用户ID</span>
            <span class="value">{{ userInfo.userId }}</span>
          </div>
          <div class="info-item">
            <span class="label">角色</span>
            <span class="value">{{ roleLabel }}</span>
          </div>
          <div class="info-item">
            <span class="label">注册时间</span>
            <span class="value">{{ formatTime(userInfo.createTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="setting-section">
        <h4>安全设置</h4>
        <div class="security-setting">
          <div class="setting-item" @click="showPasswordDialog = true">
            <div class="setting-info">
              <span class="setting-name">修改密码</span>
              <span class="setting-desc">定期修改密码可以提高账号安全性</span>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getUserProfile, updateUserProfile, changePassword } from '@/api/modules/user.js'
import { uploadAvatar } from '@/api/modules/upload.js'
import { ElMessage } from 'element-plus'
import { ArrowLeft, User, Upload, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const changingPassword = ref(false)
const showPasswordDialog = ref(false)

const formRef = ref()
const passwordFormRef = ref()

const userInfo = ref({
  userId: '',
  username: '',
  role: '',
  createTime: ''
})

const form = reactive({
  avatar: '',
  phone: '',
  email: ''
})

const rules = {
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: 'blur'
    }
  ]
}

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const roleLabel = computed(() => {
  const roleMap = {
    'USER': '普通用户',
    'ORG': '机构管理员',
    'ADMIN': '系统管理员'
  }
  return roleMap[userInfo.value.role] || '用户'
})

const goBack = () => {
  router.back()
}

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const loadUserInfo = async () => {
  loading.value = true
  try {
    const { data } = await getUserProfile()
    userInfo.value = {
      userId: data.userId,
      username: data.username,
      role: data.role,
      createTime: data.createTime
    }
    form.avatar = data.avatar || ''
    form.phone = data.phone || ''
    form.email = data.email || ''
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const beforeAvatarUpload = (file) => {
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

const handleAvatarUpload = async (options) => {
  uploading.value = true
  try {
    const { data } = await uploadAvatar(options.file)
    form.avatar = data.url
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败')
  } finally {
    uploading.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    const updateData = {}
    if (form.avatar) updateData.avatar = form.avatar
    if (form.phone) updateData.phone = form.phone
    if (form.email) updateData.email = form.email

    await updateUserProfile(updateData)
    ElMessage.success('保存成功')

    // 更新 store 中的用户信息
    await authStore.getCurrentUser()
  } catch (error) {
    if (error !== false) {
      console.error('保存失败:', error)
      ElMessage.error(error?.response?.data?.message || '保存失败')
    }
  } finally {
    saving.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true

    await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    ElMessage.success('密码修改成功，请重新登录')
    showPasswordDialog.value = false

    // 清空密码表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    // 退出登录，跳转到登录页
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    if (error !== false) {
      console.error('修改密码失败:', error)
      ElMessage.error(error?.response?.data?.message || '修改密码失败')
    }
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #ebeef5;

  .back-btn {
    margin-right: 16px;
    color: var(--el-color-primary);
  }

  h2 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }
}

.settings-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

.setting-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;

  h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #303133;
    padding-left: 12px;
    border-left: 3px solid var(--el-color-primary);
  }
}

.avatar-setting {
  display: flex;
  align-items: center;
  gap: 24px;

  .avatar-upload {
    flex: 1;
  }

  .upload-tip {
    margin: 8px 0 0;
    font-size: 12px;
    color: #909399;
  }
}

.setting-form {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

.account-info {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .label {
      color: #909399;
      font-size: 14px;
    }

    .value {
      color: #303133;
      font-size: 14px;
    }
  }
}

.security-setting {
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fafafa;
    }

    .setting-info {
      .setting-name {
        display: block;
        font-size: 14px;
        color: #303133;
        margin-bottom: 4px;
      }

      .setting-desc {
        display: block;
        font-size: 12px;
        color: #909399;
      }
    }

    .arrow-icon {
      color: #c0c4cc;
    }
  }
}

@media (max-width: 480px) {
  .avatar-setting {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>