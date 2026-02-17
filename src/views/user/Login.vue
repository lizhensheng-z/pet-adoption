<template>
  <div class="auth-page">
    <!-- 背景装饰物 -->
    <div class="bg-decoration top-left"></div>
    <div class="bg-decoration bottom-right"></div>

    <div class="auth-container">
      <!-- 顶部欢迎语 -->
      <div class="welcome-section">
        <h1 class="welcome-title">欢迎回来</h1>
        <p class="welcome-subtitle">发现更多可爱的小生命，给它们一个家</p>
      </div>

      <div class="auth-card">
        <el-form :model="form" :rules="rules" ref="formRef">
          <!-- 用户名 -->
          <div class="custom-input-item">
            <span class="input-label">账号</span>
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名或邮箱"
              prefix-icon="User"
            />
          </div>
          
          <!-- 密码 -->
          <div class="custom-input-item">
            <div class="input-header">
              <span class="input-label">密码</span>
              <span class="forget-pwd" @click="handleForget">忘记密码？</span>
            </div>
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              show-password
              prefix-icon="Lock"
            />
          </div>
          
          <!-- 登录按钮 -->
          <div class="btn-group">
            <el-button 
              type="primary" 
              class="login-btn" 
              @click="handleLogin" 
              :loading="loading"
            >
              登 录
            </el-button>
          </div>
        </el-form>

        <div class="auth-footer">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>

        <!-- 第三方登录（可选，增加高级感） -->
        <div class="social-login">
          <div class="divider">其他方式登录</div>
          <div class="social-icons">
            <div class="icon-circle"><el-icon><ChatDotRound /></el-icon></div>
            <div class="icon-circle"><el-icon><Phone /></el-icon></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { ElMessage } from 'element-plus'
import { User, Lock, ChatDotRound, Phone } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref(null)
const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}


const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    loading.value = true

    // 1. 登录
    console.log('1. 发起登录请求...')
    await authStore.login(form.value)
    
    // 2. 检查 Store 状态
    const role = authStore.userRole
    console.log('2. 登录成功，当前角色:', role)
    console.log('3. 当前 Token:', authStore.token)

    ElMessage.success('登录成功')

    // 4. 确定跳转路径
    let targetPath = '/home'
    if (role === 'ADMIN') targetPath = '/admin'
    else if (role === 'ORG') {
      // 根据机构状态决定跳转路径
      const user = authStore.user
      if (user?.orgStatus === 'PENDING' && !user?.orgProfileComplete) {
        targetPath = '/org/profile/complete'
      } else if (user?.orgStatus === 'REJECTED') {
        targetPath = '/org/profile'
      } else {
        targetPath = '/org'
      }
    }
    
    console.log('4. 准备跳转至:', targetPath)

    // 5. 执行跳转并捕获结果
    // 注意：一定要 await router.push
    const navigationResult = await router.push(targetPath)
    
    if (navigationResult) {
      console.error('5. 跳转失败或被重定向:', navigationResult)
    } else {
      console.log('5. 跳转命令已成功执行')
    }

  } catch (error) {
    console.error('登录过程发生错误:', error)
  } finally {
    loading.value = false
  }
}




const handleForget = () => {
  ElMessage.info('功能开发中...')
}
</script>

<style scoped>
/* 页面基础样式 */
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  overflow: hidden;
  position: relative;
}

/* 背景装饰光晕 */
.bg-decoration {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.4;
}
.top-left {
  top: -100px;
  left: -50px;
  background: #FF8C42;
}
.bottom-right {
  bottom: -50px;
  right: -50px;
  background: #FFB380;
}

.auth-container {
  position: relative;
  z-index: 1;
  padding: 60px 24px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 欢迎语区域 */
.welcome-section {
  margin-bottom: 40px;
}
.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  letter-spacing: 1px;
}
.welcome-subtitle {
  font-size: 14px;
  color: #999;
}

/* 登录表单卡片 */
.auth-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 30px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 自定义输入框样式 */
.custom-input-item {
  margin-bottom: 24px;
}
.input-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forget-pwd {
  font-size: 12px;
  color: #FF8C42;
  cursor: pointer;
}

/* 覆盖 Element Plus 样式 */
:deep(.el-input__wrapper) {
  background-color: #f5f6f8;
  box-shadow: none !important;
  border-radius: 12px;
  padding: 8px 12px;
  transition: all 0.3s;
}
:deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #FF8C42 !important;
}

/* 登录按钮 */
.btn-group {
  margin-top: 32px;
}
.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
  transition: transform 0.2s;
}
.login-btn:active {
  transform: scale(0.98);
}

/* 底部页脚 */
.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}
.auth-footer a {
  color: #FF8C42;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

/* 第三方登录 */
.social-login {
  margin-top: 40px;
}
.divider {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ccc;
  margin-bottom: 20px;
}
.divider::before, .divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
  margin: 0 10px;
}
.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 20px;
  transition: all 0.3s;
}
.icon-circle:hover {
  border-color: #FF8C42;
  color: #FF8C42;
}
</style>
