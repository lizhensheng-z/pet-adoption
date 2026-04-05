<template>
  <div class="pet-card" @click="handleClick">
    <!-- 宠物图片 -->
    <div class="pet-image">
      <el-image
        :src="pet.coverUrl || pet.images?.[0] || 'https://via.placeholder.com/400x300/e0e0e0/999999?text=No+Image'"
        :alt="pet.name"
        fit="cover"
        class="image"
        lazy
      >
        <template #error>
          <div class="image-error">
            <el-icon size="32"><Picture /></el-icon>
            <span>暂无图片</span>
          </div>
        </template>
      </el-image>
      
      <!-- 匹配度标签 -->
      <div class="match-badge" v-if="pet.matchScore && showMatchScore">
        {{ Math.round(pet.matchScore) }}%匹配
      </div>
      
      <!-- 收藏按钮 -->
      <el-button
        circle
        class="favorite-btn"
        :class="{ active: isFavorite }"
        @click.stop="toggleFavorite"
      >
        <el-icon><Star /></el-icon>
      </el-button>
    </div>

    <!-- 宠物信息 -->
    <div class="pet-info">
      <!-- 基本信息 -->
      <div class="basic-info">
        <h3 class="pet-name">{{ pet.name }}</h3>
        <div class="pet-meta">
          <span class="breed">{{ pet.breed }}</span>
          <span class="separator">·</span>
          <span class="age">{{ formatAge(pet.ageMonth) }}</span>
          <span class="separator">·</span>
          <span class="gender">{{ formatGender(pet.gender) }}</span>
        </div>
      </div>

      <!-- 标签 -->
      <div class="pet-tags" v-if="pet.tags?.length">
        <el-tag
          v-for="tag in pet.tags.slice(0, 3)"
          :key="tag"
          size="small"
          class="tag"
        >
          {{ tag }}
        </el-tag>
        <span class="more-tags" v-if="pet.tags.length > 3">
          +{{ pet.tags.length - 3 }}
        </span>
      </div>

      <!-- 距离信息 -->
      <div class="location-info" v-if="showDistance && pet.distance">
        <el-icon size="12"><Location /></el-icon>
        <span>{{ formatDistance(pet.distance) }}</span>
      </div>

      <!-- 机构信息 -->
      <div class="org-info" v-if="showOrg && pet.orgName">
        <el-icon size="12"><OfficeBuilding /></el-icon>
        <span>{{ pet.orgName }}</span>
      </div>

      <!-- 状态信息 -->
      <div class="status-info">
        <el-tag
          :type="getStatusType(pet.status)"
          size="small"
          class="status-tag"
        >
          {{ getStatusText(pet.status) }}
        </el-tag>
        <span class="publish-time" v-if="pet.publishedTime">
          {{ formatRelativeTime(pet.publishedTime) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { Star, Picture, Location, OfficeBuilding } from '@element-plus/icons-vue'
import { formatRelativeTime } from '@/utils/common.js'
import { MapUtils } from '@/utils/map.js'
import { toggleFavorite as toggleFavoriteAPI, checkFavoriteStatus } from '@/api/modules/favorite.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  showMatchScore: {
    type: Boolean,
    default: true
  },
  showDistance: {
    type: Boolean,
    default: true
  },
  showOrg: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'favorite-change'])

const router = useRouter()
const authStore = useAuthStore()

// 收藏状态
const favoriteStatus = ref(props.pet.isFavorited || false)

// 计算属性
const isFavorite = computed(() => favoriteStatus.value)

// 初始化收藏状态
onMounted(async () => {
  // 如果宠物对象已包含收藏状态，直接使用
  if (props.pet.isFavorited !== undefined) {
    favoriteStatus.value = props.pet.isFavorited
    return
  }

  // 否则从API获取（仅登录用户）
  if (authStore.isLoggedIn && props.pet.id) {
    try {
      const { data } = await checkFavoriteStatus(props.pet.id)
      favoriteStatus.value = data?.favorited || false
    } catch (error) {
      // 静默失败，不影响用户体验
      console.warn('获取收藏状态失败:', error)
    }
  }
})

// 方法
const handleClick = () => {
  if (props.pet.id) {
    router.push(`/pets/${props.pet.id}`)
  }
  emit('click', props.pet)
}

const toggleFavorite = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  try {
    const { data } = await toggleFavoriteAPI(props.pet.id)
    favoriteStatus.value = data?.favorited ?? !favoriteStatus.value
    emit('favorite-change', props.pet.id, favoriteStatus.value)
    ElMessage.success(favoriteStatus.value ? '已收藏' : '已取消收藏')
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

const formatAge = (ageMonth) => {
  if (!ageMonth && ageMonth !== 0) return '未知'
  return `${ageMonth}个月`
}

const formatGender = (gender) => {
  const genderMap = {
    'MALE': '男孩',
    'FEMALE': '女孩',
    'UNKNOWN': '未知'
  }
  return genderMap[gender] || '未知'
}

const formatDistance = (distance) => {
  return MapUtils.formatDistance(distance)
}

const getStatusType = (status) => {
  const statusMap = {
    'PUBLISHED': 'success',
    'ADOPTED': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'PUBLISHED': '可领养',
    'ADOPTED': '已领养'
  }
  return statusMap[status] || '未知'
}
</script>

<style scoped>
.pet-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.pet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.pet-image {
  position: relative;
  padding-top: 75%; /* 4:3 比例 */
  overflow: hidden;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 14px;
}

.match-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(45deg, #FF8C42, #FF6B6B);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #999;
  transition: all 0.3s;
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #FF8C42;
  color: white;
}

.pet-info {
  padding: 16px;
}

.basic-info {
  margin-bottom: 12px;
}

.pet-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.pet-meta {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.separator {
  margin: 0 6px;
  color: #ddd;
}

.pet-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  font-size: 12px;
}

.more-tags {
  font-size: 12px;
  color: #999;
}

.location-info,
.org-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  font-size: 12px;
}

.publish-time {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .pet-info {
    padding: 12px;
  }
  
  .pet-name {
    font-size: 16px;
  }
  
  .pet-meta {
    font-size: 13px;
  }
}
</style>