<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑公告' : '新增公告'"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      v-loading="loading"
    >
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入公告标题"
          maxlength="128"
          show-word-limit
          clearable
        />
      </el-form-item>
      
      <el-form-item label="公告内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="8"
          placeholder="请输入公告内容，支持纯文本格式"
          maxlength="2000"
          show-word-limit
          resize="vertical"
        />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio value="DRAFT" border>
            <el-icon><EditPen /></el-icon>
            草稿
          </el-radio>
          <el-radio value="PUBLISHED" border>
            <el-icon><Promotion /></el-icon>
            发布
          </el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="预览" v-if="form.title || form.content">
        <div class="notice-preview">
          <h4>{{ form.title || '公告标题' }}</h4>
          <div class="preview-content">{{ form.content || '公告内容预览' }}</div>
        </div>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">
          <el-icon><Close /></el-icon>
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit" 
          :loading="loading"
          :disabled="!form.title || !form.content"
        >
          <el-icon><Check /></el-icon>
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useNoticeStore } from '@/stores/notice.js'

const props = defineProps({
  modelValue: Boolean,
  notice: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const noticeStore = useNoticeStore()
const formRef = ref()

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.notice)

// 表单数据
const form = ref({
  title: '',
  content: '',
  status: 'DRAFT'
})

// 加载状态
const loading = ref(false)

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 2, max: 128, message: '长度在 2 到 128 个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { min: 10, max: 2000, message: '长度在 10 到 2000 个字符之间', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择公告状态', trigger: 'change' }
  ]
}

// 监听notice变化，初始化表单数据
watch(() => props.notice, (newVal) => {
  if (newVal) {
    // 编辑模式
    form.value = {
      title: newVal.title || '',
      content: newVal.content || '',
      status: newVal.status || 'DRAFT'
    }
  } else {
    // 新增模式
    form.value = {
      title: '',
      content: '',
      status: 'DRAFT'
    }
  }
  
  // 重置表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}, { immediate: true })

// 关闭对话框
const handleClose = () => {
  if (loading.value) return
  
  visible.value = false
  
  // 延迟重置表单，避免动画过程中的闪烁
  nextTick(() => {
    formRef.value?.resetFields()
    form.value = {
      title: '',
      content: '',
      status: 'DRAFT'
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (loading.value) return
  
  try {
    // 表单验证
    await formRef.value.validate()
    
    loading.value = true
    
    let response
    if (isEdit.value) {
      // 编辑模式
      response = await noticeStore.updateNotice(props.notice.id, form.value)
    } else {
      // 新增模式
      response = await noticeStore.createNotice(form.value)
    }
    
    if (response.code === 10000) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      emit('success')
      handleClose()
    } else {
      ElMessage.error(response.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    if (error !== false) { // 排除表单验证错误
      console.error('提交公告失败:', error)
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    }
  } finally {
    loading.value = false
  }
}

// 暴露方法给父组件
const resetForm = () => {
  formRef.value?.resetFields()
}

const validateForm = async () => {
  return await formRef.value.validate()
}

// 暴露给父组件的方法
defineExpose({
  resetForm,
  validateForm
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.notice-preview {
  padding: var(--spacing-md);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-base);
  border: 1px solid var(--border-color-light);
}

.notice-preview h4 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.preview-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

:deep(.el-radio.is-bordered) {
  margin-right: var(--spacing-md);
}

:deep(.el-radio__input) {
  margin-right: var(--spacing-xs);
}

:deep(.el-form-item__label) {
  font-weight: 600;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}
</style>