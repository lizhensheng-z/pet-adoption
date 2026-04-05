<template>

    <PageHeader title="宠物列表" />
    
    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="page-container">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8" :md="6">
            <el-input
              v-model="filters.keyword"
              placeholder="搜索宠物名称、品种..."
              clearable
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          
          <el-col :xs="24" :sm="16" :md="18">
            <div class="filter-actions">
              <el-button-group>
                <el-button
                  :type="filters.category === 'cat' ? 'primary' : 'default'"
                  @click="handleCategoryChange('cat')"
                >
                  猫咪
                </el-button>
                <el-button
                  :type="filters.category === 'dog' ? 'primary' : 'default'"
                  @click="handleCategoryChange('dog')"
                >
                  狗狗
                </el-button>
                <el-button
                  :type="filters.category === 'other' ? 'primary' : 'default'"
                  @click="handleCategoryChange('other')"
                >
                  其他
                </el-button>
                <el-button
                  :type="filters.category === 'nearby' ? 'primary' : 'default'"
                  @click="handleCategoryChange('nearby')"
                >
                  附近
                </el-button>
                <el-button
                  :type="filters.category === 'young' ? 'primary' : 'default'"
                  @click="handleCategoryChange('young')"
                >
                  幼宠
                </el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 宠物列表 -->
    <div class="pet-list-section">
      <div class="page-container">
        <div class="list-header">
          <span class="result-count">
            共找到 {{ total }} 只宠物
            <span v-if="filters.category === 'nearby'" class="filter-tag">（按距离排序）</span>
            <span v-else-if="filters.category === 'young'" class="filter-tag">（按年龄升序）</span>
            <span v-else-if="filters.category === 'cat'" class="filter-tag">（猫咪）</span>
            <span v-else-if="filters.category === 'dog'" class="filter-tag">（狗狗）</span>
            <span v-else-if="filters.category === 'other'" class="filter-tag">（其他）</span>
          </span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="grid">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button label="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
        
        <div v-loading="loading" class="pet-content">
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="pet-grid">
            <PetCard
              v-for="pet in petList"
              :key="pet.id"
              :pet="pet"
              @click="handlePetClick"
            />
          </div>
          
          <!-- 列表视图 -->
          <div v-else class="pet-list-view">
            <div 
              v-for="pet in petList"
              :key="pet.id"
              class="pet-list-item"
              @click="handlePetClick(pet)"
            >
              <el-image
                :src="pet.images?.[0] || 'https://via.placeholder.com/400x300/e0e0e0/999999?text=No+Image'"
                :alt="pet.name"
                class="pet-thumbnail"
                fit="cover"
              />
              <div class="pet-info">
                <h3>{{ pet.name }}</h3>
                <p>{{ pet.breed }} · {{ formatAge(pet.age) }} · {{ pet.gender === 'male' ? '男孩' : '女孩' }}</p>
                <div class="pet-tags">
                  <el-tag
                    v-for="tag in pet.tags?.slice(0, 3)"
                    :key="tag"
                    size="small"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="!loading && petList.length === 0" class="empty-state">
            <el-empty description="暂无相关宠物" />
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="total > 0">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[12, 24, 48]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
</div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import PetCard from '@/components/common/PetCard.vue'
import { Search, Grid, List } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { petAPI } from '@/api/modules/pet.js'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// 响应式数据
const loading = ref(false)
const viewMode = ref('grid')
const petList = ref([])
const total = ref(0)

const filters = reactive({
  keyword: '',
  category: '', // cat/dog/other/nearby/young
  sortBy: '', // distance/age_month/published_time
  order: '', // asc/desc
  lng: null, // 用户经度
  lat: null  // 用户纬度
})

const pagination = reactive({
  page: 1,
  pageSize: 12
})

// 方法
const formatAge = (age) => {
  if (age < 1) {
    return `${Math.round(age * 12)}个月`
  }
  return `${age}岁`
}

const handleSearch = () => {
  pagination.page = 1
  loadPetList()
}

// 处理分类切换
const handleCategoryChange = async (category) => {
  filters.category = category
  filters.sortBy = 'published_time'
  filters.order = 'desc'
  filters.lng = null
  filters.lat = null

  // 附近：按距离排序
  if (category === 'nearby') {
    // 尝试获取用户位置
    if (appStore.location && appStore.location.latitude && appStore.location.longitude) {
      filters.lng = appStore.location.longitude
      filters.lat = appStore.location.latitude
      filters.sortBy = 'distance'
      filters.order = 'asc' // 按距离升序（由近到远）
    } else {
      try {
        const position = await getUserLocation()
        filters.lng = position.lng
        filters.lat = position.lat
        filters.sortBy = 'distance'
        filters.order = 'asc' // 按距离升序（由近到远）
      } catch (error) {
        ElMessage.warning('无法获取您的位置，请开启定位权限')
        return
      }
    }
  }

  // 幼宠：按年龄升序
  if (category === 'young') {
    filters.sortBy = 'age_month'
    filters.order = 'asc'
  }

  pagination.page = 1
  loadPetList()
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

const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadPetList()
}

