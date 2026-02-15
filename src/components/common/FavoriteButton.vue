<template>
  <div class="favorite-button">
    <el-button
      :type="buttonType"
      :size="size"
      :circle="circle"
      :plain="plain"
      :loading="loading"
      :disabled="disabled"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <el-icon>
        <StarFilled v-if="isFavorited" />
        <Star v-else />
      </el-icon>
      <span v-if="showText && !circle" class="button-text">
        {{ buttonText }}
      </span>
    </el-button>

    <!-- 提示信息 -->
    <el-tooltip
      :content="tooltipText"
      placement="top"
      :disabled="!showTooltip"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useFavorite } from '@/composables/useFavorite'

const props = defineProps({
  petId: {
    type: [Number, String],
    required: true
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info', 'default'].includes(value)
  },
  circle: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: false
  },
  showTooltip: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autoCheck: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['change', 'success', 'error', 'login-required'])

// 使用收藏Hook
const { 
  isFavorited, 
  loading, 
  checking, 
  checkStatus, 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite 
} = useFavorite(props.petId)

// 本地状态
const hovered = ref(false)

// 计算属性
const buttonType = computed(() => {
  if (isFavorited.value) {
    return props.type === 'default' ? 'danger' : props.type
  }
  return props.type
})

const buttonText = computed(() => {
  if (isFavorited.value) {
    return hovered.value ? '取消收藏' : '已收藏'
  }
  return '收藏'
})

const tooltipText = computed(() => {
  if (isFavorited.value) {
    return '点击取消收藏'
  }
  return '点击收藏此宠物'
})

// 方法
const handleClick = async () => {
  if (props.disabled) return

  const result = await toggleFavorite()
  
  if (result.success) {
    emit('change', result.favorited)
    emit('success', result)
  } else if (result.needLogin) {
    emit('login-required')
  } else {
    emit('error', result)
  }
}

const handleMouseEnter = () => {
  hovered.value = true
}

const handleMouseLeave = () => {
  hovered.value = false
}

// 监听petId变化
watch(() => props.petId, (newPetId) => {
  if (newPetId && props.autoCheck) {
    checkStatus()
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  if (props.autoCheck) {
    checkStatus()
  }
})
</script>

<style lang="scss" scoped>
.favorite-button {
  display: inline-block;

  .button-text {
    margin-left: 4px;
  }

  // 收藏状态的动画效果
  .el-button {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  // 心跳动画
  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .el-button.is-favorited {
    animation: heartbeat 0.3s ease;
  }
}
</style>