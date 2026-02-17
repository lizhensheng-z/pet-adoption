<template>

    <PageHeader title="宠物详情">
      <template #actions>
        <el-button @click="handleBack">
          <el-icon><Back /></el-icon>
          返回
        </el-button>
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
      </template>
    </PageHeader>

    <div class="page-container">
      <el-card v-loading="loading">
        <el-row :gutter="24">
          <!-- 左侧图片 -->
          <el-col :span="8">
            <div class="pet-images">
              <el-image
                v-if="petDetail.coverUrl"
                :src="petDetail.coverUrl"
                style="width: 100%; height: 300px; border-radius: 8px"
                fit="cover"
              />
              <div v-else class="image-placeholder">
                <el-icon><Picture /></el-icon>
                <span>暂无图片</span>
              </div>
            </div>
          </el-col>

          <!-- 右侧信息 -->
          <el-col :span="16">
            <div class="pet-info">
              <h2>{{ petDetail.name }}</h2>
              
              <el-descriptions :column="2" border>
                <el-descriptions-item label="物种">
                  <el-tag :type="petDetail.species === 'CAT' ? 'warning' : 'success'">
                    {{ petDetail.species === 'CAT' ? '猫' : petDetail.species === 'DOG' ? '狗' : '其他' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="品种">{{ petDetail.breed || '-' }}</el-descriptions-item>
                <el-descriptions-item label="性别">
                  {{ petDetail.gender === 'MALE' ? '公' : petDetail.gender === 'FEMALE' ? '母' : '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="年龄">{{ petDetail.ageMonth }} 个月</el-descriptions-item>
                <el-descriptions-item label="体型">
                  {{ petDetail.size === 'S' ? '小型' : petDetail.size === 'M' ? '中型' : '大型' }}
                </el-descriptions-item>
                <el-descriptions-item label="毛色">{{ petDetail.color || '-' }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="getStatusType(petDetail.status)">
                    {{ getStatusText(petDetail.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ formatDate(petDetail.publishedTime) }}</el-descriptions-item>
              </el-descriptions>

              <div class="health-info">
                <h4>健康信息</h4>
                <el-space wrap>
                  <el-tag v-if="petDetail.sterilized" type="success">已绝育</el-tag>
                  <el-tag v-if="petDetail.vaccinated" type="success">已疫苗</el-tag>
                  <el-tag v-if="petDetail.dewormed" type="success">已驱虫</el-tag>
                  <el-tag v-if="!petDetail.sterilized" type="info">未绝育</el-tag>
                  <el-tag v-if="!petDetail.vaccinated" type="info">未疫苗</el-tag>
                  <el-tag v-if="!petDetail.dewormed" type="info">未驱虫</el-tag>
                </el-space>
              </div>

              <div class="description-section" v-if="petDetail.healthDesc">
                <h4>健康描述</h4>
                <p>{{ petDetail.healthDesc }}</p>
              </div>

              <div class="description-section" v-if="petDetail.personalityDesc">
                <h4>性格描述</h4>
                <p>{{ petDetail.personalityDesc }}</p>
              </div>

              <div class="description-section" v-if="petDetail.adoptRequirements">
                <h4>领养要求</h4>
                <p>{{ petDetail.adoptRequirements }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, Edit, Picture } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import {petAPI} from '@/api/modules/pet.js'

const route = useRoute()
const router = useRouter()

const petDetail = ref({})
const loading = ref(false)

// 获取宠物详情
const getPetDetail = async () => {
  loading.value = true
  try {
    const { data } = await petAPI.getPetDetail(Number(route.params.id))
    petDetail.value = data
  } catch (error) {
    ElMessage.error('获取宠物详情失败')
    console.error('获取宠物详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.push('/org/pet')
}

// 编辑
const handleEdit = () => {
  router.push(`/org/pet/edit/${route.params.id}`)
}

// 状态类型映射
const getStatusType = (status) => {
  const map = {
    'PUBLISHED': 'success',
    'DRAFT': 'info',
    'OFFLINE': 'danger'
  }
  return map[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const map = {
    'PUBLISHED': '已发布',
    'DRAFT': '草稿',
    'OFFLINE': '已下架'
  }
  return map[status] || status
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  getPetDetail()
})
</script>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
}

.pet-images {
  margin-bottom: var(--spacing-lg);
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}

.image-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.pet-info h2 {
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
  color: var(--el-text-color-primary);
}

.health-info {
  margin: var(--spacing-lg) 0;
}

.health-info h4 {
  margin-bottom: var(--spacing-sm);
  color: var(--el-text-color-primary);
}

.description-section {
  margin: var(--spacing-lg) 0;
}

.description-section h4 {
  margin-bottom: var(--spacing-sm);
  color: var(--el-text-color-primary);
}

.description-section p {
  margin: 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}
</style>