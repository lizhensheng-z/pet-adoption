<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑标签' : '新增标签'"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="标签名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入标签名称"
          maxlength="64"
          show-word-limit
          clearable
        />
      </el-form-item>

      <el-form-item label="标签类型" prop="tagType">
        <el-select v-model="form.tagType" placeholder="请选择标签类型" style="width: 100%">
          <el-option
            v-for="item in tagTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="启用状态" prop="enabled">
        <el-switch
          v-model="form.enabled"
          :active-value="true"
          :inactive-value="false"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        {{ isEdit ? '更新' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useTagStore } from '@/stores/tag.js'

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

const tagStore = useTagStore()
const formRef = ref()
const loading = ref(false)

// 表单数据
const form = ref({
  name: '',
  tagType: '',
  enabled: 1
})

// 标签类型选项
const tagTypeOptions = [
  { label: '物种', value: 'SPECIES' },
  { label: '性格特征', value: 'PERSONALITY' },
  { label: '健康状况', value: 'HEALTH' },
  { label: '外貌特征', value: 'FEATURE' }
]

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  tagType: [
    { required: true, message: '请选择标签类型', trigger: 'change' }
  ]
}

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.data)

// 重置表单
const resetForm = () => {
  form.value = {
    name: '',
    tagType: '',
    enabled: true
  }
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

  // 监听数据变化
watch(() => props.data, (newData) => {
  if (newData) {
    // 编辑模式 - 确保enabled是布尔值
    form.value = {
      name: newData.name,
      tagType: newData.tagType,
      enabled: Boolean(newData.enabled)
    }
  } else {
    // 新增模式
    resetForm()
  }
}, { immediate: true })

// 关闭对话框
const handleClose = () => {
  visible.value = false
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    let res
    if (isEdit.value) {
      // 编辑模式
      res = await tagStore.updateTag(props.data.id, form.value)
    } else {
      // 新增模式
      res = await tagStore.createTag(form.value)
    }

    if (res.code === 10000) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      emit('success')
      handleClose()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    if (error !== false) { // 忽略表单验证错误
      console.error('提交表单失败:', error)
      ElMessage.error('操作失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>