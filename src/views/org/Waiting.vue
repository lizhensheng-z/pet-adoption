<template>

    <div class="waiting-container">
      <el-card class="waiting-card">
        <div class="waiting-content">
          <el-icon class="waiting-icon" size="64" color="#FF8C42">
            <Clock />
          </el-icon>
          <h2>机构审核中</h2>
          <p class="waiting-text">
            您的机构资料已提交审核，请耐心等待<br />
            审核通常需要1-3个工作日
          </p>
          
          <div class="waiting-actions">
            <el-button type="primary" @click="refreshStatus">
              刷新状态
            </el-button>
            <el-button @click="viewProfile">
              查看资料
            </el-button>
            <el-button @click="contactSupport">
              联系客服
            </el-button>
          </div>

          <div class="waiting-tips">
            <h4>温馨提示：</h4>
            <ul>
              <li>请确保联系方式畅通，便于审核人员联系</li>
              <li>审核通过后，您将收到短信和邮件通知</li>
              <li>如有疑问，可联系客服：400-123-4567</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.js'
import { orgAPI } from '@/api/modules/org.js'

const router = useRouter()
const authStore = useAuthStore()

const refreshStatus = async () => {
  try {
    console.log('开始刷新机构审核状态...')
    await authStore.getCurrentUser()
    const user = authStore.user
    console.log('获取到的用户信息:', user)
    
    if (user?.orgStatus === 'APPROVED') {
      ElMessage.success('恭喜！机构审核已通过')
      router.push('/org/dashboard')
    } else if (user?.orgStatus === 'REJECTED') {
      ElMessage.warning('机构审核未通过，请修改资料后重新提交')
      router.push('/org/profile/rejected')
    } else {
      ElMessage.info('审核仍在进行中，请耐心等待')
    }
  } catch (error) {
    console.error('刷新状态失败:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    })
    ElMessage.error('获取状态失败，请稍后重试')
  }
}

const viewProfile = () => {
  router.push('/org/profile')
}

const contactSupport = () => {
  // 可以跳转到客服页面或打开客服聊天窗口
  window.open('https://work.weixin.qq.com/kfid/kfcxxxxx', '_blank')
}
</script>

<style scoped>
.waiting-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 40px 20px;
}

.waiting-card {
  max-width: 600px;
  text-align: center;
}

.waiting-content {
  padding: 40px 20px;
}

.waiting-icon {
  margin-bottom: 24px;
}

.waiting-content h2 {
  color: var(--text-primary);
  margin-bottom: 16px;
  font-size: 24px;
}

.waiting-text {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.waiting-actions {
  margin-bottom: 40px;
}

.waiting-actions .el-button {
  margin: 0 8px;
}

.waiting-tips {
  text-align: left;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.waiting-tips h4 {
  color: var(--text-primary);
  margin-bottom: 12px;
}

.waiting-tips ul {
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
}

.waiting-tips li {
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>