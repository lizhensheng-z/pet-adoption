# AI小助手功能开发规划

> **创建时间**: 2026-03-03
> **功能模块**: AI对话助手
> **路由**: `/ai-assistant`
> **目标用户**: 所有用户
> **后端对接文档**: AI聊天功能前后端对接文档.md

---

## 📋 目录

1. [页面功能概述](#页面功能概述)
2. [数据库模型分析](#数据库模型分析)
3. [功能需求分析](#功能需求分析)
4. [页面功能设计](#页面功能设计)
5. [接口详细设计](#接口详细设计)
6. [开发任务分解](#开发任务分解)
7. [技术实现要点](#技术实现要点)

---

## 1. 页面功能概述

### 1.1 页面定位
AI小助手是宠物领养平台的智能对话功能,基于DeepSeek AI提供智能问答服务。支持实时对话、历史记录查看、会话管理等功能,并优先匹配本地问题模板以提升响应速度。

### 1.2 核心功能模块

| 模块 | 功能描述 | 权限要求 |
|------|---------|---------|
| **AI对话** | 与AI助手进行实时对话(流式响应) | 需登录 |
| **历史记录** | 按天分组查看历史对话记录 | 需要登录 |
| **会话详情** | 查看单个会话的完整对话内容 | 需要登录 |
| **会话管理** | 删除单个会话或某天所有会话 | 需要登录 |
| **新建对话** | 开始新的对话会话 | 无需登录 |

### 1.3 页面布局设计

#### 1.3.1 主对话页面布局
```
┌─────────────────────────────────────────┐
│  顶部导航栏 (AppHeader)                  │
├─────────────────────────────────────────┤
│  页面标题栏 (PageHeader)                 │
│  标题: AI小助手                          │
│  操作: [新建对话] [历史记录]             │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │  对话消息区域                      │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ AI消息 (左侧)               │  │  │
│  │  │ 你好!我是AI小助手...         │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 用户消息 (右侧)             │  │  │
│  │  │ 你好,我想咨询宠物领养       │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ...                              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  输入区域                          │  │
│  │  ┌─────────────┬───────────────┐  │  │
│  │  │ 输入框       │ [发送] 按钮   │  │  │
│  │  └─────────────┴───────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 1.3.2 历史记录页面布局(按天分组)
```
┌─────────────────────────────────────────┐
│  顶部导航栏 (AppHeader)                  │
├─────────────────────────────────────────┤
│  页面标题栏 (PageHeader)                 │
│  标题: 历史记录                          │
│  操作: [返回]                            │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │  2025-12-11                        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 抓到出轨证据就稳赢?          │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  2025-12-10                        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 他是谁                       │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  2025-12-08                        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ 他婚前买的房,装修你          │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 2. 数据库模型分析

### 2.1 核心数据表

#### 2.1.1 ai_session（用户会话表）

| 字段 | 类型 | 说明 | 前端用途 |
|------|------|------|---------|
| session_id | BIGINT | 主键ID | 会话唯一标识 |
| title | VARCHAR(255) | 会话标题 | 历史列表显示(取前10个字符) |
| if_delete | TINYINT(1) | 是否删除(0否 1是) | 软删除标记 |
| create_time | DATETIME | 创建时间 | 创建时间显示 |
| create_by | BIGINT | 创建人 | 用户ID |
| modify_time | DATETIME | 修改时间 | 最后更新时间 |
| modify_by | BIGINT | 修改人 | 修改人ID |

#### 2.1.2 ai_question_record（用户提问记录表）

| 字段 | 类型 | 说明 | 前端用途 |
|------|------|------|---------|
| id | BIGINT | 主键ID | 记录唯一标识 |
| user_id | BIGINT | 用户ID | 关联用户 |
| type | TINYINT | 类型(1问题 2回复) | 区分问题和回答 |
| session_id | BIGINT | 用户会话id | 关联会话 |
| question_id | BIGINT | 用户问题id(系统) | 回复关联的问题ID |
| response_id | VARCHAR(64) | deepseek回复id(外部) | AI回复标识 |
| req_text | TEXT | 请求原文 | 用户问题内容 |
| resp_text | TEXT | 回复文本-原文 | AI回复内容 |
| tokens_used | INT | tokens使用量 | Token统计 |
| status | TINYINT | 状态(0失败 1成功 2中断) | 问答状态 |
| req_param | MEDIUMTEXT | 请求体 | 请求参数 |
| resp_result | MEDIUMTEXT | 响应体 | 响应结果 |
| if_delete | TINYINT(1) | 是否删除(0否 1是) | 软删除标记 |
| create_time | DATETIME | 创建时间 | 创建时间显示 |
| create_by | BIGINT | 创建人 | 创建人ID |
| modify_time | DATETIME | 修改时间 | 修改时间 |
| modify_by | BIGINT | 修改人 | 修改人ID |

#### 2.1.3 ai_question_template（系统问题模板表）

| 字段 | 类型 | 说明 | 前端用途 |
|------|------|------|---------|
| id | BIGINT | 主键ID | 模板唯一标识 |
| question | TEXT | 问题内容 | 问题模板 |
| answer | TEXT | 答案内容 | 模板答案 |
| sort_no | INT | 排序号 | 排序依据 |
| type | TINYINT | 类型(1问题模板 2免责声明) | 模板类型 |
| if_delete | TINYINT(1) | 是否删除(0否 1是) | 软删除标记 |
| create_time | DATETIME | 创建时间 | 创建时间 |
| create_by | BIGINT | 创建人 | 创建人ID |
| modify_time | DATETIME | 修改时间 | 修改时间 |
| modify_by | BIGINT | 修改人 | 修改人ID |

### 2.2 数据关系说明

```
用户(user_id) 1:N 会话(session_id)
会话(session_id) 1:N 提问记录(ai_question_record)
问题记录(question_id) 1:1 回复记录(type=2, question_id关联)
```

---

## 3. 功能需求分析

### 3.1 核心功能流程

#### 3.1.1 AI对话流程
```
用户输入问题
    ↓
前端发送请求(GET /ai/deepseek/chatCompletions)
    ↓
后端创建会话记录(标题取前10个字符)
    ↓
查询本地问题模板库
    ↓
┌─命中模板→ 直接返回模板答案
│
└─未命中模板→ 调用DeepSeek AI接口
                  ↓
            流式返回AI答案(Server-Sent Events)
                  ↓
            前端实时显示回复
                  ↓
            保存问答记录到数据库
```

#### 3.1.2 历史记录查看流程
```
用户点击"历史记录"
    ↓
判断登录状态
    ↓
已登录: 调用GET /ai/session/listGroupByDay
未登录: 提示登录
    ↓
显示按天分组的历史记录
    ↓
点击某个会话
    ↓
调用POST /ai/session/detail
    ↓
显示完整对话内容
```

#### 3.1.3 会话删除流程
```
用户点击删除按钮
    ↓
确认删除操作
    ↓
┌─删除单个会话→ POST /ai/session/delete
│
└─删除某天所有会话→ POST /ai/session/delete/day
    ↓
刷新历史列表
```

---

## 4. 页面功能设计

### 4.1 响应式数据定义

```typescript
// 对话消息列表
const messageList = ref([])

// 当前输入
const currentInput = ref('')

// 是否正在生成回复
const isGenerating = ref(false)

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
```

### 4.2 消息数据结构

```typescript
// 消息对象结构
interface Message {
  id: number              // 记录ID
  userId: number         // 用户ID
  type: 1 | 2           // 1-问题, 2-回复
  sessionId: number     // 会话ID
  questionId: number    // 问题ID(回复记录中)
  reqText: string       // 请求文本(问题内容)
  respText: string      // 回复文本(AI回答)
  createTime: string    // 创建时间
  createBy: number      // 创建人ID
}

// 会话对象结构
interface Session {
  sessionId: number     // 会话ID
  title: string        // 会话标题
  ifDelete: boolean    // 是否已删除
  createTime: string   // 创建时间
  createBy: number     // 创建人ID
  modifyTime: string   // 修改时间
  modifyBy: number     // 修改人ID
}

// 按天分组的会话结构
interface DayGroup {
  day: string          // 日期(yyyy-MM-dd)
  sessions: Session[]  // 当天会话列表
}
```

### 4.3 计算属性

```typescript
// 是否可以发送消息
const canSend = computed(() => {
  return currentInput.value.trim() && !isGenerating.value
})

// 是否显示欢迎消息
const showWelcome = computed(() => {
  return messageList.value.length === 0
})
```

### 4.4 核心方法

```typescript
// 发送消息(流式响应)
const sendMessage = async () => {
  if (!canSend.value) return

  const userMessage = currentInput.value.trim()
  currentInput.value = ''

  // 添加用户消息到列表
  messageList.value.push({
    id: Date.now(),
    type: 1,
    reqText: userMessage,
    createTime: new Date().toISOString()
  })

  scrollToBottom()

  try {
    isGenerating.value = true

    // 创建AI消息占位
    const aiMessage = {
      id: Date.now() + 1,
      type: 2,
      respText: '',
      createTime: new Date().toISOString()
    }
    messageList.value.push(aiMessage)

    // 调用AI接口(流式响应)
    const response = await fetch(
      `/api/ai/deepseek/chatCompletions?content=${encodeURIComponent(userMessage)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${getToken()}`
        }
      }
    )

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    // 读取流式响应
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim()
          if (data) {
            aiMessage.respText += data
            scrollToBottom()
          }
        }
      }
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送失败,请重试')
  } finally {
    isGenerating.value = false
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
    historyList.value = response.data
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
    
    // 转换消息格式
    messageList.value = response.data.map(record => ({
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
```

---

## 5. 接口详细设计

### 5.1 AI聊天问答-流式响应

#### 接口信息
- **路径**: `GET /ai/deepseek/chatCompletions`
- **权限**: 无需认证(登录用户会保存历史)
- **说明**: 与AI进行智能对话,支持流式响应,优先匹配本地问题模板

#### 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| content | String | 是 | 用户提问内容 |

#### 请求示例
```
GET /ai/deepseek/chatCompletions?content=你好,请介绍一下宠物领养流程
```

#### 响应格式
`text/event-stream;charset=utf-8` (Server-Sent Events)

#### 响应示例
```
event: message
data: 您好!宠物领养流程一般包括以下几个步骤:

event: message
data: 1. 选择心仪的宠物

event: message
data: 2. 提交领养申请

event: message
data: 3. 等待审核

event: message
data: 4. 审核通过后签订领养协议

event: message
data: 5. 完成领养
```

#### 业务逻辑说明
1. 接收用户提问后,自动创建会话记录(标题取前10个字符)
2. 优先查询本地问题模板库,如有匹配则直接返回模板答案
3. 未命中模板则调用DeepSeek AI接口,返回流式响应
4. 所有问答记录都会保存到数据库

---

### 5.2 按天分组获取会话列表

#### 接口信息
- **路径**: `GET /ai/session/listGroupByDay`
- **权限**: 需要认证
- **说明**: 获取最近N天的会话列表,按天分组展示

#### 请求参数
| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| days | Integer | 否 | 7 | 查询最近天数(最大30天) |

#### 请求示例
```
GET /ai/session/listGroupByDay?days=7
```

#### 响应数据
```json
{
  "code": 10000,
  "message": "success",
  "data": [
    {
      "day": "2025-12-11",
      "sessions": [
        {
          "sessionId": 1001,
          "title": "抓到出轨证据就稳赢?",
          "ifDelete": false,
          "createTime": "2025-12-11 10:30:00",
          "createBy": 123,
          "modifyTime": "2025-12-11 10:30:00",
          "modifyBy": 123
        }
      ]
    },
    {
      "day": "2025-12-10",
      "sessions": [
        {
          "sessionId": 1002,
          "title": "他是谁",
          "ifDelete": false,
          "createTime": "2025-12-10 14:20:00",
          "createBy": 123,
          "modifyTime": "2025-12-10 14:20:00",
          "modifyBy": 123
        }
      ]
    }
  ]
}
```

---

### 5.3 获取会话详情

#### 接口信息
- **路径**: `POST /ai/session/detail`
- **权限**: 需要认证
- **说明**: 获取指定会话的详细问答记录

#### 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| sessionId | Long | 是 | 会话ID |

#### 请求示例
```
POST /ai/session/detail?sessionId=1001
```

#### 响应数据
```json
{
  "code": 10000,
  "message": "success",
  "data": [
    {
      "id": 2001,
      "userId": 123,
      "type": 1,
      "sessionId": 1001,
      "questionId": null,
      "reqText": "宠物领养需要什么条件?",
      "respText": null,
      "createBy": 123,
      "createTime": "2025-12-11 10:30:00"
    },
    {
      "id": 2002,
      "userId": 123,
      "type": 2,
      "sessionId": 1001,
      "questionId": 2001,
      "reqText": null,
      "respText": "您好!宠物领养一般需要满足以下条件:\n1. 年满18周岁\n2. 有稳定的住所\n3. 有经济能力\n4. 家庭成员同意",
      "createBy": 123,
      "createTime": "2025-12-11 10:30:05"
    }
  ]
}
```

---

### 5.4 删除会话

#### 接口信息
- **路径**: `POST /ai/session/delete`
- **权限**: 需要认证
- **说明**: 删除指定会话(逻辑删除)

#### 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| sessionId | Long | 是 | 会话ID |

#### 请求示例
```
POST /ai/session/delete?sessionId=1001
```

#### 响应数据
```json
{
  "code": 10000,
  "message": "success",
  "data": null
}
```

---

### 5.5 删除某天所有会话

#### 接口信息
- **路径**: `POST /ai/session/delete/day`
- **权限**: 需要认证
- **说明**: 删除指定日期的所有会话(逻辑删除)

#### 请求参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| date | Date | 是 | 日期 |

#### 请求示例
```
POST /ai/session/delete/day?date=2025-12-11
```

#### 响应数据
```json
{
  "code": 10000,
  "message": "success",
  "data": null
}
```

---

### 5.6 获取账户余额

#### 接口信息
- **路径**: `GET /ai/deepseek/account/balance`
- **权限**: 需要认证
- **说明**: 获取DeepSeek账户余额信息

#### 响应数据
```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "available": true,
    "totalBalance": 100.50,
    "grantedBalance": 50.00,
    "toppedUpBalance": 50.50
  }
}
```

---

## 6. 开发任务分解

### 6.1 Phase 1: AI对话功能(核心)

#### Task 1.1: API 接口封装
- [ ] 创建 `src/api/modules/ai.js` 文件
- [ ] 封装 `chatCompletions` 方法(流式响应)
- [ ] 封装 `getSessionListGroupByDay` 方法
- [ ] 封装 `getSessionDetail` 方法
- [ ] 封装 `deleteSession` 方法
- [ ] 封装 `deleteDaySessions` 方法
- [ ] 添加JSDoc注释

#### Task 1.2: 主对话页面开发
- [ ] 创建 `AIAssistant.vue` 页面组件
- [ ] 实现消息列表展示
- [ ] 实现流式消息接收
- [ ] 实现消息输入区域
- [ ] 实现发送消息功能
- [ ] 实现消息自动滚动

#### Task 1.3: 样式开发
- [ ] 实现消息气泡样式
- [ ] 实现用户消息样式(右侧,蓝色)
- [ ] 实现AI消息样式(左侧,灰色)
- [ ] 实现输入区域样式
- [ ] 实现响应式布局

---

### 6.2 Phase 2: 历史记录功能

#### Task 2.1: 历史列表组件开发
- [ ] 创建 `HistoryList.vue` 组件
- [ ] 实现按天分组展示
- [ ] 实现会话项展示
- [ ] 实现加载状态
- [ ] 实现空状态

#### Task 2.2: 会话详情功能
- [ ] 实现点击会话查看详情
- [ ] 实现消息列表渲染
- [ ] 实现返回按钮

#### Task 2.3: 会话管理功能
- [ ] 实现删除单个会话
- [ ] 实现删除某天所有会话
- [ ] 实现确认对话框

#### Task 2.4: 样式开发
- [ ] 实现按天分组样式
- [ ] 实现会话项样式
- [ ] 实现删除按钮样式

---

### 6.3 Phase 3: 导航集成

#### Task 3.1: 底部导航栏修改
- [ ] 在 `AppTabbar.vue` 添加"AI助手"导航项
- [ ] 导入 `ChatDotRound` 图标
- [ ] 调整导航项位置(首页、宠物、AI助手、收藏、我的)
- [ ] 测试导航跳转

#### Task 3.2: 路由配置
- [ ] 在 `router/user.js` 添加AI助手路由
- [ ] 配置路由meta信息
- [ ] 测试路由跳转

---

### 6.4 Phase 4: 优化与测试

#### Task 4.1: 用户体验优化
- [ ] 实现消息加载状态
- [ ] 优化流式输出体验
- [ ] 添加错误重试机制
- [ ] 实现登录状态提示

#### Task 4.2: 性能优化
- [ ] 实现消息虚拟滚动(长对话)
- [ ] 优化接口响应速度
- [ ] 实现本地缓存

#### Task 4.3: 错误处理
- [ ] 实现统一错误处理
- [ ] 实现错误码提示
- [ ] 实现网络异常处理

#### Task 4.4: 测试
- [ ] 单元测试
- [ ] 接口测试
- [ ] 端到端测试
- [ ] 兼容性测试

---

## 7. 技术实现要点

### 7.1 API 接口封装

#### 文件位置
`src/api/modules/ai.js`

#### 接口方法
```javascript
import http from '@/api/request.js'
import { getToken } from '@/utils/auth.js'

/**
 * AI聊天问答(流式响应)
 * @param {string} content - 用户提问内容
 * @returns {Promise<Response>} - 返回流式响应
 */
export function chatCompletions(content) {
  return fetch(
    `/api/ai/deepseek/chatCompletions?content=${encodeURIComponent(content)}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${getToken()}`
      }
    }
  )
}

/**
 * 按天分组获取会话列表
 * @param {number} days - 查询最近天数(默认7天,最大30天)
 * @returns {Promise} 会话列表
 */
export function getSessionListGroupByDay(days = 7) {
  return http.get('/ai/session/listGroupByDay', { days })
}

/**
 * 获取会话详情
 * @param {number} sessionId - 会话ID
 * @returns {Promise} 会话详情
 */
export function getSessionDetail(sessionId) {
  return http.post('/ai/session/detail', null, { params: { sessionId } })
}

/**
 * 删除会话
 * @param {number} sessionId - 会话ID
 * @returns {Promise} 删除结果
 */
export function deleteSession(sessionId) {
  return http.post('/ai/session/delete', null, { params: { sessionId } })
}

/**
 * 删除某天所有会话
 * @param {string} date - 日期(yyyy-MM-dd)
 * @returns {Promise} 删除结果
 */
export function deleteDaySessions(date) {
  return http.post('/ai/session/delete/day', null, { params: { date } })
}

/**
 * 获取账户余额
 * @returns {Promise} 余额信息
 */
export function getBalance() {
  return http.get('/ai/deepseek/account/balance')
}
```

---

### 7.2 主页面组件结构

#### AIAssistant.vue 完整结构
```vue
<template>
  <AppLayout>
    <PageHeader title="AI小助手">
      <template #actions>
        <el-button @click="startNewConversation" text>
          新建对话
        </el-button>
        <el-button @click="loadHistoryList" text>
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
            <div class="welcome-text">你好!我是AI小助手,有什么可以帮助你的吗?</div>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="message in messageList"
            :key="message.id"
            :class="['message-item', message.type === 1 ? 'user' : 'ai']"
          >
            <div class="message-content">
              {{ message.type === 1 ? message.reqText : message.respText }}
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="isGenerating" class="loading-message">
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
  </AppLayout>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import HistoryList from './components/HistoryList.vue'
import { useAuthStore } from '@/stores/auth.js'
import * as aiAPI from '@/api/modules/ai.js'

// ... 实现代码
</script>

<style scoped>
/* 样式实现 */
</style>
```

---

### 7.3 历史列表组件

#### HistoryList.vue 组件结构
```vue
<template>
  <div class="history-list-container">
    <!-- 返回按钮 -->
    <div class="header">
      <el-button @click="$emit('back')" text>
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- 空状态 -->
    <div v-else-if="list.length === 0" class="empty-state">
      暂无历史记录
    </div>

    <!-- 按天分组的会话列表 -->
    <div v-else class="day-groups">
      <div
        v-for="dayGroup in list"
        :key="dayGroup.day"
        class="day-group"
      >
        <!-- 日期标题 -->
        <div class="day-header">
          <span>{{ dayGroup.day }}</span>
        </div>

        <!-- 会话列表 -->
        <div
          v-for="session in dayGroup.sessions"
          :key="session.sessionId"
          class="session-item"
          @click="$emit('select', session.sessionId)"
        >
          <div class="session-title">{{ session.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Loading } from '@element-plus/icons-vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'delete', 'delete-day', 'back'])
</script>

<style scoped>
.history-list-container {
  padding: 16px;
}

.day-group {
  margin-bottom: 24px;
}

.day-header {
  padding: 12px 0;
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.session-item {
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.session-item:hover {
  background: #f5f5f5;
}

.session-title {
  font-size: 14px;
  color: #333;
}
</style>
```

---

### 7.4 底部导航栏修改

#### AppTabbar.vue 修改
```vue
<script setup>
import {
  House, List, ChatDotRound, Star, DocumentCopy, User
} from '@element-plus/icons-vue'

const tabItems = computed(() => {
  const baseItems = [
    { path: '/home', name: '首页', icon: House },
    { path: '/pets', name: '宠物', icon: List },
    { path: '/ai-assistant', name: 'AI助手', icon: ChatDotRound }, // 新增
  ]

  const userItems = [
    { path: '/favorites', name: '收藏', icon: Star },
    { path: '/applications', name: '申请', icon: DocumentCopy },
    { path: '/profile', name: '我的', icon: User }
  ]

  if (authStore.isLoggedIn) {
    return [...baseItems, ...userItems]
  } else {
    return [
      ...baseItems,
      { path: '/login', name: '登录', icon: User }
    ]
  }
})
</script>
```

---

### 7.5 流式响应处理要点

#### 前端流式读取实现
```javascript
// 使用原生fetch API处理流式响应
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'text/event-stream',
    'Authorization': `Bearer ${getToken()}`
  }
})

const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  const lines = chunk.split('\n')

  for (const line of lines) {
    if (line.startsWith('data:')) {
      const data = line.substring(5).trim()
      if (data) {
        // 处理流式数据
        aiMessage.respText += data
      }
    }
  }
}
```

#### 注意事项
1. 不能使用axios等普通HTTP库处理流式响应
2. 需要使用原生fetch API或EventSource
3. 响应格式为`text/event-stream;charset=utf-8`
4. 数据格式为Server-Sent Events(SSE)

---

### 7.6 错误处理

#### 统一错误处理
```javascript
// 错误码定义
const ERROR_CODES = {
  40001: '参数错误',
  40002: '会话不存在',
  40003: 'AI服务异常,请稍后重试',
  40004: '账户余额不足,请联系管理员',
  50000: '系统异常,请稍后重试'
}

// 错误处理函数
const handleError = (code) => {
  const message = ERROR_CODES[code] || '请求失败'
  ElMessage.error(message)
}
```

---

## 8. 总结

### 8.1 开发优先级

| 优先级 | 功能模块 | 说明 |
|--------|---------|------|
| P0 | AI对话功能(流式响应) | 核心功能,必须优先实现 |
| P0 | 底部导航栏集成 | 核心功能,必须优先实现 |
| P1 | 历史记录列表(按天分组) | 重要功能,优先实现 |
| P1 | 会话详情查看 | 重要功能,优先实现 |
| P2 | 会话删除功能 | 优化体验,可延后实现 |
| P3 | 账户余额查询 | 辅助功能,可选实现 |

### 8.2 技术风险

| 风险项 | 风险等级 | 解决方案 |
|--------|---------|---------|
| 流式响应处理 | 中 | 使用原生fetch API,正确解析SSE格式 |
| AI接口响应慢 | 中 | 显示加载状态,优化用户体验 |
| 长对话性能问题 | 中 | 实现虚拟滚动,分页加载 |
| 游客用户数据丢失 | 低 | 提示登录以保存历史记录 |
| 账户余额不足 | 低 | 实现余额查询,及时提醒 |

### 8.3 后续优化方向

1. **问题模板管理**: 添加更多常用问题模板
2. **消息复制**: 支持复制AI回复内容
3. **语音输入**: 支持语音转文字输入
4. **语音播放**: AI回复语音播放
5. **对话导出**: 导出对话记录
6. **智能推荐**: 基于用户行为推荐问题

---

**文档版本**: v2.0
**最后更新**: 2026-03-03
**负责人**: 开发团队
**参考文档**: AI聊天功能前后端对接文档.md