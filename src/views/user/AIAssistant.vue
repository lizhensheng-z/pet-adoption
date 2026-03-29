<template>
  <div class="ai-page">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="startNewConversation">
          <el-icon><Plus /></el-icon>
          <span>新建对话</span>
        </button>
      </div>

      <div class="sidebar-content">
        <div class="sidebar-section">
          <div class="section-title" @click="loadHistoryList">
            <el-icon><Clock /></el-icon>
            <span>历史记录</span>
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="model-info">
          <div class="model-icon">AI</div>
          <div class="model-text">
            <span class="model-name">DeepSeek</span>
            <span class="model-desc">智能助手</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 历史记录列表 -->
      <HistoryList
        v-if="showHistoryList"
        :list="historyList"
        :loading="loading"
        @select="loadSessionDetail"
        @delete="deleteSession"
        @delete-day="deleteDaySessions"
        @back="showHistoryList = false"
      />

      <!-- 对话区域 -->
      <div v-else class="chat-area">
        <!-- 消息列表 -->
        <div ref="messageContainerRef" class="message-list">
          <!-- 欢迎界面 -->
          <div v-if="showWelcome" class="welcome-container">
            <div class="welcome-logo">
              <div class="logo-circle">
                <span>AI</span>
              </div>
            </div>
            <h2 class="welcome-title">你好，我是AI小助手</h2>
            <p class="welcome-desc">我可以帮助你解答关于宠物领养的各种问题，包括：</p>
            <div class="feature-cards">
              <div class="feature-card" @click="quickAsk('如何选择适合自己的宠物？')">
                <div class="feature-icon">🐾</div>
                <div class="feature-text">宠物选择建议</div>
              </div>
              <div class="feature-card" @click="quickAsk('领养宠物需要准备什么？')">
                <div class="feature-icon">📋</div>
                <div class="feature-text">领养准备指南</div>
              </div>
              <div class="feature-card" @click="quickAsk('新手养宠有哪些注意事项？')">
                <div class="feature-icon">💡</div>
                <div class="feature-text">养宠注意事项</div>
              </div>
              <div class="feature-card" @click="quickAsk('如何照顾幼猫/幼犬？')">
                <div class="feature-icon">🐱</div>
                <div class="feature-text">幼宠护理知识</div>
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="message in messageList"
            :key="message.id"
            :class="['message-item', message.type === 1 ? 'user' : 'ai']"
          >
            <div class="message-avatar">
              <span v-if="message.type === 1">我</span>
              <span v-else>AI</span>
            </div>
            <div class="message-body">
              <div class="message-content" :class="{ generating: isGenerating && message.id === lastAiMessageId }">
                <template v-if="message.type === 1">
                  <div class="message-text">{{ message.reqText }}</div>
                </template>
                <template v-else>
                  <MarkdownRenderer :content="message.respText" />
                  <!-- 生成中光标 -->
                  <span v-if="isGenerating && message.id === lastAiMessageId" class="typing-cursor"></span>
                </template>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="isGenerating && currentAiText === ''" class="loading-message">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="loading-text">AI正在思考...</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-container">
            <textarea
              ref="inputRef"
              v-model="currentInput"
              placeholder="输入您的问题，按Enter发送..."
              @keydown.enter.exact.prevent="sendMessage"
              @input="adjustTextareaHeight"
              :disabled="isGenerating"
              rows="1"
              class="input-textarea"
            ></textarea>
            <button
              class="send-btn"
              @click="sendMessage"
              :disabled="!canSend"
              :class="{ active: canSend }"
            >
              <el-icon v-if="isGenerating"><Loading /></el-icon>
              <el-icon v-else><Promotion /></el-icon>
            </button>
          </div>
          <div class="input-hint">
            <span>AI助手可能产生不准确信息，请以实际情况为准</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Clock, ArrowRight, Loading, Promotion } from '@element-plus/icons-vue'
import HistoryList from './components/HistoryList.vue'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import { useAuthStore } from '@/stores/auth.js'
import * as aiAPI from '@/api/modules/ai.js'

const authStore = useAuthStore()

// 对话消息列表
const messageList = ref([])

// 当前输入
const currentInput = ref('')

// 是否正在生成回复
const isGenerating = ref(false)

// 当前AI正在生成的文本
const currentAiText = ref('')

// 当前会话ID
const currentSessionId = ref(null)

// 是否显示历史列表
const showHistoryList = ref(false)

// 历史会话列表
const historyList = ref([])

// 加载状态
const loading = ref(false)

// 消息容器引用
const messageContainerRef = ref(null)

// 输入框引用
const inputRef = ref(null)

// 查询天数
const queryDays = ref(7)

// 最后一条AI消息ID
const lastAiMessageId = computed(() => {
  const aiMessages = messageList.value.filter(m => m.type === 2)
  return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].id : null
})

// 是否可以发送消息
const canSend = computed(() => {
  return currentInput.value.trim() && !isGenerating.value
})

// 是否显示欢迎消息
const showWelcome = computed(() => {
  return messageList.value.length === 0
})

// 快速提问
const quickAsk = (question) => {
  currentInput.value = question
  sendMessage()
}

// 调整文本框高度
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
      inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 120) + 'px'
    }
  })
}

