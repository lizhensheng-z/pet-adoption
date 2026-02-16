<template>

    <PageHeader title="用户详情">
      <template #actions>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑用户
        </el-button>
      </template>
    </PageHeader>

    <div class="user-detail-container">
      <el-row :gutter="20">
        <!-- 左侧用户信息卡片 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <el-card class="user-info-card">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
                <el-tag :type="getStatusTagType(userDetail.data?.status)">
                  {{ getStatusName(userDetail.data?.status) }}
                </el-tag>
              </div>
            </template>

            <el-skeleton :rows="5" animated v-if="userDetail.loading" />
            
            <div v-else class="user-info-content">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="avatar-section">
                    <el-avatar 
                      :src="userDetail.data?.avatar" 
                      :size="120"
                      class="user-avatar"
                    >
                      {{ userDetail.data?.username?.charAt(0)?.toUpperCase() }}
                    </el-avatar>
                    <div class="user-name">{{ userDetail.data?.username }}</div>
                    <el-tag :type="getRoleTagType(userDetail.data?.role)" class="user-role">
                      {{ getRoleName(userDetail.data?.role) }}
                    </el-tag>
                  </div>
                </el-col>
                
                <el-col :span="16">
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="用户ID">
                      {{ userDetail.data?.id }}
                    </el-descriptions-item>
                    <el-descriptions-item label="用户名">
                      {{ userDetail.data?.username }}
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号">
                      {{ userDetail.data?.phone || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="邮箱">
                      {{ userDetail.data?.email || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">
                      {{ formatDateTime(userDetail.data?.createTime) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="最后登录">
                      {{ formatDateTime(userDetail.data?.lastLoginTime) || '从未登录' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="更新时间">
                      {{ formatDateTime(userDetail.data?.updateTime) }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 用户偏好设置 -->
          <el-card class="mt-4" v-if="userDetail.data?.preferenceJson">
            <template #header>
              <span>偏好设置</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="主题">
                <el-tag>{{ userDetail.data.preferenceJson.theme || 'light' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="语言">
                <el-tag>{{ userDetail.data.preferenceJson.language || 'zh-CN' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 登录历史 -->
          <el-card class="mt-4">
            <template #header>
              <div class="card-header">
                <span>登录历史</span>
                <el-button type="primary" link @click="loadLoginHistory">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </template>
            
            <el-skeleton :rows="3" animated v-if="loginHistory.loading" />
            
            <div v-else-if="loginHistory.list.length === 0" class="empty-data">
              <el-empty description="暂无登录记录" />
            </div>
            
            <el-timeline v-else>
              <el-timeline-item
                v-for="(item, index) in loginHistory.list"
                :key="index"
                :timestamp="formatDateTime(item.loginTime)"
                :type="index === 0 ? 'primary' : ''"
              >
                <div class="login-item">
                  <div class="login-info">
                    <span class="login-ip">IP: {{ item.ipAddress }}</span>
                    <span class="login-location">{{ item.location || '未知位置' }}</span>
                  </div>
                  <div class="login-device">{{ item.device || '未知设备' }}</div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <!-- 右侧操作卡片 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-card class="actions-card">
            <template #header>
              <span>快速操作</span>
            </template>
            
            <div class="action-buttons">
              <el-button 
                :type="userDetail.data?.status === 'NORMAL' ? 'warning' : 'success'"
                size="large" 
                style="width: 100%; margin-bottom: 12px;"
                @click="toggleUserStatus"
                :loading="statusLoading"
              >
                <el-icon>
                  <SwitchButton v-if="userDetail.data?.status === 'NORMAL'" />
                  <Unlock v-else />
                </el-icon>
                {{ userDetail.data?.status === 'NORMAL' ? '禁用用户' : '启用用户' }}
              </el-button>
              
              <el-button 
                type="primary" 
                size="large" 
                style="width: 100%; margin-bottom: 12px;"
                @click="handleEdit"
              >
                <el-icon><Edit /></el-icon>
                编辑信息
              </el-button>
              
              <el-button 
                type="danger" 
                size="large" 
                style="width: 100%;"
                @click="handleDelete"
              >
                <el-icon><Delete /></el-icon>
                删除用户
              </el-button>
            </div>
          </el-card>

          <!-- 统计信息 -->
          <el-card class="mt-4">
            <template #header>
              <span>统计信息</span>
            </template>
            
            <div class="stats-info">
              <div class="stat-item">
                <div class="stat-label">注册时间</div>
                <div class="stat-value">{{ formatRelativeTime(userDetail.data?.createTime) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">最后活跃</div>
                <div class="stat-value">{{ formatRelativeTime(userDetail.data?.lastLoginTime) || '从未登录' }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">登录次数</div>
                <div class="stat-value">{{ loginHistory.total || 0 }} 次</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialog.visible"
      title="编辑用户信息"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editDialog.form"
        :rules="editDialog.rules"
        label-width="80px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editDialog.form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editDialog.form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editDialog.form.role" style="width: 100%">
            <el-option label="普通用户" value="USER" />
            <el-option label="机构用户" value="ORG" />
            <el-option label="管理员" value="ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editDialog.form.status">
            <el-radio label="NORMAL">正常</el-radio>
            <el-radio label="BANNED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editDialog.form.avatar" :src="editDialog.form.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="editDialog.loading">
          保存
        </el-button>
      </template>
    </el-dialog>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, 
  Edit, 
  Delete, 
  SwitchButton, 
  Unlock, 
  Refresh,
  Plus
} from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { adminAPI } from '@/api/modules/admin.js'

const route = useRoute()
const router = useRouter()

// 用户详情数据
const userDetail = reactive({
  loading: false,
  data: null
})

// 登录历史数据
const loginHistory = reactive({
  loading: false,
  list: [],
  total: 0
})

// 状态加载
const statusLoading = ref(false)

// 编辑对话框
const editDialog = reactive({
  visible: false,
  loading: false,
  form: {
    phone: '',
    email: '',
    role: '',
    avatar: '',
    status: ''
  },
  rules: {
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  }
})

// 上传地址
const uploadUrl = '/api/upload'

// 工具函数
const getRoleTagType = (role) => ({ 'USER': 'primary', 'ORG': 'success', 'ADMIN': 'danger' }[role] || 'info')
const getStatusTagType = (status) => status === 'NORMAL' ? 'success' : 'danger'
const getRoleName = (role) => ({ 'USER': '普通用户', 'ORG': '机构用户', 'ADMIN': '管理员' }[role] || role)
const getStatusName = (status) => status === 'NORMAL' ? '正常' : '已禁用'

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleString('zh-CN')
}

const formatRelativeTime = (dateTime) => {
  if (!dateTime) return ''
  const now = new Date()
  const date = new Date(dateTime)
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return date.toLocaleDateString('zh-CN')
}

// 加载用户详情
const loadUserDetail = async () => {
  try {
    userDetail.loading = true
    const userId = route.params.id
    const response = await adminAPI.getUserDetail(userId)
    userDetail.data = response.data
  } catch (error) {
    ElMessage.error('加载用户详情失败')
    router.push('/admin/users')
  } finally {
    userDetail.loading = false
  }
}

// 加载登录历史
const loadLoginHistory = async () => {
  try {
    loginHistory.loading = true
    const userId = route.params.id
    // 模拟登录历史数据，实际项目中需要调用真实API
    loginHistory.list = [
      {
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.100',
        location: '北京市',
        device: 'Chrome/Windows'
      },
      {
        loginTime: new Date(Date.now() - 86400000).toISOString(),
        ipAddress: '114.114.114.114',
        location: '上海市',
        device: 'Safari/iPhone'
      }
    ]
    loginHistory.total = loginHistory.list.length
  } catch (error) {
    console.error('加载登录历史失败:', error)
  } finally {
    loginHistory.loading = false
  }
}

// 返回列表
const goBack = () => {
  router.push('/admin/users')
}

// 编辑用户
const handleEdit = () => {
  if (!userDetail.data) return
  
  editDialog.form = {
    phone: userDetail.data.phone || '',
    email: userDetail.data.email || '',
    role: userDetail.data.role,
    avatar: userDetail.data.avatar || '',
    status: userDetail.data.status
  }
  editDialog.visible = true
}

// 保存编辑
const saveEdit = async () => {
  try {
    editDialog.loading = true
    await adminAPI.updateUser(route.params.id, editDialog.form)
    ElMessage.success('更新成功')
    editDialog.visible = false
    loadUserDetail()
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    editDialog.loading = false
  }
}

// 切换用户状态
const toggleUserStatus = async () => {
  try {
    const newStatus = userDetail.data.status === 'NORMAL' ? 'BANNED' : 'NORMAL'
    const actionText = newStatus === 'BANNED' ? '禁用' : '启用'
    
    await ElMessageBox.confirm(
      `确定要${actionText}该用户吗？`,
      '提示',
      { type: 'warning' }
    )
    
    statusLoading.value = true
    await adminAPI.updateUser(route.params.id, { status: newStatus })
    ElMessage.success(`${actionText}成功`)
    loadUserDetail()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  } finally {
    statusLoading.value = false
  }
}

// 删除用户
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该用户吗？此操作不可恢复！',
      '警告',
      { type: 'warning' }
    )
    
    await adminAPI.batchDeleteUsers([route.params.id])
    ElMessage.success('删除成功')
    router.push('/admin/users')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 头像上传成功
const handleAvatarSuccess = (response) => {
  if (response.data?.url) {
    editDialog.form.avatar = response.data.url
  }
}

// 头像上传前校验
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

onMounted(() => {
  loadUserDetail()
  loadLoginHistory()
})
</script>

<style scoped>
.user-detail-container {
  padding: 20px;
}

.user-info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info-content {
  padding: 20px 0;
}

.avatar-section {
  text-align: center;
  padding: 20px;
}

.user-avatar {
  margin-bottom: 16px;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.user-role {
  font-size: 14px;
}

.actions-card {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats-info {
  padding: 10px 0;
}

.stat-item {
  margin-bottom: 16px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.login-item {
  padding: 8px 0;
}

.login-info {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.login-ip {
  font-weight: 500;
}

.login-location {
  color: #909399;
}

.login-device {
  font-size: 14px;
  color: #606266;
}

.empty-data {
  text-align: center;
  padding: 40px 0;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.mt-4 {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .user-detail-container {
    padding: 10px;
  }
  
  .avatar-section {
    margin-bottom: 20px;
  }
}
</style>