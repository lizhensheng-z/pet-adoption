<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// 自定义渲染器
const renderer = new marked.Renderer()

// 自定义代码块渲染
renderer.code = function(code, language) {
  const lang = language || 'plaintext'
  let highlighted = code

  try {
    if (hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(code, { language: lang }).value
    } else {
      highlighted = hljs.highlightAuto(code).value
    }
  } catch (e) {
    highlighted = escapeHtml(code)
  }

  return `<div class="code-block">
    <div class="code-header">
      <span class="code-lang">${lang}</span>
    </div>
    <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
  </div>`
}

// 自定义链接渲染
renderer.link = function(href, title, text) {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
  return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
}

// 自定义列表项渲染（添加更好的样式）
renderer.listitem = function(text, task, checked) {
  if (task) {
    return `<li class="task-item">${text}</li>`
  }
  return `<li>${text}</li>`
}

// 配置marked
marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

// HTML转义
const escapeHtml = (text) => {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}

// 渲染后的内容
const renderedContent = computed(() => {
  if (!props.content) return ''
  try {
    const html = marked.parse(props.content)
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'rel', 'class'],
      ADD_TAGS: ['div', 'span', 'pre', 'code']
    })
  } catch (e) {
    console.error('Markdown渲染失败:', e)
    return escapeHtml(props.content)
  }
})
</script>

<style>
.markdown-body {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

/* 标题样式 */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin: 20px 0 12px;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
  position: relative;
}

.markdown-body h1:first-child,
.markdown-body h2:first-child,
.markdown-body h3:first-child {
  margin-top: 0;
}

.markdown-body h1 {
  font-size: 1.35em;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.markdown-body h2 {
  font-size: 1.2em;
  padding-left: 12px;
  border-left: 4px solid #667eea;
}

.markdown-body h3 {
  font-size: 1.1em;
  color: #444;
}

.markdown-body h4 { font-size: 1em; }

/* 段落 */
.markdown-body p {
  margin: 12px 0;
}

.markdown-body p:first-child {
  margin-top: 0;
}

.markdown-body p:last-child {
  margin-bottom: 0;
}

/* 强调 */
.markdown-body strong {
  font-weight: 600;
  color: #1a1a1a;
  background: linear-gradient(180deg, transparent 60%, rgba(102, 126, 234, 0.15) 60%);
}

.markdown-body em {
  font-style: italic;
  color: #555;
}

/* 链接 */
.markdown-body a {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px dashed #667eea;
  transition: all 0.2s;
}

.markdown-body a:hover {
  color: #764ba2;
  border-bottom-style: solid;
}

/* 列表样式 */
.markdown-body ul,
.markdown-body ol {
  margin: 12px 0;
  padding-left: 0;
  list-style: none;
}

.markdown-body ul {
  counter-reset: ul-item;
}

.markdown-body ul > li {
  position: relative;
  padding-left: 24px;
  margin: 8px 0;
}

.markdown-body ul > li::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 10px;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
}

.markdown-body ol {
  counter-reset: ol-item;
}

.markdown-body ol > li {
  position: relative;
  padding-left: 28px;
  margin: 8px 0;
  counter-increment: ol-item;
}

.markdown-body ol > li::before {
  content: counter(ol-item);
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.markdown-body li > ul,
.markdown-body li > ol {
  margin: 4px 0;
}

/* 引用块 */
.markdown-body blockquote {
  margin: 16px 0;
  padding: 12px 16px;
  border-left: 4px solid #667eea;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.03) 100%);
  color: #555;
  border-radius: 0 10px 10px 0;
}

.markdown-body blockquote p {
  margin: 0;
}

/* 行内代码 */
.markdown-body code:not([class*="language-"]):not(.hljs) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.88em;
  color: #667eea;
  font-weight: 500;
}

/* 代码块 */
.markdown-body .code-block {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #1e1e2e;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.markdown-body .code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #2d2d3f;
  border-bottom: 1px solid #3d3d4f;
}

.markdown-body .code-lang {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.markdown-body .code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.markdown-body .code-block code {
  font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  background: transparent !important;
  padding: 0 !important;
}

/* 表格 */
.markdown-body table {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
  font-size: 13px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.markdown-body th,
.markdown-body td {
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  text-align: left;
}

.markdown-body th {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-weight: 600;
}

.markdown-body tr:nth-child(even) {
  background: #fafafa;
}

.markdown-body tr:hover {
  background: #f5f5f7;
}

/* 分割线 */
.markdown-body hr {
  margin: 20px 0;
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e0e0e0 20%, #e0e0e0 80%, transparent);
}

/* 图片 */
.markdown-body img {
  max-width: 100%;
  border-radius: 10px;
  margin: 12px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 删除线 */
.markdown-body del {
  color: #999;
  text-decoration: line-through;
}

/* 任务列表 */
.markdown-body .task-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.markdown-body .task-item input {
  margin-top: 4px;
  accent-color: #667eea;
}

/* 嵌套列表缩进 */
.markdown-body ul ul,
.markdown-body ol ol,
.markdown-body ul ol,
.markdown-body ol ul {
  margin-left: 8px;
}
</style>