// 发送消息(流式响应)
const sendMessage = async () => {
  if (!canSend.value) return

  const userMessage = currentInput.value.trim()
  currentInput.value = ''

  // 重置文本框高度
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }

  // 添加用户消息
  messageList.value.push({
    id: Date.now(),
    type: 1,
    reqText: userMessage,
    createTime: new Date().toISOString()
  })
  scrollToBottom()

  // 添加AI消息占位
  const aiMessageId = Date.now() + 1
  messageList.value.push({
    id: aiMessageId,
    type: 2,
    respText: '',
    createTime: new Date().toISOString()
  })
  const aiIndex = messageList.value.findIndex(m => m.id === aiMessageId)

  isGenerating.value = true
  currentAiText.value = ''

  try {
    const response = await aiAPI.chatCompletions(userMessage)

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        // 跳过event行
        if (trimmed.startsWith('event:')) continue

        // 只处理data行
        if (trimmed.startsWith('data:')) {
          const data = trimmed.substring(5).trim()

          if (data && data !== '[DONE]') {
            messageList.value[aiIndex] = {
              ...messageList.value[aiIndex],
              respText: messageList.value[aiIndex].respText + data
            }
            currentAiText.value = messageList.value[aiIndex].respText
            scrollToBottom()
          }
        }
      }
    }

    // 处理剩余缓冲区
    const remaining = buffer.trim()
    if (remaining.startsWith('')) {
      const data = remaining.substring(5).trim()
      if (data && data !== '[DONE]') {
        messageList.value[aiIndex] = {
          ...messageList.value[aiIndex],
          respText: messageList.value[aiIndex].respText + data
        }
        currentAiText.value = messageList.value[aiIndex].respText
      }
    }

  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送失败，请重试')
    messageList.value.splice(aiIndex, 1)
  } finally {
    isGenerating.value = false
    currentAiText.value = ''
    scrollToBottom()
  }
}

// 加载历史会话列表
const loadHistoryList = async () => {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录查看历史记录')
    return
  }

  try {
    loading.value = true
    const response = await aiAPI.getSessionListGroupByDay(queryDays.value)
    historyList.value = response.data || []
    showHistoryList.value = true
  } catch (error) {
    console.error('加载历史记录失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 加载会话详情
const loadSessionDetail = async (sessionId) => {
  try {
    loading.value = true
    const response = await aiAPI.getSessionDetail(sessionId)

    const records = response.data || []
    messageList.value = records.map(record => ({
      id: record.id,
      type: record.type,
      reqText: record.reqText,
      respText: record.respText,
      createTime: record.createTime
    }))

    currentSessionId.value = sessionId
    showHistoryList.value = false
    scrollToBottom()
  } catch (error) {
    console.error('加载会话详情失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 删除单个会话
const deleteSession = async (sessionId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个会话吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await aiAPI.deleteSession(sessionId)
    ElMessage.success('删除成功')
    loadHistoryList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除会话失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 删除某天所有会话
const deleteDaySessions = async (day) => {
  try {
    await ElMessageBox.confirm(`确定要删除${day}的所有会话吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await aiAPI.deleteDaySessions(day)
    ElMessage.success('删除成功')
    loadHistoryList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除会话失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 新建对话
const startNewConversation = () => {
  messageList.value = []
  currentSessionId.value = null
  currentAiText.value = ''
  showHistoryList.value = false
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.ai-page {
  display: flex;
  height: calc(100vh - 60px);
  background: #f7f7f8;
}

/* 侧边栏 */
.sidebar {
  width: 260px;
  background: #202123;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 12px;
}

.new-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.new-chat-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.sidebar-content {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.section-title:hover {
  background: rgba(255, 255, 255, 0.1);
}

.section-title .arrow {
  margin-left: auto;
  font-size: 12px;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.model-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.model-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.model-text {
  display: flex;
  flex-direction: column;
}

.model-name {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.model-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

/* 欢迎界面 */
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
}

.welcome-logo {
  margin-bottom: 24px;
}

.logo-circle {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.logo-circle span {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.welcome-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 480px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 24px;
}

.feature-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 消息项 */
.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-item.user .message-avatar {
  background: linear-gradient(135deg, #409eff 0%, #53a8ff 100%);
  color: #fff;
}

.message-item.ai .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.message-body {
  max-width: 75%;
  min-width: 0;
}

.message-content {
  padding: 14px 18px;
  border-radius: 16px;
  line-height: 1.6;
}

.message-item.user .message-content {
  background: linear-gradient(135deg, #409eff 0%, #53a8ff 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-item.ai .message-content {
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

/* 打字光标 */
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #667eea;
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 加载状态 */
.loading-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.loading-text {
  font-size: 14px;
  color: #999;
}

/* 输入区域 */
.input-area {
  padding: 16px 20px 20px;
  background: #f7f7f8;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #fff;
  border-radius: 16px;
  padding: 8px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.input-textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.5;
  max-height: 120px;
  font-family: inherit;
  background: transparent;
}

.input-textarea::placeholder {
  color: #999;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #e0e0e0;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 18px;
}

.send-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.send-btn.active:hover {
  transform: scale(1.05);
}

.send-btn:disabled {
  cursor: not-allowed;
}

.input-hint {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .ai-page {
    height: calc(100vh - 56px);
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }

  .message-body {
    max-width: 85%;
  }

  .welcome-container {
    padding: 20px;
  }

  .welcome-title {
    font-size: 20px;
  }
}
</style>