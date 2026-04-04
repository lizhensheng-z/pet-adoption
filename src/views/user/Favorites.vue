<template>
  <div class="modern-favorites">
    <!-- 装饰背景 -->
    <div class="bg-glow top-left"></div>
    <div class="bg-glow bottom-right"></div>

    <PageHeader title="我的收藏" class="custom-header" />

    <div class="favorites-scroll-content">
      <!-- 1. 统计区域 -->
      <section class="glass-stats">
        <div class="stat-item">
          <span class="num">{{ total }}</span>
          <span class="lab">收藏总数</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="num active">{{ availableCount }}</span>
          <span class="lab">可领养</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="num info">{{ adoptedCount }}</span>
          <span class="lab">已结缘</span>
        </div>
      </section>

      <!-- 2. 搜索与筛选 -->
      <section class="search-and-filter">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索心仪的它..."
            @keyup.enter="handleFilterChange"
            clearable
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </div>
        
        <div class="horizontal-tabs">
          <div 
            v-for="opt in speciesOptions" 
            :key="opt.value"
            class="tab-pill"
            :class="{ active: filterSpecies === opt.value }"
            @click="setSpecies(opt.value)"
          >
            {{ opt.label }}
          </div>
        </div>
      </section>

      <!-- 3. 收藏列表 -->
      <div class="favorites-main" v-loading="loading">
        <template v-if="favorites.length > 0">
          <div class="pet-grid">
            <div 
              v-for="item in favorites" 
              :key="item.id" 
              class="pet-glass-card"
              @click="viewPetDetail(item.petId)"
            >
              <div class="card-image-wrapper">
                <el-image :src="item.petCoverUrl" fit="cover" lazy>
                  <template #error>
                    <div class="image-slot"><el-icon><Picture /></el-icon></div>
                  </template>
                </el-image>
                <div class="status-overlay">
                  <span class="glass-tag" :class="item.status.toLowerCase()">
                    {{ getStatusText(item.status) }}
                  </span>
                </div>
                <div class="distance-tag" v-if="item.distance">
                  <el-icon><Location /></el-icon> {{ formatDistance(item.distance) }}
                </div>
              </div>

              <div class="card-body">
                <div class="name-row">
                  <h3 class="name">{{ item.petName }}</h3>
                  <div class="gender-icon" :class="item.gender.toLowerCase()">
                    <el-icon v-if="item.gender === 'MALE'"><Male /></el-icon>
                    <el-icon v-else-if="item.gender === 'FEMALE'"><Female /></el-icon>
                  </div>
                </div>
                
                <div class="breed">
                  {{ item.petBreed }} · {{ formatAge(item.ageMonth) }}
                </div>
                
                <div class="org-row">
                  <el-icon><OfficeBuilding /></el-icon>
                  <span>{{ item.orgName }}</span>
                </div>

                <div class="card-footer">
                  <span class="time">{{ formatTime(item.favoritedTime) }} 收藏</span>
                  <div class="actions" @click.stop>
                    <button class="icon-btn delete" @click="handleRemoveFavorite(item.petId, item.petName)">
                      <el-icon><Delete /></el-icon>
                    </button>
                    <button class="main-btn" @click="viewPetDetail(item.petId)">详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modern-pagination" v-if="total > pageSize">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              small
              @current-change="handleCurrentChange"
            />
          </div>
        </template>

        <!-- 4. 空状态 -->
        <div v-else class="modern-empty">
          <div class="empty-icon-wrap">
            <el-icon><Star /></el-icon>
          </div>
          <h3>心动列表空空如也</h3>
          <p>遇见即是缘分，快去寻找你的专属伙伴吧</p>
          <el-button class="discover-btn" round @click="goToDiscover">探索更多</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Location, OfficeBuilding, Male, Female, Delete, Star, Picture } from '@element-plus/icons-vue'
import { getMyFavorites, removeFavorite, formatAge, formatDistance } from '@/api/modules/favorite.js'

const router = useRouter()
const loading = ref(false)
const favorites = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const filterSpecies = ref('')
const searchKeyword = ref('')

const speciesOptions = [
  { label: '全部', value: '' },
  { label: '猫咪', value: 'CAT' },
  { label: '狗狗', value: 'DOG' },
  { label: '其他', value: 'OTHER' }
]

// 统计计算
const availableCount = computed(() => favorites.value.filter(i => i.status === 'PUBLISHED').length)
const adoptedCount = computed(() => favorites.value.filter(i => i.status === 'ADOPTED').length)

const setSpecies = (val) => {
  filterSpecies.value = val
  handleFilterChange()
}

