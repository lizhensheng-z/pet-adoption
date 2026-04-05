<template>

    <PageHeader :title="notice?.title || '公告详情'" show-back />
    
    <div class="page-container">
      <el-card v-loading="loading">
        <div v-if="notice" class="notice-detail">
          <div class="notice-header">
            <h1 class="notice-title">{{ notice.title }}</h1>
            <div class="notice-meta">
              <span class="create-time">
                <el-icon><Clock /></el-icon>
                发布时间：{{ notice.createTime }}
              </span>
              <span v-if="notice.updateTime !== notice.createTime" class="update-time">
                <el-icon><Refresh /></el-icon>
                更新时间：{{ notice.updateTime }}
              </span>
            </div>
          </div>
          
          <div class="notice-content">
          <div class="content-text" v-html="formatContent(notice.content || notice.contentSummary)"></div>
          </div>
          
          <div class="notice-footer">
            <el-button type="primary" @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回列表
            </el-button>
            <el-button @click="handlePrint">
              <el-icon><Printer /></el-icon>
              打印
            </el-button>
          </div>
        </div>
        
        <div v-else class="error-container">
          <el-result
            icon="error"
            title="公告不存在"
            subTitle="您查看的公告可能已被删除或不存在"
          >
            <template #extra>
              <el-button type="primary" @click="handleBack">
                返回公告列表
              </el-button>
            </template>
          </el-result>
        </div>
      </el-card>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticeStore } from '@/stores/notice.js'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const noticeStore = useNoticeStore()

// 响应式数据
const loading = ref(false)
const notice = computed(() => noticeStore.currentNotice)

// 格式化内容，处理换行符
const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

// 返回列表
const handleBack = () => {
  router.push('/notices')
}

// 打印公告
const handlePrint = () => {
  const printContent = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="text-align: center; margin-bottom: 20px;">${notice.value?.title}</h1>
      <div style="text-align: center; margin-bottom: 30px; color: #666; font-size: 14px;">
        <p>发布时间：${notice.value?.createTime}</p>
        ${notice.value?.updateTime !== notice.value?.createTime ? `<p>更新时间：${notice.value?.updateTime}</p>` : ''}
      </div>
      <div style="line-height: 1.8; font-size: 16px;">
        ${formatContent(notice.value?.content)}
      </div>
    </div>
  `
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.print()
}

// 加载公告详情
const loadNoticeDetail = async () => {
  const noticeId = route.params.id
  if (!noticeId) {
    handleBack()
    return
  }
  
  loading.value = true
  try {
    const response = await noticeStore.fetchUserNoticeDetail(noticeId)
    if (response.code !== 10000) {
      ElMessage.error(response.message || '获取公告详情失败')
    }
  } catch (error) {
    console.error('加载公告详情失败:', error)
    ElMessage.error('加载公告详情失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadNoticeDetail()
})

// 路由离开时清理数据
import { onBeforeRouteLeave } from 'vue-router'
import { ElMessage } from 'element-plus'

onBeforeRouteLeave(() => {
  noticeStore.clearCurrentNotice()
})
</script>

<style scoped>
.notice-detail {
  max-width: 800px;
  margin: 0 auto;
}

.notice-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color-light);
}

.notice-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.notice-meta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.create-time,
.update-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 14px;
  color: var(--text-secondary);
}

.notice-content {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg);
  background: var(--bg-light);
  border-radius: var(--border-radius-base);
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.notice-footer {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color-light);
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .notice-title {
    font-size: 20px;
  }
  
  .content-text {
    font-size: 15px;
  }
  
  .notice-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .notice-footer {
    flex-direction: column;
    align-items: center;
  }
}
</style>