<template>
  <div class="help-page">
    <div class="page-header">
      <el-button type="text" @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>帮助与反馈</h2>
    </div>

    <!-- 常见问题 -->
    <div class="section">
      <h3 class="section-title">
        <el-icon><QuestionFilled /></el-icon>
        常见问题
      </h3>
      <div class="faq-list">
        <el-collapse v-model="activeFaq" accordion>
          <el-collapse-item
            v-for="item in faqList"
            :key="item.id"
            :title="item.question"
            :name="item.id"
          >
            <div class="faq-answer">{{ item.answer }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- 意见反馈 -->
    <div class="section">
      <h3 class="section-title">
        <el-icon><EditPen /></el-icon>
        意见反馈
      </h3>
      <div class="feedback-form">
        <el-form :model="feedbackForm" :rules="feedbackRules" ref="feedbackRef" label-position="top">
          <el-form-item label="反馈类型" prop="type">
            <el-radio-group v-model="feedbackForm.type">
              <el-radio-button value="suggestion">功能建议</el-radio-button>
              <el-radio-button value="bug">问题反馈</el-radio-button>
              <el-radio-button value="complaint">投诉举报</el-radio-button>
              <el-radio-button value="other">其他</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="问题描述" prop="content">
            <el-input
              v-model="feedbackForm.content"
              type="textarea"
              :rows="5"
              placeholder="请详细描述您遇到的问题或建议..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="联系方式" prop="contact">
            <el-input
              v-model="feedbackForm.contact"
              placeholder="请输入您的手机号或邮箱（选填）"
            />
          </el-form-item>

          <el-form-item label="上传截图">
            <el-upload
              v-model:file-list="fileList"
              action="/api/upload?type=feedback"
              list-type="picture-card"
              :limit="3"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">最多上传3张截图，支持 jpg、png 格式</div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitFeedback" :loading="submitting" round>
              提交反馈
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 联系我们 -->
    <div class="section">
      <h3 class="section-title">
        <el-icon><Phone /></el-icon>
        联系我们
      </h3>
      <div class="contact-cards">
        <div class="contact-card">
          <el-icon class="contact-icon"><Service /></el-icon>
          <div class="contact-info">
            <h4>客服热线</h4>
            <p>400-123-4567</p>
            <span class="time">工作日 9:00-18:00</span>
          </div>
        </div>
        <div class="contact-card">
          <el-icon class="contact-icon"><Message /></el-icon>
          <div class="contact-info">
            <h4>邮箱联系</h4>
            <p>support@petadopt.com</p>
            <span class="time">24小时内回复</span>
          </div>
        </div>
        <div class="contact-card">
          <el-icon class="contact-icon"><ChatDotRound /></el-icon>
          <div class="contact-info">
            <h4>微信公众号</h4>
            <p>宠物领养平台</p>
            <span class="time">扫码关注获取更多资讯</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible" title="图片预览">
      <img :src="previewUrl" alt="预览图片" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, QuestionFilled, EditPen, Plus, Phone,
  Service, Message, ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()

// 常见问题列表
const activeFaq = ref('')
const faqList = [
  {
    id: 1,
    question: '如何申请领养宠物？',
    answer: '在宠物详情页点击"申请领养"按钮，填写领养申请表并提交。机构会在3个工作日内审核您的申请，审核通过后会安排面谈。'
  },
  {
    id: 2,
    question: '申请领养需要什么条件？',
    answer: '申请人需年满18周岁，有稳定的居住环境和经济能力，且家庭成员同意养宠。不同机构可能有额外要求，具体以申请页面提示为准。'
  },
  {
    id: 3,
    question: '如何取消领养申请？',
    answer: '在"我的申请"页面找到对应申请，点击"取消申请"按钮并填写取消原因即可。注意：审核中或已通过的申请无法取消。'
  },
  {
    id: 4,
    question: '如何成为合作机构？',
    answer: '注册时选择"机构用户"，完成注册后需提交机构资质信息等待审核。审核通过后即可发布宠物信息。'
  },
  {
    id: 5,
    question: '信用分有什么用？',
    answer: '信用分是评估用户领养诚信的重要指标。信用分越高，申请通过的概率越大。按时打卡回访、完成领养流程可增加信用分。'
  },
  {
    id: 6,
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，通过注册手机号或邮箱验证后即可重置密码。'
  }
]

// 反馈表单
const feedbackRef = ref(null)
const submitting = ref(false)
const fileList = ref([])
const previewVisible = ref(false)
const previewUrl = ref('')

const feedbackForm = reactive({
  type: 'suggestion',
  content: '',
  contact: ''
})

const feedbackRules = {
  type: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请描述您的问题或建议', trigger: 'blur' },
    { min: 10, max: 500, message: '内容长度在10-500个字符之间', trigger: 'blur' }
  ]
}

const goBack = () => {
  router.back()
}

const handlePreview = (file) => {
  previewUrl.value = file.url
  previewVisible.value = true
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传3张图片')
}

const submitFeedback = async () => {
  const valid = await feedbackRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    // 模拟提交（实际应调用API）
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('感谢您的反馈，我们会尽快处理！')

    // 重置表单
    feedbackRef.value.resetFields()
    fileList.value = []
  } catch (error) {
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.back-btn {
  color: var(--el-text-color-regular);
  padding: 0;
  margin-right: 12px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.section {
  margin: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-title .el-icon {
  color: #FF8C42;
}

/* FAQ 样式 */
.faq-list {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-content-bg-color: transparent;
}

.faq-answer {
  color: #606266;
  line-height: 1.8;
  padding: 8px 0;
}

/* 反馈表单样式 */
.feedback-form {
  :deep(.el-radio-button__inner) {
    padding: 8px 16px;
  }

  :deep(.el-textarea__inner) {
    border-radius: 8px;
  }
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

/* 联系卡片样式 */
.contact-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  gap: 16px;
}

.contact-icon {
  font-size: 32px;
  color: #FF8C42;
}

.contact-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  color: #303133;
}

.contact-info p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #FF8C42;
}

.contact-info .time {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 480px) {
  .section {
    margin: 12px;
    padding: 16px;
  }

  :deep(.el-radio-button__inner) {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>