<template>
  <div class="pet-detail-page">
    <!-- 顶部状态栏占位/Header -->
    <PageHeader title="宠物详情" class="custom-header">
      <template #actions>
        <el-icon @click="sharePet" class="header-icon"><Share /></el-icon>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="error" class="error-state">
      <el-empty description="加载失败">
        <el-button type="primary" @click="loadPetDetail">重试</el-button>
      </el-empty>
    </div>

    <div v-else class="content-scroll-view">
      <!-- 1. 图片轮播卡片 -->
      <div class="card carousel-card">
        <el-carousel trigger="click" height="350px" indicator-position="none">
          <el-carousel-item v-for="(image, index) in displayImages" :key="index">
            <el-image :src="image.url" fit="cover" class="carousel-image" :preview-src-list="displayImages.map(img => img.url)" />
          </el-carousel-item>
        </el-carousel>
        <div class="image-counter">{{ displayImages.length }} 张照片</div>
      </div>

      <!-- 2. 核心信息卡片 -->
      <div class="card info-card">
        <div class="title-row">
          <h1 class="name">{{ petDetail.name }}</h1>
          <el-tag :type="statusTag.type" effect="dark" round>{{ statusTag.text }}</el-tag>
        </div>
        
        <div class="info-grid">
          <div class="grid-item">
            <span class="label">性别</span>
            <span class="value">{{ genderText }}</span>
          </div>
          <div class="grid-item">
            <span class="label">年龄</span>
            <span class="value">{{ ageText }}</span>
          </div>
          <div class="grid-item">
            <span class="label">品种</span>
            <span class="value">{{ petDetail.breed || '未知' }}</span>
          </div>
          <div class="grid-item">
            <span class="label">体型</span>
            <span class="value">{{ sizeText }}</span>
          </div>
        </div>

        <div class="location-tag" v-if="petDetail.distance">
          <el-icon><Location /></el-icon>
          距离你 {{ petDetail.distance.toFixed(1) }} km
        </div>
      </div>

      <!-- 3. 健康与性格卡片 -->
      <div class="card detail-card">
        <h3 class="card-title">关于 {{ petDetail.name }}</h3>
        
        <div class="tags-group">
          <span v-if="petDetail.sterilized" class="status-tag checked">已绝育</span>
          <span v-if="petDetail.vaccinated" class="status-tag checked">已疫苗</span>
          <span v-if="petDetail.dewormed" class="status-tag checked">已驱虫</span>
          <span v-for="tag in petDetail.tags" :key="tag.id" class="status-tag plain">{{ tag.name }}</span>
        </div>

        <div class="desc-item">
          <h4>健康描述</h4>
          <p>{{ petDetail.healthDesc || '暂无详细健康描述' }}</p>
        </div>

        <div class="desc-item">
          <h4>性格与故事</h4>
          <p>{{ petDetail.personalityDesc || '它暂时还没有故事，等待你来发掘...' }}</p>
        </div>
      </div>

      <!-- 4. 领养要求卡片 -->
      <div class="card requirement-card">
        <h3 class="card-title">领养要求</h3>
        <div class="requirement-box">
          {{ petDetail.adoptRequirements || '领养人需有固定住所，科学喂养，有病就医。' }}
        </div>
      </div>

      <!-- 5. 机构信息 -->
      <div class="card org-card" v-if="petDetail.org?.id">
        <h3 class="card-title">发布机构</h3>
        <div class="org-box">
          <div class="org-main">
            <el-avatar :size="40" icon="OfficeBuilding" />
            <div class="org-text">
              <p class="org-name">{{ petDetail.org.orgName }}</p>
              <p class="org-addr">{{ petDetail.org.address }}</p>
            </div>
          </div>
          <el-button size="small" circle icon="Phone" @click="callOrg(petDetail.org.contactPhone)"></el-button>
        </div>
      </div>

      <!-- 6. 相似推荐 -->
      <div class="similar-section" v-if="similarPets.length > 0">
        <h3 class="card-title">发现更多可爱</h3>
        <div class="similar-grid">
          <PetCard v-for="pet in similarPets" :key="pet.id" :pet="pet" />
        </div>
      </div>

      <!-- 底部撑开距离 -->
      <div class="safe-area-bottom"></div>
    </div>

    <!-- 底部悬浮操作栏 -->
    <div class="action-bar">
      <div class="action-inner">
        <div class="fav-btn" @click="toggleFavorite">
          <el-icon :class="{ 'is-active': isFavorited }">
            <component :is="isFavorited ? 'StarFilled' : 'Star'" />
          </el-icon>
          <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
        </div>
        <el-button type="primary" class="apply-btn" @click="applyForAdoption" :disabled="!canApply" round>
          {{ applyButtonText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Share,
  Grid,
  Male,
  Female,
  Location,
  Star,
  StarFilled
} from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import PetCard from '@/components/common/PetCard.vue'
import { petAPI, applicationAPI } from '@/api/modules/pet.js'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 图标
const ShareIcon = Share
const StarIcon = Star
const StarFilledIcon = StarFilled

// 宠物详情数据
const petDetail = ref({
  id: null,
  name: '',
  species: '',
  breed: '',
  gender: '',
  ageMonth: 0,
  size: '',
  color: '',
  sterilized: false,
  vaccinated: false,
  dewormed: false,
  healthDesc: '',
  personalityDesc: '',
  adoptRequirements: '',
  status: '',
  publishedTime: '',
  distance: 0,
  tags: [],
  org: {}
})

// 页面状态
const loading = ref(true)
const error = ref(null)

// 用户互动状态
const isFavorited = ref(false)
const favoriteLoading = ref(false)
const applying = ref(false)

// 相似推荐
const similarPets = ref([])
const loadingSimilar = ref(false)

// 计算属性：显示图片列表
const displayImages = computed(() => {
  if (!petDetail.value.images || petDetail.value.images.length === 0) {
    // 如果没有图片数组，使用封面图
    if (petDetail.value.coverUrl) {
      return [{ id: 'cover', url: petDetail.value.coverUrl }]
    }
    return []
  }
  return petDetail.value.images
})

// 计算属性：年龄格式化
const ageText = computed(() => {
  const months = petDetail.value.ageMonth || 0
  if (months < 12) {
    return `${months}个月`
  }
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  return remainingMonths > 0 ? `${years}岁${remainingMonths}个月` : `${years}岁`
})

// 计算属性：性别文本
const genderText = computed(() => {
  const gender = petDetail.value.gender
  return gender === 'MALE' ? '男孩' : gender === 'FEMALE' ? '女孩' : '未知'
})

// 计算属性：物种文本
const speciesText = computed(() => {
  const species = petDetail.value.species
  return species === 'CAT' ? '猫咪' : species === 'DOG' ? '狗狗' : '其他'
})

// 计算属性：体型文本
const sizeText = computed(() => {
  const size = petDetail.value.size
  return size === 'S' ? '小型' : size === 'M' ? '中型' : size === 'L' ? '大型' : '未知'
})

// 计算属性：是否可申请
const canApply = computed(() => {
  return petDetail.value.status === 'PUBLISHED' && !applying.value
})

// 计算属性：申请按钮文本
const applyButtonText = computed(() => {
  const status = petDetail.value.status
  if (status === 'APPLYING') return '申请中'
  if (status === 'ADOPTED') return '已领养'
  return '申请领养'
})

// 计算属性：状态标签
const statusTag = computed(() => {
  const status = petDetail.value.status
  const statusMap = {
    'PUBLISHED': { text: '可领养', type: 'success' },
    'APPLYING': { text: '申请中', type: 'warning' },
    'ADOPTED': { text: '已领养', type: 'info' }
  }
  return statusMap[status] || { text: '未知', type: 'default' }
})

// 计算属性：是否有健康信息
const hasHealthInfo = computed(() => {
  return petDetail.value.sterilized ||
         petDetail.value.vaccinated ||
         petDetail.value.dewormed ||
         petDetail.value.healthDesc
})

// 计算属性：是否有性格信息
const hasPersonalityInfo = computed(() => {
  return (petDetail.value.tags && petDetail.value.tags.length > 0) ||
         petDetail.value.personalityDesc
})

// 加载宠物详情
const loadPetDetail = async () => {
  try {
    loading.value = true
    error.value = null
    const petId = route.params.id

    // 调用API获取宠物详情
    const response = await petAPI.getPetDetail(petId)

// 数据转换（后端字段转前端字段）
    // 注意：后端返回的是驼峰命名（camelCase），如 ageMonth, coverUrl, publishedTime
    const data = response.data
    petDetail.value = {
      id: data.id,
      name: data.name || '未命名',
      species: data.species,
      breed: data.breed || '未知品种',
      gender: data.gender,
      ageMonth: data.ageMonth || 0, // 后端返回 ageMonth（驼峰）
      size: data.size,
      color: data.color,
      sterilized: !!data.sterilized,
      vaccinated: !!data.vaccinated,
      dewormed: !!data.dewormed,
      healthDesc: data.healthDesc || '', // 后端返回 healthDesc（驼峰）
      personalityDesc: data.personalityDesc || '', // 后端返回 personalityDesc（驼峰）
      adoptRequirements: data.adoptRequirements || '', // 后端返回 adoptRequirements（驼峰）
      status: data.status,
      publishedTime: data.publishedTime, // 后端返回 publishedTime（驼峰）
      distance: data.distance || 0,
      coverUrl: data.coverUrl || '', // 后端返回 coverUrl（驼峰）
      images: data.images || [],
      tags: data.tags || [],
      org: data.org || {}
    }

    // 记录浏览行为
    recordViewBehavior()

    // 加载相似推荐
    loadSimilarPets()

    // 检查收藏状态（如果已登录）
    if (authStore.isLoggedIn) {
      checkFavoriteStatus()
    }
  } catch (err) {
    console.error('加载宠物详情失败:', err)
    error.value = err.message || '加载失败'
    ElMessage.error('加载宠物详情失败')
  } finally {
    loading.value = false
  }
}

// 切换收藏状态
const toggleFavorite = async () => {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    favoriteLoading.value = true
    const response = await petAPI.toggleFavorite(petDetail.value.id)
    isFavorited.value = response.data.favorited

    // 记录收藏行为
    if (isFavorited.value) {
      recordBehavior('FAVORITE')
    }

    ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
  } catch (err) {
    console.error('收藏操作失败:', err)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    favoriteLoading.value = false
  }
}

