<template>
  <div class="media-uploader">
    <!-- 封面图显示 -->
    <div class="cover-section">
      <div class="cover-label">封面图</div>
      <div class="cover-image">
        <el-image
          v-if="coverMedia"
          :src="coverMedia.url"
          fit="cover"
          class="cover-img"
        >
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
              <span>图片加载失败</span>
            </div>
          </template>
        </el-image>
        <div v-else class="empty-cover">
          <el-icon><Picture /></el-icon>
          <span>请选择封面图</span>
        </div>
      </div>
    </div>

    <!-- 图片列表 -->
    <div class="image-list">
      <div
        v-for="(media, index) in imageList"
        :key="index"
        class="image-item"
        :class="{ 'is-cover': media.isCover, 'is-uploading': media.isUploading }"
      >
        <el-image :src="media.url" fit="cover" class="image-inner">
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>

        <!-- 上传进度 -->
        <div v-if="media.isUploading" class="upload-progress">
          <el-progress
            type="circle"
            :percentage="media.uploadProgress"
            :width="60"
          />
        </div>

        <!-- 悬停操作按钮 -->
        <div v-if="!media.isUploading" class="image-overlay">
          <el-button
            size="small"
            type="primary"
            @click="setCover(index)"
            :disabled="media.isCover"
          >
            {{ media.isCover ? '已设封面' : '设为封面' }}
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="remove(index)"
          >
            删除
          </el-button>
        </div>

        <!-- 封面标记 -->
        <div v-if="media.isCover" class="cover-badge">
          <el-icon><Select /></el-icon>
          封面
        </div>
      </div>

      <!-- 上传按钮 -->
      <el-upload
        v-if="imageList.length < 9"
        class="upload-item"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :http-request="handleUpload"
        accept="image/jpeg,image/jpg,image/png,image/gif"
      >
        <div class="upload-placeholder">
          <el-icon><Plus /></el-icon>
          <span>上传图片</span>
        </div>
      </el-upload>
    </div>

    <!-- 提示信息 -->
    <div class="upload-tips">
      <el-alert
        title="请上传3-9张宠物照片，支持jpg、png、gif格式，单张不超过5MB"
        type="info"
        :closable="false"
        show-icon
      />
    </div>

    <!-- 图片数量提示 -->
    <div class="count-info">
      <span class="current-count">{{ imageList.length }}</span>
      <span class="separator">/</span>
      <span class="max-count">9</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Picture, Select } from '@element-plus/icons-vue'

const props = defineProps({
  mediaList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['upload', 'remove', 'set-cover'])

// 图片列表
const imageList = computed(() => {
  return props.mediaList.filter(m => m.mediaType === 'IMAGE')
})

// 封面图
const coverMedia = computed(() => {
  return imageList.value.find(m => m.isCover)
})

// 上传前验证
const handleBeforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }

  return true
}

// 上传文件
const handleUpload = ({ file }) => {
  if (imageList.value.length >= 9) {
    ElMessage.warning('最多只能上传9张图片')
    return
  }

  emit('upload', file)
}

// 设置封面
const setCover = (index) => {
  emit('set-cover', index)
}

// 删除图片
const remove = (index) => {
  emit('remove', index)
}
</script>

<style scoped>
.media-uploader {
  width: 100%;
}

.cover-section {
  margin-bottom: var(--spacing-lg);
}

.cover-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.cover-image {
  width: 100%;
  height: 300px;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  background: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
}

.cover-img {
  width: 100%;
  height: 100%;
}

.empty-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-placeholder);
  font-size: var(--font-size-sm);
}

.empty-cover .el-icon {
  font-size: 48px;
  color: var(--text-placeholder);
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  border: 2px solid transparent;
  background: var(--bg-light);
  transition: all 0.3s;
}

.image-item.is-cover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.image-item.is-uploading {
  opacity: 0.6;
}

.image-inner {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--text-placeholder);
  background: var(--bg-light);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.cover-badge {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--border-radius-small);
  z-index: 1;
}

.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 2;
}

.upload-item {
  aspect-ratio: 1;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-medium);
  background: var(--bg-light);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.upload-placeholder:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--primary-light);
}

.upload-placeholder .el-icon {
  font-size: 32px;
}

.upload-tips {
  margin-top: var(--spacing-md);
}

.count-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.current-count {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-color);
}

.separator {
  color: var(--text-placeholder);
}

.max-count {
  color: var(--text-placeholder);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .image-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--spacing-sm);
  }

  .cover-image {
    height: 200px;
  }
}
</style>