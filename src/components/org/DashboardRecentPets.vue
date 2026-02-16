<template>
  <el-card class="recent-pets-card">
    <template #header>
      <div class="recent-pets-card__header">
        <div class="recent-pets-card__title">
          <el-icon><Grid /></el-icon>
          <span>最近发布的宠物</span>
        </div>
        <el-button
          text
          type="primary"
          size="small"
          @click="handleViewAll"
        >
          查看全部
        </el-button>
      </div>
    </template>

    <!-- 加载状态 -->
    <div v-if="loading" class="recent-pets-card__loading">
      <el-row :gutter="16">
        <el-col
          v-for="i in 4"
          :key="i"
          :xs="12"
          :sm="6"
        >
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 180px;" />
              <el-skeleton-item variant="h3" style="width: 80%" />
              <el-skeleton-item variant="text" style="width: 60%" />
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
    </div>

    <!-- 空状态 -->
    <div v-else-if="pets.length === 0" class="recent-pets-card__empty">
      <el-empty
        description="暂无宠物数据"
        :image-size="120"
      >
        <el-button
          type="primary"
          @click="handleCreatePet"
        >
          立即发布宠物
        </el-button>
      </el-empty>
    </div>

    <!-- 宠物列表 -->
    <div v-else class="recent-pets-card__list">
      <el-row :gutter="16">
        <el-col
          v-for="pet in pets"
          :key="pet.id"
          :xs="12"
          :sm="6"
          class="pet-col"
        >
          <div
            class="pet-card"
            @click="handlePetClick(pet)"
          >
            <div class="pet-card__image">
              <el-image
                :src="pet.coverUrl"
                :preview-src-list="[pet.coverUrl]"
                fit="cover"
                class="pet-card__cover"
              >
                <template #error>
                  <div class="pet-card__error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>

              <el-tag
                v-if="pet.status"
                :type="getStatusType(pet.status)"
                size="small"
                class="pet-card__status"
              >
                {{ getStatusText(pet.status) }}
              </el-tag>

              <div class="pet-card__species">
                {{ getSpeciesText(pet.species) }}
              </div>
            </div>

            <div class="pet-card__content">
              <div class="pet-card__name">{{ pet.name }}</div>
              <div class="pet-card__info">
                <span>{{ pet.breed || '未知品种' }}</span>
                <el-divider direction="vertical" />
                <span>{{ formatAge(pet.ageMonth) }}</span>
                <el-divider direction="vertical" />
                <span>{{ getGenderText(pet.gender) }}</span>
              </div>

              <div class="pet-card__stats">
                <span class="pet-card__stat">
                  <el-icon><View /></el-icon>
                  {{ pet.viewCount || 0 }}
                </span>
                <span class="pet-card__stat">
                  <el-icon><Star /></el-icon>
                  {{ pet.favoriteCount || 0 }}
                </span>
                <span class="pet-card__stat">
                  <el-icon><Document /></el-icon>
                  {{ pet.applicationCount || 0 }}
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Grid,
  Picture,
  View,
  Star,
  Document
} from '@element-plus/icons-vue'

const props = defineProps({
  pets: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

const router = useRouter()

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    PUBLISHED: 'success',
    APPLYING: 'warning',
    ADOPTED: 'info',
    DRAFT: 'info',
    PENDING_AUDIT: 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取状态文字
const getStatusText = (status) => {
  const textMap = {
    PUBLISHED: '已发布',
    APPLYING: '申请中',
    ADOPTED: '已领养',
    DRAFT: '草稿',
    PENDING_AUDIT: '审核中'
  }
  return textMap[status] || status
}

// 获取物种文字
const getSpeciesText = (species) => {
  const textMap = {
    CAT: '猫咪',
    DOG: '狗狗',
    OTHER: '其他'
  }
  return textMap[species] || species
}

// 获取性别文字
const getGenderText = (gender) => {
  const textMap = {
    MALE: '公',
    FEMALE: '母',
    UNKNOWN: '未知'
  }
  return textMap[gender] || gender
}

// 格式化年龄
const formatAge = (ageMonth) => {
  if (!ageMonth) return '未知'
  if (ageMonth < 12) {
    return `${ageMonth}个月`
  } else {
    const year = Math.floor(ageMonth / 12)
    const month = ageMonth % 12
    if (month === 0) {
      return `${year}岁`
    } else {
      return `${year}岁${month}个月`
    }
  }
}

// 查看全部
const handleViewAll = () => {
  router.push('/org/pets')
}

// 创建宠物
const handleCreatePet = () => {
  router.push('/org/pets/create')
}

// 点击宠物卡片
const handlePetClick = (pet) => {
  router.push(`/org/pets/${pet.id}`)
}
</script>

<style scoped>
.recent-pets-card {
  margin-bottom: var(--spacing-lg);
}

.recent-pets-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-pets-card__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.recent-pets-card__loading,
.recent-pets-card__empty {
  padding: var(--spacing-xl) 0;
}

.pet-col {
  margin-bottom: var(--spacing-md);
}

.pet-card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-base);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pet-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-base);
  transform: translateY(-4px);
}

.pet-card__image {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 宽高比 */
  background: var(--bg-light);
}

.pet-card__cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pet-card__error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--bg-light);
  color: var(--text-placeholder);
  font-size: 48px;
}

.pet-card__status {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  z-index: 1;
}

.pet-card__species {
  position: absolute;
  bottom: var(--spacing-sm);
  left: var(--spacing-sm);
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-xs);
}

.pet-card__content {
  padding: var(--spacing-md);
}

.pet-card__name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pet-card__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.pet-card__stats {
  display: flex;
  justify-content: space-around;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
}

.pet-card__stat {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.pet-card__stat .el-icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .recent-pets-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .pet-card__info {
    flex-wrap: nowrap;
  }

  .pet-card__stats {
    font-size: var(--font-size-xs);
  }
}
</style>