// 申请领养
const applyForAdoption = async () => {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (!canApply.value) {
    return
  }

  // 记录申请行为
  recordBehavior('APPLY')

  // 跳转到申请页面
  router.push(`/apply/${petDetail.value.id}`)
}

// 检查收藏状态
const checkFavoriteStatus = async () => {
  try {
    const response = await petAPI.checkFavorite(petDetail.value.id)
    isFavorited.value = response.data.favorited
  } catch (err) {
    console.error('检查收藏状态失败:', err)
  }
}

// 加载相似宠物
const loadSimilarPets = async () => {
  try {
    loadingSimilar.value = true
    const response = await petAPI.getSimilarPets(petDetail.value.id, { limit: 6 })

// 处理相似宠物数据格式
    if (response.data && response.data.list) {
      similarPets.value = response.data.list.map(pet => ({
        id: pet.id,
        name: pet.name || '未命名',
        breed: pet.breed || '未知品种',
        gender: pet.gender,
        ageMonth: pet.ageMonth || 0, // 后端返回 ageMonth（驼峰）
        age: pet.ageMonth ? pet.ageMonth / 12 : 0, // 转换为年（PetCard 需要）
        size: pet.size,
        species: pet.species,
        coverUrl: pet.coverUrl, // 后端返回 coverUrl（驼峰）
        images: pet.images || (pet.coverUrl ? [pet.coverUrl] : []),
        distance: pet.distance || 0,
        tags: pet.tags || [],
        status: pet.status === 'PUBLISHED' ? 'available' : 'unavailable',
        createdAt: pet.publishedTime // PetCard 显示发布时间
      }))
    }
  } catch (err) {
    console.error('加载相似宠物失败:', err)
    similarPets.value = []
  } finally {
    loadingSimilar.value = false
  }
}

