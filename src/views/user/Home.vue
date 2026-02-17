<template>
    <PageHeader title="首页">
      <template #actions>
        <div v-if="isOrgUser || isAdminUser" class="role-actions">
          <el-button v-if="isOrgUser" type="primary" @click="goToOrgHome">
            <el-icon><OfficeBuilding /></el-icon>
            机构管理
          </el-button>
          <el-button v-if="isAdminUser" type="danger" @click="goToAdminHome">
            <el-icon><Setting /></el-icon>
            管理后台
          </el-button>
        </div>
      </template>
    </PageHeader>
    
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="page-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索宠物名称、品种..."
          size="large"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-section">
      <div class="page-container">
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category.key"
            class="category-item"
            @click="handleCategoryClick(category)"
          >
            <div class="category-icon" :style="{ background: category.color }">
              <el-icon size="24"><component :is="category.icon" /></el-icon>
            </div>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐宠物 -->
    <div class="recommended-section">
      <div class="page-container">
        <div class="section-header">
          <h2 class="section-title">为你推荐</h2>
          <router-link to="/pets" class="view-all">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <div class="pet-grid" v-loading="loading">
          <PetCard
            v-for="pet in recommendedPets"
            :key="pet.id"
            :pet="pet"
            @click="handlePetClick"
          />
        </div>
        
        <div class="load-more" v-if="hasMore">
          <el-button @click="loadMore" :loading="loadingMore">
            加载更多
          </el-button>
        </div>
      </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { useAuthStore } from '@/stores/auth.js'
import PageHeader from '@/components/common/PageHeader.vue'
import PetCard from '@/components/common/PetCard.vue'
import { Search, ArrowRight, MoreFilled, Folder, Star, Clock, Compass, OfficeBuilding, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

// 响应式数据
const searchKeyword = ref('')
const loading = ref(false)
const loadingMore = ref(false)
const recommendedPets = ref([])
const hasMore = ref(true)
const page = ref(1)

// 计算属性
const isOrgUser = computed(() => {
  const userRole = authStore.userRole
  console.log('当前用户角色:', userRole)
  return userRole === 'ORG' || userRole === 'ROLE_ORG'
})
const isAdminUser = computed(() => {
  const userRole = authStore.userRole
  console.log('当前用户是否为管理员:', userRole)
  return userRole === 'ADMIN' || userRole === 'ROLE_ADMIN'
})

// 分类数据
const categories = [
  { key: 'cat', name: '猫咪', icon: 'Star', color: '#FFB6C1' },
  { key: 'dog', name: '狗狗', icon: 'Star', color: '#87CEEB' },
  { key: 'other', name: '其他', icon: 'MoreFilled', color: '#98FB98' },
  { key: 'nearby', name: '附近', icon: 'Compass', color: '#DDA0DD' },
  { key: 'urgent', name: '急寻', icon: 'Clock', color: '#F0E68C' },
  { key: 'young', name: '幼宠', icon: 'Folder', color: '#FFE4B5' }
]

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/pets',
      query: { keyword: searchKeyword.value.trim() }
    })
  }
}

const goToOrgHome = () => {
  router.push('/org')
}

const goToAdminHome = () => {
  router.push('/admin')
}

const handleCategoryClick = (category) => {
  router.push({
    path: '/pets',
    query: { category: category.key }
  })
}

const handlePetClick = (pet) => {
  router.push(`/pets/${pet.id}`)
}

const loadRecommendedPets = async (isLoadMore = false) => {
  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
    }

    // TODO: 调用API获取推荐宠物
    // const params = {
    //   page: page.value,
    //   pageSize: 12,
    //   lat: appStore.location.latitude,
    //   lng: appStore.location.longitude
    // }
    // const { data } = await petAPI.getRecommendedPets(params)
    
    // 模拟数据
    const mockData = {
      list: Array.from({ length: 12 }, (_, index) => ({
        id: isLoadMore ? (page.value - 1) * 12 + index + 1 : index + 1,
        name: ['小橘', '咪咪', '旺财', '贝贝', '豆豆', '球球'][index % 6],
        breed: ['橘猫', '英短', '哈士奇', '金毛', '柯基', '布偶猫'][index % 6],
        age: Math.random() * 10,
        gender: index % 2 === 0 ? 'male' : 'female',
        status: 'available',
        images: [`https://picsum.photos/seed/pet${index}/400/300.jpg`],
        tags: ['粘人', '已绝育', '疫苗齐'].slice(0, Math.floor(Math.random() * 3) + 1),
        distance: Math.random() * 10,
        matchScore: Math.random() * 100,
        organization: {
          name: '爱心动物救助站'
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })),
      totalPages: 5
    }

    if (isLoadMore) {
      recommendedPets.value.push(...mockData.list)
    } else {
      recommendedPets.value = mockData.list
    }

    hasMore.value = page.value < mockData.totalPages
    if (hasMore.value) {
      page.value++
    }
  } catch (error) {
    console.error('加载推荐宠物失败:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  loadRecommendedPets(true)
}

// 生命周期
onMounted(() => {
  loadRecommendedPets()
  
  // 调试信息
  console.log('=== 首页调试信息 ===')
  console.log('当前用户:', authStore.user)
  console.log('用户角色:', authStore.userRole)
  console.log('是否为管理员:', authStore.isAdmin)
  console.log('权限列表:', authStore.permissions)
  console.log('===================')
})
</script>

<style scoped>
.search-section {
  padding: var(--spacing-lg) 0;
  background: white;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}

.category-section {
  padding: var(--spacing-xl) 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-md);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  cursor: pointer;
  border-radius: var(--border-radius-large);
  transition: all var(--transition-fast);
}

.category-item:hover {
  background: var(--bg-light);
  transform: translateY(-2px);
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: var(--spacing-sm);
}

.category-name {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
}

.recommended-section {
  padding: var(--spacing-xl) 0;
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.load-more {
  text-align: center;
}

.role-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .role-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .role-actions .el-button {
    width: 100%;
    justify-content: flex-start;
  }
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }
  
  .category-icon {
    width: 50px;
    height: 50px;
  }
  
  .pet-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>