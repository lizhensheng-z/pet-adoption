<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑配置' : '新增配置'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="配置键名" prop="configKey">
        <el-input 
          v-model="formData.configKey" 
          placeholder="请输入配置键名"
          :disabled="isEdit"
        />
      </el-form-item>
      
      <el-form-item label="配置值" prop="configValue">
        <el-input 
          v-model="formData.configValue" 
          type="textarea" 
          :rows="6"
          placeholder="请输入配置值，支持JSON格式"
          @blur="validateJson"
        />
        <div class="json-hint" v-if="jsonError">
          <el-icon><WarningFilled /></el-icon>
          <span>{{ jsonError }}</span>
        </div>
      </el-form-item>
      
      <el-form-item label="备注" prop="remark">
        <el-input 
          v-model="formData.remark" 
          type="textarea" 
          :rows="3"
          placeholder="请输入配置项描述"
        />
      </el-form-item>
      
      <!-- JSON格式化预览 -->
      <el-form-item v-if="isJsonFormat && !jsonError" label="JSON预览">
        <el-card class="json-preview">
          <pre>{{ formattedJson }}</pre>
        </el-card>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit" 
          :loading="loading"
          :disabled="!!jsonError"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { configApi } from '@/api/modules/admin.js'

// Props & Emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const loading = ref(false)
const formRef = ref()
const jsonError = ref('')

const formData = ref({
  id: null,
  configKey: '',
  configValue: '',
  remark: ''
})

// 表单验证规则
const formRules = {
  configKey: [
    { required: true, message: '请输入配置键名', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  configValue: [
    { required: true, message: '请输入配置值', trigger: 'blur' },
    { max: 2000, message: '配置值长度不能超过2000字符', trigger: 'blur' }
  ],
  remark: [
    { max: 255, message: '备注长度不能超过255字符', trigger: 'blur' }
  ]
}

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.data?.id)

const isJsonFormat = computed(() => {
  try {
    JSON.parse(formData.value.configValue)
    return true
  } catch {
    return false
  }
})

const formattedJson = computed(() => {
  try {
    return JSON.stringify(JSON.parse(formData.value.configValue), null, 2)
  } catch {
    return ''
  }
})

// 监听数据变化
watch(() => props.data, (newData) => {
  if (newData) {
    formData.value = {
      id: newData.id || null,
      configKey: newData.configKey || '',
      configValue: newData.configValue || '',
      remark: newData.remark || ''
    }
  } else {
    // 避免引用resetForm函数，直接重置表单
    formData.value = {
      id: null,
      configKey: '',
      configValue: '',
      remark: ''
    }
    jsonError.value = ''
    nextTick(() => {
      formRef.value?.clearValidate()
    })
  }
}, { immediate: true })

// 方法
const resetForm = () => {
  formData.value = {
    id: null,
    configKey: '',
    configValue: '',
    remark: ''
  }
  jsonError.value = ''
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const validateJson = () => {
  const value = formData.value.configValue.trim()
  if (!value) {
    jsonError.value = ''
    return
  }
  
  // 检查是否为JSON格式
  if ((value.startsWith('{') && value.endsWith('}')) || 
      (value.startsWith('[') && value.endsWith(']'))) {
    try {
      JSON.parse(value)
      jsonError.value = ''
    } catch (e) {
      jsonError.value = `JSON格式错误: ${e.message}`
    }
  } else {
    jsonError.value = ''
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    if (jsonError.value) {
      ElMessage.error('请修正JSON格式错误')
      return
    }
    
    loading.value = true
    
    await configApi.saveConfig(formData.value)
    
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
    emit('success')
    handleClose()
  } catch (error) {
    if (error?.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
    }
    console.error('保存配置失败:', error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  resetForm()
}
</script>

<style scoped>
.json-hint {
  margin-top: 4px;
  color: var(--el-color-danger);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.json-preview {
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
}

.json-preview pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>