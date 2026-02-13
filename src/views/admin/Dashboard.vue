<template>
  <div class="admin-dashboard">
    <PageHeader title="管理控制台" />

    <!-- 数据概览 -->
    <div class="overview-section">
      <div class="page-container">
        <el-row :gutter="24">
          <el-col :xs="12" :sm="6">
            <el-card class="overview-card">
              <div class="overview-content">
                <div class="overview-icon users">
                  <el-icon size="24"><User /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-number">{{ stats.totalUsers }}</div>
                  <div class="overview-label">总用户数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <el-card class="overview-card">
              <div class="overview-content">
                <div class="overview-icon orgs">
                  <el-icon size="24"><OfficeBuilding /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-number">{{ stats.totalOrgs }}</div>
                  <div class="overview-label">机构数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <el-card class="overview-card">
              <div class="overview-content">
                <div class="overview-icon pets">
                  <el-icon size="24"><Files /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-number">{{ stats.totalPets }}</div>
                  <div class="overview-label">宠物总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="6">
            <el-card class="overview-card">
              <div class="overview-content">
                <div class="overview-icon adoptions">
                  <el-icon size="24"><Select /></el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-number">{{ stats.totalAdoptions }}</div>
                  <div class="overview-label">成功领养</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 数据图表 -->
    <div class="charts-section">
      <div class="page-container">
        <el-row :gutter="24">
          <el-col :xs="24" :md="12">
            <el-card>
              <template #header>
                <h3>用户增长趋势</h3>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表组件待集成" />
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :md="12">
            <el-card>
              <template #header>
                <h3>领养申请统计</h3>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表组件待集成" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 待处理事项 -->
    <div class="pending-section">
      <div class="page-container">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>待处理事项</h3>
              <el-button text @click="router.push('/admin/pet-audits')">
                查看全部
              </el-button>
            </div>
          </template>
          
          <el-tabs v-model="activeTab">
            <el-tab-pane label="待审核宠物" name="pets">
              <div v-if="pendingPets.length === 0" class="empty-state">
                <el-empty description="暂无待审核宠物" />
              </div>
              <div v-else class="pending-list">
                <div 
                  v-for="pet in pendingPets" 
                  :key="pet.id"
                  class="pending-item"
                >
                  <el-image
                    :src="pet.image"
                    :alt="pet.name"
                    class="pending-image"
                    fit="cover"
                  />
                  <div class="pending-info">
                    <div class="pending-title">{{ pet.name }}</div>
                    <div class="pending-meta">
                      <el-tag size="small">{{ pet.breed }}</el-tag>
                      <span class="pending-time">{{ formatTime(pet.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="pending-actions">
                    <el-button 
                      type="success" 
                      size="small"
                      @click="handleAuditPet(pet.id, 'approve')"
                    >
                      通过
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small"
                      @click="handleAuditPet(pet.id, 'reject')"
                    >
                      拒绝
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="待审核机构" name="orgs">
              <div v-if="pendingOrgs.length === 0" class="empty-state">
                <el-empty description="暂无待审核机构" />
              </div>
              <div v-else class="pending-list">
                <div 
                  v-for="org in pendingOrgs" 
                  :key="org.id"
                  class="pending-item"
                >
                  <div class="org-avatar">
                    <el-icon><OfficeBuilding /></el-icon>
                  </div>
                  <div class="pending-info">
                    <div class="pending-title">{{ org.name }}</div>
                    <div class="pending-meta">
                      <span>联系人：{{ org.contact }}</span>
                      <span class="pending-time">{{ formatTime(org.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="pending-actions">
                    <el-button 
                      type="success" 
                      size="small"
                      @click="handleAuditOrg(org.id, 'approve')"
                    >
                      通过
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small"
                      @click="handleAuditOrg(org.id, 'reject')"
                    >
                      拒绝
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <div class="page-container">
        <el-row :gutter="16">
          <el-col :xs="12" :sm="4">
            <div class="action-item" @click="router.push('/admin/pet-audits')">
              <el-icon size="32"><Document /></el-icon>
              <div>宠物审核</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="4">
            <div class="action-item" @click="router.push('/admin/users')">
              <el-icon size="32"><User /></el-icon>
              <div>用户管理</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="4">
            <div class="action-item" @click="router.push('/admin/notices')">
              <el-icon size="32"><Bell /></el-icon>
              <div>公告管理</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="4">
            <div class="action-item" @click="router.push('/admin/tags')">
              <el-icon size="32"><Collection /></el-icon>
              <div>标签管理</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="4">
            <div class="action-item" @click="router.push('/admin/config')">
              <el-icon size="32"><Setting /></el-icon>
              <div>系统配置</div>
            </div>
          </el-col>
          
          <el-col :xs="12" :sm="4">
            <div class="action-item" @click="router.push('/admin/audit-logs')">
              <el-icon size="32"><Document /></el-icon>
              <div>审计日志</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import PageHeader from '@/components/common/PageHeader.vue'
import { 
  User, OfficeBuilding, Files, Select, Document, Bell,
  Collection, Setting 
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const activeTab = ref('pets')
const stats = ref({
  totalUsers: 0,
  totalOrgs: 0,
  totalPets: 0,
  totalAdoptions: 0
})

const pendingPets = ref([])
const pendingOrgs = ref([])

// 方法
const formatTime = (time) => {
  return new Date(time).toLocaleString()
}

const handleAuditPet = async (petId, action) => {
  try {
    // TODO: 调用审核API
    console.log(`审核宠物 ${petId}: ${action}`)
    
    // 从列表中移除
    const index = pendingPets.value.findIndex(pet => pet.id === petId)
    if (index > -1) {
      pendingPets.value.splice(index, 1)
    }
  } catch (error) {
    console.error('审核失败:', error)
  }
}

const handleAuditOrg = async (orgId, action) => {
  try {
    // TODO: 调用审核API
    console.log(`审核机构 ${orgId}: ${action}`)
    
    // 从列表中移除
    const index = pendingOrgs.value.findIndex(org => org.id === orgId)
    if (index > -1) {
      pendingOrgs.value.splice(index, 1)
    }
  } catch (error) {
    console.error('审核失败:', error)
  }
}

const loadDashboardData = async () => {
  try {
    // TODO: 调用API获取数据
    // 模拟数据
    stats.value = {
      totalUsers: 1250,
      totalOrgs: 45,
      totalPets: 680,
      totalAdoptions: 320
    }
    
    pendingPets.value = [
      {
        id: 1,
        name: '小白',
        breed: '萨摩耶',
        image: 'https://picsum.photos/seed/pet1/100/100.jpg',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        name: '黑黑',
        breed: '黑猫',
        image: 'https://picsum.photos/seed/pet2/100/100.jpg',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]
    
    pendingOrgs.value = [
      {
        id: 1,
        name: '爱心宠物救助中心',
        contact: '王经理',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 检查权限
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  if (!authStore.checkPermission('admin:access')) {
    router.push('/403')
    return
  }
  
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--bg-light);
}

.overview-section {
  padding: var(--spacing-lg) 0;
}

.overview-card {
  margin-bottom: var(--spacing-md);
}

.overview-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.overview-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.overview-icon.users {
  background: linear-gradient(45deg, #409EFF, #66B1FF);
}

.overview-icon.orgs {
  background: linear-gradient(45deg, #67C23A, #85CE61);
}

.overview-icon.pets {
  background: linear-gradient(45deg, #E6A23C, #EEBE77);
}

.overview-icon.adoptions {
  background: linear-gradient(45deg, #F56C6C, #F78989);
}

.overview-info {
  flex: 1;
}

.overview-number {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.overview-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.charts-section {
  padding: 0 0 var(--spacing-lg) 0;
}

.charts-section h3 {
  margin: 0;
  color: var(--text-primary);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-section {
  padding: 0 0 var(--spacing-lg) 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.empty-state {
  padding: var(--spacing-xl) 0;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.pending-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-fast);
}

.pending-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-light);
}

.pending-image {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-base);
  flex-shrink: 0;
}

.org-avatar {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-base);
  background: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.pending-info {
  flex: 1;
}

.pending-title {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.pending-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.pending-time {
  margin-left: auto;
}

.pending-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.quick-actions {
  padding: var(--spacing-lg) 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--border-radius-large);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-regular);
}

.action-item:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

@media (max-width: 768px) {
  .overview-section,
  .charts-section,
  .pending-section,
  .quick-actions {
    padding: var(--spacing-md) 0;
  }
  
  .overview-content {
    gap: var(--spacing-sm);
  }
  
  .overview-icon {
    width: 50px;
    height: 50px;
  }
  
  .overview-number {
    font-size: var(--font-size-lg);
  }
  
  .pending-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .pending-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .pending-time {
    margin-left: 0;
  }
}
</style>