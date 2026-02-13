<template>
  <AppLayout>
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
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PetCard from '@/components/common/PetCard.vue'
import { Search, Filter, Grid, List } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const viewMode = ref('grid')
const petList = ref([])
const total = ref(0)
const showAdvancedFilter = ref(false)

const filters = reactive({
  keyword: '',
  category: '',
  age: '',
  gender: '',
  vaccinated: '',
  neutered: ''
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

const loadPetList = async () => {
  try {
    loading.value = true
    
    // TODO: 调用API获取宠物列表
    // const params = {
    //   ...filters,
    //   page: pagination.page,
    //   pageSize: pagination.pageSize
    // }
    // const { data } = await petAPI.getPets(params)
    
    // 模拟数据
    const mockData = {
      list: Array.from({ length: pagination.pageSize }, (_, index) => ({
        id: (pagination.page - 1) * pagination.pageSize + index + 1,
        name: ['小橘', '咪咪', '旺财', '贝贝', '豆豆', '球球'][index % 6],
        breed: ['橘猫', '英短', '哈士奇', '金毛', '柯基', '布偶猫'][index % 6],
        age: Math.random() * 10,
        gender: index % 2 === 0 ? 'male' : 'female',
        status: 'available',
        images: [`https://picsum.photos/seed/pet${index}/400/300.jpg`],
        tags: ['粘人', '已绝育', '疫苗齐'].slice(0, Math.floor(Math.random() * 3) + 1),
        distance: Math.random() * 10,
        matchScore: Math.random() * 100
      })),
      total: 120
    }
    
    petList.value = mockData.list
    total.value = mockData.total
  } catch (error) {
    console.error('加载宠物列表失败:', error)
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