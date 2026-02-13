<template>
  <div class="page-header">
    <div class="header-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb" v-if="showBreadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="item in breadcrumbItems" 
          :key="item.path"
          :to="item.path ? { path: item.path } : null"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 页面标题 -->
      <div class="page-title-section">
        <h1 class="page-title" v-if="title">{{ title }}</h1>
        <div class="page-subtitle" v-if="subtitle">{{ subtitle }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="page-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- 额外内容（如标签页、筛选器等） -->
    <div class="page-extra" v-if="$slots.extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  showBreadcrumb: {
    type: Boolean,
    default: true
  },
  customBreadcrumb: {
    type: Array,
    default: null
  }
})

const route = useRoute()
const router = useRouter()

// 生成面包屑导航
const breadcrumbItems = computed(() => {
  if (props.customBreadcrumb) {
    return props.customBreadcrumb
  }

  const items = []
  const pathSegments = route.path.split('/').filter(Boolean)
  let currentPath = ''

  pathSegments.forEach(segment => {
    currentPath += '/' + segment
    
    // 跳过动态路由参数
    if (segment.startsWith(':') || /^\d+$/.test(segment)) {
      return
    }

    // 查找对应的路由配置
    const matchedRoute = router.resolve(currentPath).matched
    const routeRecord = matchedRoute[matchedRoute.length - 1]
    
    if (routeRecord && routeRecord.meta?.title) {
      items.push({
        path: currentPath,
        title: routeRecord.meta.title
      })
    }
  })

  // 如果面包屑最后一项与页面标题相同，则移除重复
  if (items.length > 0 && props.title === items[items.length - 1].title) {
    items.pop()
  }

  // 添加当前页面标题
  if (props.title && (items.length === 0 || items[items.length - 1].title !== props.title)) {
    items.push({
      path: null,
      title: props.title
    })
  }

  return items
})
</script>

<style scoped>
.page-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.breadcrumb {
  margin-bottom: 12px;
}

.page-title-section {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
}

.page-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page-extra {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>