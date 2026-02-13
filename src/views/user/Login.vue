<template>
  <div class="auth-page">
    <div class="auth-container">
      <el-card class="auth-card">
        <template #header>
          <h2>登录</h2>
        </template>
        
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="用户名/邮箱" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名或邮箱" />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" style="width: 100%;" @click="handleLogin" :loading="loading">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="auth-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref(null)
const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  try {
    loading.value = true
    await authStore.login(form.value)
    ElMessage.success('登录成功')
    
    // 根据用户角色跳转到不同页面
    const role = authStore.userRole
    if (role === 'ADMIN') {
      router.push('/admin')
    } else if (role === 'ORG') {
      router.push('/org')
    } else {
      router.push('/home')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%);
  position: relative;
  z-index: 1;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.auth-card {
  position: relative;
  z-index: 2;
}

.auth-card h2 {
  margin: 0;
  text-align: center;
  color: var(--text-primary);
}

.auth-footer {
  text-align: center;
  margin-top: 16px;
  color: var(--text-secondary);
}

.auth-footer a {
  color: var(--primary-color);
  margin-left: 8px;
}
</style>