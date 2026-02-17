<template>
  <el-alert
    v-if="showAlert"
    :title="statusInfo.title"
    :type="statusInfo.type"
    :description="statusInfo.message"
    show-icon
    :closable="false"
    class="org-status-alert"
  >
    <template v-if="statusInfo.actions" #default>
      <div class="alert-actions">
        <el-button
          v-for="action in statusInfo.actions"
          :key="action.text"
          :type="action.type || 'primary'"
          size="small"
          @click="handleAction(action)"
        >
          {{ action.text }}
        </el-button>
      </div>
    </template>
  </el-alert>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  // 是否显示在机构页面
  onlyOrg: {
    type: Boolean,
    default: false
  }
})

const showAlert = computed(() => {
  const user = authStore.user
  if (!user) return false
  if (props.onlyOrg && user.role !== 'ORG') return false
  return user.role === 'ORG' && user.orgStatus !== 'APPROVED'
})

const statusInfo = computed(() => {
  const user = authStore.user
  if (!user || user.role !== 'ORG') return {}

  const map = {
    'PENDING': {
      type: 'warning',
      title: '机构审核中',
      message: '您的机构资料正在审核中，请耐心等待。审核通过后即可发布宠物信息。',
      actions: [
        { text: '查看状态', handler: () => router.push('/org/waiting') },
        { text: '修改资料', handler: () => router.push('/org/profile') }
      ]
    },
    'REJECTED': {
      type: 'error',
      title: '机构认证被拒绝',
      message: '您的机构资料被拒绝，请根据反馈修改后重新提交。',
      actions: [
        { text: '修改资料', handler: () => router.push('/org/profile/rejected'), type: 'danger' }
      ]
    },
    'APPROVED': {
      type: 'success',
      title: '机构已认证',
      message: '恭喜！您的机构已通过认证，可以正常使用所有功能。'
    }
  }

  return map[user.orgStatus] || {}
})

const handleAction = (action) => {
  if (typeof action.handler === 'function') {
    action.handler()
  }
}

// 暴露刷新方法给父组件
const refresh = async () => {
  try {
    await authStore.getCurrentUser()
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

defineExpose({
  refresh
})
</script>

<style scoped>
.org-status-alert {
  margin-bottom: 16px;
}

.alert-actions {
  margin-top: 8px;
}

.alert-actions .el-button {
  margin-right: 8px;
}
</style>