const loadFavorites = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      sortBy: 'favoriteTime',
      order: 'desc',
      species: filterSpecies.value || undefined,
      keyword: searchKeyword.value || undefined
    }
    
    // 发起请求
    const response = await getMyFavorites(params)
    const rawList = response.data.list || []
    
    // 【核心修复】映射 JSON 数据结构
    favorites.value = rawList.map(item => ({
      id: item.id,
      petId: item.pet.id,
      petName: item.pet.name,
      petCoverUrl: item.pet.coverUrl,
      petSpecies: item.pet.species,
      status: item.pet.status, // PUBLISHED, ADOPTED...
      favoritedTime: item.favoritedTime,
      // 以下字段处理接口中可能缺失的情况
      orgName: item.pet.orgName || '爱心机构',
      petBreed: item.pet.breed || '未知品种',
      ageMonth: item.pet.ageMonth || 0,
      gender: item.pet.gender || 'UNKNOWN',
      distance: item.pet.distance || 0
    }))
    
    total.value = response.data.total || 0
  } catch (error) {
    console.error('加载异常:', error)
    ElMessage.error('列表加载失败')
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  loadFavorites()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadFavorites()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewPetDetail = (id) => router.push(`/pets/${id}`)

const handleRemoveFavorite = async (id, name) => {
  try {
    await ElMessageBox.confirm(`不再关注 ${name} 了吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      roundButton: true,
      type: 'warning'
    })
    await removeFavorite(id)
    ElMessage.success('已移除收藏')
    loadFavorites()
  } catch {}
}

const getStatusText = (s) => {
  const map = { 'PUBLISHED': '可领养', 'ADOPTED': '已结缘' }
  return map[s] || '未知'
}

const formatTime = (t) => t ? new Date(t).toLocaleDateString() : ''
const goToDiscover = () => router.push('/pets')

onMounted(loadFavorites)
</script>

<style lang="scss" scoped>
.modern-favorites {
  --primary-gradient: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%);
  --glass-bg: rgba(255, 255, 255, 0.9);
  background-color: #f6f8fb;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 60px;
}

/* 装饰背景 */
.bg-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.4;
  pointer-events: none;
  &.top-left { top: -100px; left: -50px; background: #FF8C42; }
  &.bottom-right { bottom: -100px; right: -50px; background: #409EFF; }
}

.favorites-scroll-content {
  position: relative;
  z-index: 1;
  padding: 16px;
}

/* 统计卡片 */
.glass-stats {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  .stat-item {
    text-align: center;
    .num {
      display: block;
      font-size: 24px;
      font-weight: 800;
      color: #333;
      &.active { color: #FF8C42; }
      &.info { color: #409EFF; }
    }
    .lab { font-size: 12px; color: #999; margin-top: 4px; }
  }
  .divider { width: 1px; height: 30px; background: #eee; }
}

/* 搜索和横向标签 */
.search-and-filter {
  margin-bottom: 20px;
  .search-bar {
    margin-bottom: 16px;
    :deep(.el-input__wrapper) {
      border-radius: 12px;
      box-shadow: none !important;
      padding: 8px 16px;
    }
  }
  .horizontal-tabs {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 5px;
    &::-webkit-scrollbar { display: none; }
    
    .tab-pill {
      padding: 8px 20px;
      background: white;
      border-radius: 20px;
      font-size: 14px;
      color: #666;
      white-space: nowrap;
      transition: 0.3s;
      &.active {
        background: var(--primary-gradient);
        color: white;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      }
    }
  }
}

/* 网格布局 */
.pet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pet-glass-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  
  .card-image-wrapper {
    position: relative;
    height: 150px;
    .el-image { width: 100%; height: 100%; }
    .image-slot { display: flex; justify-content: center; align-items: center; height: 100%; background: #f5f7fa; color: #909399; }
    
    .status-overlay {
      position: absolute;
      top: 8px;
      left: 8px;
      .glass-tag {
        padding: 3px 8px;
        background: rgba(0,0,0,0.5);
        color: white;
        border-radius: 6px;
        font-size: 10px;
        backdrop-filter: blur(4px);
        &.published { background: rgba(103, 194, 58, 0.8); }
      }
    }
    
    .distance-tag {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(255,255,255,0.9);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      color: #FF8C42;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .card-body {
    padding: 12px;
    .name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name { font-size: 16px; font-weight: bold; color: #333; margin: 0; }
      .gender-icon.male { color: #409EFF; }
      .gender-icon.female { color: #F56C6C; }
    }
    .breed { font-size: 12px; color: #999; margin: 4px 0 8px; }
    .org-row {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #777;
      margin-bottom: 10px;
    }
    
    .card-footer {
      border-top: 1px solid #f5f5f5;
      padding-top: 10px;
      .time { font-size: 10px; color: #bbb; display: block; margin-bottom: 8px; }
      .actions {
        display: flex;
        gap: 8px;
        .icon-btn.delete {
          width: 32px;
          height: 32px;
          background: #fff0f0;
          color: #ff4d4f;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .main-btn {
          flex: 1;
          background: var(--primary-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
  }
}

.modern-empty {
  padding: 60px 20px;
  text-align: center;
  .empty-icon-wrap {
    font-size: 50px;
    color: #FF8C42;
    margin-bottom: 20px;
  }
  h3 { margin-bottom: 10px; color: #333; }
  p { color: #999; font-size: 14px; margin-bottom: 20px; }
  .discover-btn { background: var(--primary-gradient); color: white; border: none; padding: 10px 30px; }
}

.modern-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