const handlePageChange = (page) => {
  pagination.page = page
  loadPetList()
}

/**
 * 加载宠物列表
 * 对应接口：GET /api/pets
 * 权限：无需认证
 */
const loadPetList = async () => {
  try {
    loading.value = true

// 构建请求参数
    const params = {
      // 关键词搜索
      keyword: filters.keyword || undefined,

      // 筛选条件 - nearby 和 young 不需要物种筛选
      species: filters.category === 'cat' ? 'CAT'
             : filters.category === 'dog' ? 'DOG'
             : filters.category === 'other' ? 'OTHER'
             : undefined,

      // 分页参数
      page: pagination.page,
      pageSize: pagination.pageSize,

      // 排序参数
      sortBy: filters.sortBy || 'published_time',
      order: filters.order || 'desc',

      // 用户位置（用于距离计算和排序）
      lng: filters.lng,
      lat: filters.lat
    }

// 如果有用户位置信息，添加用于距离计算
    if (appStore.location && appStore.location.latitude && appStore.location.longitude) {
      // 如果没有通过筛选条件传入位置，使用store中的位置
      if (!params.lng) {
        params.lng = appStore.location.longitude
        params.lat = appStore.location.latitude
      }
    }

    console.log('请求宠物列表参数:', params)

        // 调用API获取宠物列表
    const response = await petAPI.getPets(params)

    // 处理响应数据
    // 注意：假设你的拦截器已经处理过一层，response.data 对应的是后端返回的 {list, total...}
    if (response && response.data) {
      // 1. 重命名解构出来的变量为 resList 和 resTotal
      const { list: resList, total: resTotal } = response.data

      // 2. 转换数据格式
      petList.value = Array.isArray(resList) ? resList.map(pet => ({
        id: pet.id,
        name: pet.name || '未命名',
        breed: pet.breed || '未知品种',
        age: pet.ageMonth ? pet.ageMonth / 12 : 0,
        gender: pet.gender === 'MALE' ? 'male' : pet.gender === 'FEMALE' ? 'female' : 'unknown',
        status: pet.status === 'PUBLISHED' ? 'available' : 'unavailable',
        // 优先使用 images 数组，如果没有则用 coverUrl 包装成数组
        images: (Array.isArray(pet.images) && pet.images.length > 0) 
                ? pet.images 
                : (pet.coverUrl ? [pet.coverUrl] : []),
        tags: pet.tags || [],
        distance: pet.distance || 0,
        matchScore: pet.matchScore || 0,
        species: pet.species,
        size: pet.size,
        sterilized: pet.sterilized,
        vaccinated: pet.vaccinated,
        dewormed: pet.dewormed,
        createdAt: pet.publishedTime
      })) : []

      // 3. 正确为顶层的 total ref 赋值
      total.value = resTotal || 0

      console.log(`成功加载 ${petList.value.length} 只宠物，共 ${total.value} 只`)
    } else {
      console.warn('API响应格式异常:', response)
      petList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载宠物列表失败:', error)
    ElMessage.error('加载宠物列表失败，请稍后重试')
    petList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 从URL参数中恢复筛选条件
  if (route.query.keyword) {
    filters.keyword = route.query.keyword
  }
  if (route.query.category) {
    filters.category = route.query.category
  }
  // 解析排序参数
  if (route.query.sortBy) {
    filters.sortBy = route.query.sortBy
  }
  if (route.query.order) {
    filters.order = route.query.order
  }
  // 解析位置参数（用于附近功能）
  if (route.query.lng) {
    filters.lng = parseFloat(route.query.lng)
  }
  if (route.query.lat) {
    filters.lat = parseFloat(route.query.lat)
  }

  loadPetList()
})
</script>

<style scoped>
.filter-section {
  padding: var(--spacing-lg) 0;
  background: white;
  margin-bottom: var(--spacing-lg);
}

.filter-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.pet-list-section {
  background: white;
  border-radius: var(--border-radius-large);
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.result-count {
  color: var(--text-regular);
  font-size: var(--font-size-sm);
}

.filter-tag {
  color: var(--primary-color);
  font-weight: 500;
}

.pet-content {
  min-height: 400px;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.pet-list-view {
  padding: var(--spacing-xl);
}

.pet-list-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-base);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pet-list-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-light);
}

.pet-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-base);
  margin-right: var(--spacing-lg);
}

.pet-info h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.pet-info p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-regular);
  font-size: var(--font-size-sm);
}

.pet-tags {
  display: flex;
  gap: var(--spacing-xs);
}

.empty-state {
  padding: var(--spacing-xxl);
}

.pagination-wrapper {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .filter-actions {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .pet-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  .pet-list-item {
    padding: var(--spacing-md);
  }
  
  .pet-thumbnail {
    width: 60px;
    height: 60px;
    margin-right: var(--spacing-md);
  }
}
</style>