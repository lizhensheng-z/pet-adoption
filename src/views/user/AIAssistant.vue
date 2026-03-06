<template>
  <PageHeader title="AI小助手" :show-breadcrumb="false">
    <template #actions>
      <el-button @click="startNewConversation" text>
        <el-icon><Plus /></el-icon>
        新建对话
      </el-button>
      <el-button @click="loadHistoryList" text>
        <el-icon><Clock /></el-icon>
        历史记录
      </el-button>
    </template>
  </PageHeader>

  <div class="ai-assistant-container">
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
    <div v-else class="chat-container">
      <!-- 消息列表 -->
      <div ref="messageContainerRef" class="message-list">
        <!-- 欢迎消息 -->
        <div v-if="showWelcome" class="welcome-section">
          <div class="welcome-icon">🤖</div>
          <div class="welcome-text">你好!我是AI小助手,有什么可以帮助你的吗?</div>
        </div>

<!-- 消息列表 -->
    <div
    v-for="message in messageList"
    :key="message.id"
    :class="[
        'message-item',
        message.type === 1 ? 'user' : 'ai',
        // ✅ 最后一条AI消息且正在生成时，加上generating类显示光标
        message.type === 2 && isGenerating && message.id === messageList[messageList.length - 1]?.id
        ? 'generating'
        : ''
    ]"
    >
    <div class="message-content">
        <div v-if="message.type === 1" class="message-text">{{ message.reqText }}</div>
        <div v-else class="message-text">{{ message.respText }}</div>
    </div>
    </div>


        <!-- 加载状态：只在AI消息为空时显示 -->
        <div v-if="isGenerating && currentAiText === ''" class="loading-message">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>AI正在思考...</span>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <el-input
          v-model="currentInput"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="isGenerating"
          class="input-field"
        >
          <template #append>
            <el-button
              type="primary"
              @click="sendMessage"
              :disabled="!canSend"
              :loading="isGenerating"
            >
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Clock, Loading } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import HistoryList from './components/HistoryList.vue'
import { useAuthStore } from '@/stores/auth.js'
import * as aiAPI from '@/api/modules/ai.js'

const authStore = useAuthStore()

// 对话消息列表
const messageList = ref([])

// 当前输入
const currentInput = ref('')

// 是否正在生成回复
const isGenerating = ref(false)

// 当前AI正在生成的文本（用于判断加载状态显示）
const currentAiText = ref('')

// 当前会话ID
const currentSessionId = ref(null)

// 是否显示历史列表
const showHistoryList = ref(false)

// 历史会话列表(按天分组)
const historyList = ref([])

// 加载状态
const loading = ref(false)

// 消息容器引用
const messageContainerRef = ref(null)

// 查询天数(默认7天,最大30天)
const queryDays = ref(7)

// 是否可以发送消息
const canSend = computed(() => {
  return currentInput.value.trim() && !isGenerating.value
})

// 是否显示欢迎消息
const showWelcome = computed(() => {
  return messageList.value.length === 0
})

// 发送消息(流式响应)
const sendMessage = async () => {
  if (!canSend.value) return

  const userMessage = currentInput.value.trim()
  currentInput.value = ''

  // 添加用户消息
  messageList.value.push({
    id: Date.now(),
    type: 1,
    reqText: userMessage,
    createTime: new Date().toISOString()
  })
  scrollToBottom()

  // 添加AI消息占位，记录其索引
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
    
    // ✅ 缓冲区：解决chunk被截断导致的数据丢失问题
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // 追加到缓冲区，stream:true表示可能还有后续数据
      buffer += decoder.decode(value, { stream: true })

      // 按换行分割，最后一个可能不完整，保留到下次
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        if (trimmed.startsWith('data:')) {
          const data = trimmed.substring(5).trim()

          if (data && data !== '[DONE]') {
            // ✅ 通过索引替换整个对象，触发Vue3响应式更新
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

    // 处理缓冲区中剩余的数据
    if (buffer.trim().startsWith('data:')) {
      const data = buffer.trim().substring(5).trim()
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
    // 移除失败的AI消息占位
    messageList.value.splice(aiIndex, 1)
  } finally {
    isGenerating.value = false
    currentAiText.value = ''
    scrollToBottom()
  }
}

// 加载历史会话列表(按天分组)
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
.ai-assistant-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.welcome-text {
  font-size: 18px;
  color: #666;
  text-align: center;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
}

.message-item.user {
  justify-content: flex-end;
}

.message-item.ai {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-item.user .message-content {
  background: #409eff;
  color: white;
}

.message-item.ai .message-content {
  background: white;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message-text {
  line-height: 1.6;
}

/* AI消息生成中的光标闪烁效果 */
.message-item.ai .message-text::after {
  content: '';
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #409eff;
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
  opacity: 0;
}

/* 只在生成中显示光标 */
.message-item.ai.generating .message-text::after {
  opacity: 1;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #999;
  font-size: 14px;
}

.input-area {
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
}

.input-field {
  width: 100%;
}

@media (max-width: 768px) {
  .ai-assistant-container {
    padding: 10px;
    height: calc(100vh - 140px);
  }

  .message-content {
    max-width: 85%;
  }

  .welcome-icon {
    font-size: 48px;
  }

  .welcome-text {
    font-size: 16px;
  }
}
</style>

