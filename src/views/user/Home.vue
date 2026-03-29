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
import { petAPI } from '@/api/modules/pet.js'
import { ElMessage } from 'element-plus'

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

const handleCategoryClick = async (category) => {
  const query = { category: category.key }

  // 附近：按距离排序，需要用户位置
  if (category.key === 'nearby') {
    // 尝试获取用户位置
    if (appStore.location && appStore.location.latitude && appStore.location.longitude) {
      query.lng = appStore.location.longitude
      query.lat = appStore.location.latitude
      query.sortBy = 'distance'
    } else {
      // 尝试获取浏览器位置
      try {
        const position = await getUserLocation()
        query.lng = position.lng
        query.lat = position.lat
        query.sortBy = 'distance'
      } catch (error) {
        ElMessage.warning('无法获取您的位置，请开启定位权限')
        return
      }
    }
  }

  // 幼宠：按年龄升序
  if (category.key === 'young') {
    query.sortBy = 'age_month'
    query.order = 'asc'
  }

  router.push({
    path: '/pets',
    query
  })
}

// 获取用户位置
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
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

    // 获取用户位置
    const location = appStore.location || {}

    // 调用推荐API
    const params = {
      page: page.value,
      pageSize: 12,
      lng: location.longitude,
      lat: location.latitude
    }

    const { data } = await petAPI.getRecommendedPets(params)

    if (isLoadMore) {
      recommendedPets.value.push(...data.list)
    } else {
      recommendedPets.value = data.list
    }

    // 计算总页数
    const totalPages = Math.ceil(data.total / params.pageSize)
    hasMore.value = page.value < totalPages
    if (hasMore.value) {
      page.value++
    }
  } catch (error) {
    console.error('加载推荐宠物失败:', error)
    ElMessage.error('加载推荐宠物失败')
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