/**
 * 标签相关工具函数
 */

// 标签类型映射
export const TAG_TYPE_MAP = {
  SPECIES: {
    label: '物种',
    value: 'SPECIES',
    color: 'primary',
    description: '宠物种类相关标签'
  },
  PERSONALITY: {
    label: '性格特征',
    value: 'PERSONALITY',
    color: 'success',
    description: '宠物性格相关标签'
  },
  HEALTH: {
    label: '健康状况',
    value: 'HEALTH',
    color: 'warning',
    description: '宠物健康相关标签'
  },
  FEATURE: {
    label: '外貌特征',
    value: 'FEATURE',
    color: 'info',
    description: '宠物外貌相关标签'
  }
}

// 获取标签类型中文名称
export function getTagTypeLabel(type) {
  return TAG_TYPE_MAP[type]?.label || type
}

// 获取标签类型对应的颜色
export function getTagTypeColor(type) {
  return TAG_TYPE_MAP[type]?.color || 'info'
}

// 获取所有标签类型选项
export function getTagTypeOptions() {
  return Object.values(TAG_TYPE_MAP)
}

// 格式化标签类型显示
export function formatTagType(type) {
  return getTagTypeLabel(type)
}

// 验证标签名称
export function validateTagName(name) {
  if (!name || name.trim().length === 0) {
    return '标签名称不能为空'
  }
  if (name.length > 64) {
    return '标签名称不能超过64个字符'
  }
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s-]+$/.test(name)) {
    return '标签名称只能包含中文、英文、数字、空格和连字符'
  }
  return null
}

// 标签数据格式化
export function formatTagData(tag) {
  return {
    ...tag,
    tagTypeLabel: getTagTypeLabel(tag.tagType),
    tagTypeColor: getTagTypeColor(tag.tagType),
    statusText: tag.enabled ? '启用' : '禁用',
    statusType: tag.enabled ? 'success' : 'danger'
  }
}

// 标签搜索参数处理
export function processSearchParams(params) {
  const processed = { ...params }
  
  // 移除空值
  Object.keys(processed).forEach(key => {
    if (processed[key] === '' || processed[key] === null || processed[key] === undefined) {
      delete processed[key]
    }
  })
  
  return processed
}

// 标签排序（按类型和名称）
export function sortTags(tags) {
  return [...tags].sort((a, b) => {
    // 先按类型排序
    if (a.tagType !== b.tagType) {
      const typeOrder = ['SPECIES', 'PERSONALITY', 'HEALTH', 'FEATURE']
      return typeOrder.indexOf(a.tagType) - typeOrder.indexOf(b.tagType)
    }
    // 同类型按名称排序
    return a.name.localeCompare(b.name, 'zh-CN')
  })
}

// 标签分组（按类型）
export function groupTagsByType(tags) {
  const groups = {}
  
  tags.forEach(tag => {
    if (!groups[tag.tagType]) {
      groups[tag.tagType] = {
        type: tag.tagType,
        label: getTagTypeLabel(tag.tagType),
        tags: []
      }
    }
    groups[tag.tagType].tags.push(formatTagData(tag))
  })
  
  return Object.values(groups).sort((a, b) => {
    const typeOrder = ['SPECIES', 'PERSONALITY', 'HEALTH', 'FEATURE']
    return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
  })
}