// 记录浏览行为
const recordViewBehavior = async () => {
  recordBehavior('VIEW')
}

// 记录行为（通用方法）
const recordBehavior = async (behaviorType) => {
  if (!authStore.isLoggedIn) return

  try {
    await petAPI.recordBehavior({
      petId: petDetail.value.id,
      behaviorType: behaviorType
    })
  } catch (err) {
    console.error('记录行为失败:', err)
  }
}

// 分享功能
const sharePet = async () => {
  const shareData = {
    title: `${petDetail.value.name} - 宠物领养`,
    text: `${petDetail.value.name}，${petDetail.value.breed}，${ageText.value}`,
    url: window.location.href
  }

  // 记录分享行为
  recordBehavior('SHARE')

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('分享取消:', err)
    }
  } else {
    // 复制链接到剪贴板
    try {
      await navigator.clipboard.writeText(shareData.url)
      ElMessage.success('链接已复制到剪贴板')
    } catch (err) {
      ElMessage.error('复制失败，请手动复制链接')
    }
  }
}

// 跳转到宠物详情
const goToPetDetail = (petId) => {
  router.push(`/pets/${petId}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadPetDetail()
})

const callOrg = (phone) => {
  if (phone) window.location.href = `tel:${phone}`
}
</script>

<style scoped lang="scss">
.pet-detail-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
}

.custom-header {
  background: white !important;
  border-bottom: 1px solid #f0f0f0;
}

.content-scroll-view {
  padding: 12px 12px 100px; // 底部留够100px给操作栏
}

/* 卡片通用样式 */
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

/* 轮播卡片特殊处理 */
.carousel-card {
  padding: 0;
  overflow: hidden;
  position: relative;
  .carousel-image {
    width: 100%;
    height: 100%;
  }
  .image-counter {
    position: absolute;
    right: 12px;
    bottom: 12px;
    background: rgba(0,0,0,0.5);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
  }
}

/* 核心信息网格 */
.info-card {
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .name { font-size: 24px; font-weight: bold; color: #333; }
  }
  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    background: #fbfbfb;
    padding: 12px;
    border-radius: 12px;
    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .label { font-size: 11px; color: #999; margin-bottom: 4px; }
      .value { font-size: 13px; font-weight: bold; color: #444; }
    }
  }
  .location-tag {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #FF8C42;
  }
}

/* 标签样式 */
.tags-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  .status-tag {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
  }
  .checked { background: #e8f5e9; color: #4caf50; }
  .plain { background: #f0f2f5; color: #666; }
}

.desc-item {
  margin-top: 16px;
  h4 { font-size: 15px; margin-bottom: 6px; color: #333; }
  p { font-size: 14px; color: #666; line-height: 1.6; }
}

/* 机构盒子 */
.org-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  .org-main {
    display: flex;
    gap: 10px;
    align-items: center;
    .org-name { font-size: 15px; font-weight: bold; }
    .org-addr { font-size: 12px; color: #999; }
  }
}

/* 底部操作栏 - 高级感核心 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px); // 毛玻璃
  border-top: 1px solid #eee;
  padding: 12px 20px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom)); // 适配刘海屏底部
  z-index: 2000;

  .action-inner {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .fav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 40px;
    color: #666;
    cursor: pointer;
    .el-icon { font-size: 20px; }
    .is-active { color: #FF8C42; }
    span { font-size: 10px; }
  }

  .apply-btn {
    flex: 1;
    height: 48px;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }
}

.similar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 12px;
}

.card-title {
  font-size: 17px;
  margin-bottom: 12px;
  color: #333;
}
</style>