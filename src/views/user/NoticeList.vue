<template>

    <PageHeader title="系统公告" />
    
    <div class="page-container">
      <el-card>
        <div class="notice-list-container">
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="3" animated />
          </div>
          
          <div v-else-if="noticeList.length === 0" class="empty-container">
            <el-empty description="暂无公告" />
          </div>
          
          <div v-else class="notice-items">
            <div 
              v-for="notice in noticeList" 
              :key="notice.id"
              class="notice-item"
              @click="handleViewDetail(notice)"
            >
              <div class="notice-header">
                <h3 class="notice-title">{{ notice.title }}</h3>
                <el-tag v-if="isNewNotice(notice.createTime)" type="danger" size="small" effect="plain">
                  最新
                </el-tag>
              </div>
              <div class="notice-meta">
                <span class="create-time">{{ notice.createTime }}</span>
              </div>
          <div class="notice-excerpt">
            {{ getNoticeExcerpt(notice.contentSummary || notice.content) }}
          </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div v-if="total > pageSize" class="pagination-container">
            <el-pagination
              v-model:current-page="pageNo"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50]"
              layout="total, prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-card>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticeStore } from '@/stores/notice.js'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const noticeStore = useNoticeStore()

// 分页参数
const pageNo = ref(1)
const pageSize = ref(10)

// 计算属性
const noticeList = computed(() => noticeStore.userNoticeList)
const total = computed(() => noticeStore.userTotal)
const loading = computed(() => noticeStore.loading)

// 判断是否为最新公告（7天内）
const isNewNotice = (createTime) => {
  if (!createTime) return false
  const createDate = new Date(createTime)
  const now = new Date()
  const diffTime = Math.abs(now - createDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

// 获取公告摘要
const getNoticeExcerpt = (content) => {
  if (!content) return ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// 查看公告详情
const handleViewDetail = (notice) => {
  router.push(`/notices/${notice.id}`)
}

// 分页处理
const handlePageChange = (page) => {
  pageNo.value = page
  loadData()
}

// 加载数据
const loadData = async () => {
  const params = {
    page: pageNo.value,
    size: pageSize.value
  }
  await noticeStore.fetchUserNoticeList(params)
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.notice-list-container {
  min-height: 400px;
}

.loading-container {
  padding: var(--spacing-xl);
}

.empty-container {
  padding: var(--spacing-xxl);
}

.notice-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.notice-item {
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color-light);
  border-radius: var(--border-radius-base);
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.notice-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.1);
  transform: translateY(-1px);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.notice-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.notice-meta {
  margin-bottom: var(--spacing-sm);
}

.create-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.notice-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.pagination-container {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .notice-item {
    padding: var(--spacing-md);
  }
  
  .notice-title {
    font-size: 15px;
  }
  
  .notice-excerpt {
    font-size: 13px;
  }
}
</style>