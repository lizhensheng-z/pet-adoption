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
                  @click="filters.category = 'cat'"
                >
                  猫咪
                </el-button>
                <el-button 
                  :type="filters.category === 'dog' ? 'primary' : 'default'"
                  @click="filters.category = 'dog'"
                >
                  狗狗
                </el-button>
                <el-button 
                  :type="filters.category === 'other' ? 'primary' : 'default'"
                  @click="filters.category = 'other'"
                >
                  其他
                </el-button>
              </el-button-group>
              
              <el-button @click="showAdvancedFilter = true">
                <el-icon><Filter /></el-icon>
                筛选
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 宠物列表 -->
    <div class="pet-list-section">
      <div class="page-container">
        <div class="list-header">
          <span class="result-count">共找到 {{ total }} 只宠物</span>
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

    <!-- 高级筛选对话框 -->
    <el-dialog
      v-model="showAdvancedFilter"
      title="高级筛选"
      width="500px"
      @close="handleFilterCancel"
    >
      <el-form label-width="80px">
        <el-form-item label="性别">
          <el-radio-group v-model="filters.gender">
            <el-radio label="">全部</el-radio>
            <el-radio label="male">男孩</el-radio>
            <el-radio label="female">女孩</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄">
          <el-radio-group v-model="filters.age">
            <el-radio label="">全部</el-radio>
            <el-radio label="young">1岁以下</el-radio>
            <el-radio label="adult">1-5岁</el-radio>
            <el-radio label="senior">5岁以上</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="体型">
          <el-radio-group v-model="filters.size">
            <el-radio label="">全部</el-radio>
            <el-radio label="S">小型</el-radio>
            <el-radio label="M">中型</el-radio>
            <el-radio label="L">大型</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="健康状态">
          <div class="health-filters">
            <el-checkbox v-model="filters.vaccinated" true-label="true" false-label="false">
              已疫苗
            </el-checkbox>
            <el-checkbox v-model="filters.neutered" true-label="true" false-label="false">
              已绝育
            </el-checkbox>
            <el-checkbox v-model="filters.dewormed" true-label="true" false-label="false">
              已驱虫
            </el-checkbox>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleFilterCancel">重置</el-button>
        <el-button type="primary" @click="handleFilterConfirm">确定</el-button>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PetCard from '@/components/common/PetCard.vue'
import { Search, Filter, Grid, List } from '@element-plus/icons-vue'
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
const showAdvancedFilter = ref(false)

const filters = reactive({
  keyword: '',
  category: '', // cat/dog/other
  gender: '', // male/female
  age: '', // young(1岁以下)/adult(1-5岁)/senior(5岁以上)
  vaccinated: '', // true/false
  neutered: '', // true/false
  dewormed: '', // true/false
  size: '' // S/M/L
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

const handleFilterConfirm = () => {
  showAdvancedFilter.value = false
  pagination.page = 1
  loadPetList()
}

const handleFilterCancel = () => {
  // 重置筛选条件
  filters.gender = ''
  filters.age = ''
  filters.size = ''
  filters.vaccinated = ''
  filters.neutered = ''
  filters.dewormed = ''
  showAdvancedFilter.value = false
  pagination.page = 1
  loadPetList()
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

      // 筛选条件
      species: filters.category === 'cat' ? 'CAT' : filters.category === 'dog' ? 'DOG' : filters.category === 'other' ? 'OTHER' : undefined,
      gender: filters.gender === 'male' ? 'MALE' : filters.gender === 'female' ? 'FEMALE' : undefined,

      // 年龄范围转换
      minAge: filters.age === 'young' ? 0 : filters.age === 'adult' ? 12 : filters.age === 'senior' ? 60 : undefined,
      maxAge: filters.age === 'young' ? 12 : filters.age === 'adult' ? 60 : filters.age === 'senior' ? 240 : undefined,

      // 体型
      size: filters.size || undefined,

      // 健康状态
      vaccinated: filters.vaccinated === 'true' ? true : filters.vaccinated === 'false' ? false : undefined,
      neutered: filters.neutered === 'true' ? true : filters.neutered === 'false' ? false : undefined,
      dewormed: filters.dewormed === 'true' ? true : filters.dewormed === 'false' ? false : undefined,

      // 分页参数
      page: pagination.page,
      pageSize: pagination.pageSize,

      // 排序（按发布时间降序）
      sortBy: 'published_time',
      sortOrder: 'desc'
    }

// 如果有用户位置信息，添加用于距离计算
    if (appStore.location && appStore.location.latitude && appStore.location.longitude) {
      params.lat = appStore.location.latitude
      params.lng = appStore.location.longitude
    }

    console.log('请求宠物列表参数:', params)

    // 调用API获取宠物列表
    const response = await petAPI.getPets(params)

    // 处理响应数据
    if (response && response.data) {
      const { list, total, pageNo, pageSize } = response.data

      // 转换数据格式以适配前端组件
      petList.value = list.map(pet => ({
        id: pet.id,
        name: pet.name || '未命名',
        breed: pet.breed || '未知品种',
        age: pet.age_month ? pet.age_month / 12 : 0, // 将月转为年
        gender: pet.gender === 'MALE' ? 'male' : pet.gender === 'FEMALE' ? 'female' : 'unknown',
        status: pet.status === 'PUBLISHED' ? 'available' : 'unavailable',
        images: pet.images || (pet.cover_url ? [pet.cover_url] : []),
        tags: pet.tags || [],
        distance: pet.distance || 0,
        matchScore: pet.matchScore || 0,
        species: pet.species,
        size: pet.size,
        sterilized: pet.sterilized,
        vaccinated: pet.vaccinated,
        dewormed: pet.dewormed
      }))

      total.value = total || 0

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

.health-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
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