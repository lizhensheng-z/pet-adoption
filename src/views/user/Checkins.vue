<template>

    <PageHeader title="我的打卡">
      <template #actions>
        <el-button type="primary" @click="handleCreateCheckin">
          <el-icon><Plus /></el-icon>
          发布打卡
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <!-- 信用看板 -->
      <CreditBoard :credit-data="creditData" v-loading="loading.credit" />

      <!-- 标签页 -->
      <el-card class="content-card">
        <el-tabs v-model="activeTab" class="checkin-tabs">
          <el-tab-pane label="打卡历程" name="history">
            <div class="checkin-list" v-loading="loading.checkins">
              <div v-if="checkinList.length === 0" class="empty-state">
                <el-empty 
                  description="还没有打卡记录，快去发布第一条打卡吧！" 
                  :image-size="200"
                />
              </div>
              
              <div v-else class="timeline-container">
                <el-timeline>
                  <el-timeline-item
                    v-for="checkin in checkinList"
                    :key="checkin.id"
                    :timestamp="formatDate(checkin.createTime)"
                    :type="checkin.creditDelta > 0 ? 'success' : 'info'"
                    placement="top"
                  >
                    <CheckinCard :checkin="checkin" @delete="handleDeleteCheckin" />
                  </el-timeline-item>
                </el-timeline>
                
                <!-- 加载更多 -->
                <div v-if="hasMore" class="load-more">
                  <el-button 
                    :loading="loading.more" 
                    @click="loadMoreCheckins"
                    text
                    type="primary"
                  >
                    加载更多
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="信用明细" name="credit">
            <div class="credit-logs" v-loading="loading.creditLogs">
              <div v-if="creditLogs.length === 0" class="empty-state">
                <el-empty description="暂无信用记录" />
              </div>
              
              <el-timeline v-else>
                <el-timeline-item
                  v-for="log in creditLogs"
                  :key="log.id"
                  :timestamp="formatDate(log.createTime)"
                  :type="log.delta > 0 ? 'success' : 'danger'"
                >
                  <div class="credit-log-item">
                    <div class="log-content">{{ log.reason }}</div>
                    <div class="log-score" :class="{ positive: log.delta > 0 }">
                      {{ log.delta > 0 ? '+' : '' }}{{ log.delta }}分
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>

          <el-tab-pane label="我的宠物" name="pets">
            <div class="my-pets" v-loading="loading.pets">
              <div v-if="myPets.length === 0" class="empty-state">
                <el-empty description="暂无已领养宠物" />
              </div>
              
              <el-row v-else :gutter="16">
                <el-col 
                  v-for="pet in myPets" 
                  :key="pet.petId" 
                  :xs="24" 
                  :sm="12" 
                  :md="8" 
                  :lg="6"
                >
                  <PetCard :pet="pet" @checkin="handlePetCheckin" />
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Star } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import CreditBoard from '@/components/common/CreditBoard.vue'
import CheckinCard from '@/components/common/CheckinCard.vue'
import PetCard from '@/components/common/PetCard.vue'
import {
  getMyCheckins,
  getCreditSummary,
  getCreditLogs,
  getMyAdoptedPets,
  deleteCheckin
} from '@/api/modules/checkin.js'

const router = useRouter()

// 响应式数据
const activeTab = ref('history')
const creditData = ref({})
const checkinList = ref([])
const creditLogs = ref([])
const myPets = ref([])
const loading = ref({
  credit: false,
  checkins: false,
  creditLogs: false,
  pets: false,
  more: false
})
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})
const hasMore = computed(() => {
  return pagination.value.pageNo < pagination.value.totalPages
})

// 获取信用摘要
const fetchCreditSummary = async () => {
  loading.value.credit = true
  try {
    const res = await getCreditSummary()
    creditData.value = res.data || {}
  } catch (error) {
    console.error('获取信用摘要失败:', error)
  } finally {
    loading.value.credit = false
  }
}

// 获取打卡列表
const fetchCheckins = async (loadMore = false) => {
  if (loadMore) {
    loading.value.more = true
  } else {
    loading.value.checkins = true
  }
  
  try {
    const params = {
      pageNo: loadMore ? pagination.value.pageNo + 1 : 1,
      pageSize: pagination.value.pageSize
    }
    const res = await getMyCheckins(params)
    const { list, ...pageInfo } = res.data || {}
    
    if (loadMore) {
      checkinList.value.push(...list)
    } else {
      checkinList.value = list || []
    }
    
    pagination.value = pageInfo
  } catch (error) {
    console.error('获取打卡列表失败:', error)
    ElMessage.error('获取打卡列表失败')
  } finally {
    loading.value.checkins = false
    loading.value.more = false
  }
}

// 获取信用流水
const fetchCreditLogs = async () => {
  loading.value.creditLogs = true
  try {
    const res = await getCreditLogs({
      pageNo: 1,
      pageSize: 20
    })
    creditLogs.value = res.data?.list || []
  } catch (error) {
    console.error('获取信用流水失败:', error)
  } finally {
    loading.value.creditLogs = false
  }
}

// 获取已领养宠物
const fetchMyPets = async () => {
  loading.value.pets = true
  try {
    const res = await getMyAdoptedPets()
    myPets.value = res.data || []
  } catch (error) {
    console.error('获取已领养宠物失败:', error)
  } finally {
    loading.value.pets = false
  }
}

// 处理创建打卡
const handleCreateCheckin = () => {
  router.push('/checkins/create')
}

// 处理宠物打卡
const handlePetCheckin = (pet) => {
  router.push({
    path: '/checkins/create',
    query: { petId: pet.petId, petName: pet.name }
  })
}

// 处理删除打卡
const handleDeleteCheckin = async (checkinId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条打卡记录吗？删除后不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteCheckin(checkinId)
    ElMessage.success('删除成功')
    
    // 重新加载数据
    await fetchCheckins()
    await fetchCreditSummary()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除打卡失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 加载更多打卡
const loadMoreCheckins = () => {
  fetchCheckins(true)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听标签页切换
watch(activeTab, (newTab) => {
  switch (newTab) {
    case 'history':
      if (checkinList.value.length === 0) {
        fetchCheckins()
      }
      break
    case 'credit':
      if (creditLogs.value.length === 0) {
        fetchCreditLogs()
      }
      break
    case 'pets':
      if (myPets.value.length === 0) {
        fetchMyPets()
      }
      break
  }
})

// 初始化
onMounted(() => {
  fetchCreditSummary()
  fetchCheckins()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  border-radius: var(--border-radius-large);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.checkin-tabs {
  min-height: 400px;
}

.empty-state {
  padding: var(--spacing-xxl) 0;
  text-align: center;
}

.timeline-container {
  padding: var(--spacing-lg) 0;
}

.load-more {
  text-align: center;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
}

.credit-logs {
  padding: var(--spacing-lg) 0;
}

.credit-log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.log-content {
  flex: 1;
  color: var(--text-color-primary);
}

.log-score {
  font-weight: bold;
  font-size: 16px;
}

.log-score.positive {
  color: var(--success-color);
}

.log-score:not(.positive) {
  color: var(--danger-color);
}

.my-pets {
  padding: var(--spacing-lg) 0;
}

@media (max-width: 768px) {
  .page-container {
    padding: var(--spacing-md);
  }
  
  .credit-stats {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .timeline-container {
    padding: var(--spacing-md) 0;
  }
}
</style>