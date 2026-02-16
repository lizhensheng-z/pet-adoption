import { defineStore } from 'pinia'
import { tagApi } from '@/api/modules/admin.js'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tagList: [],
    total: 0,
    loading: false,
    currentPage: 1,
    pageSize: 10,
    searchParams: {
      name: '',
      tagType: '',
      enabled: ''
    }
  }),

  getters: {
    enabledTags: (state) => state.tagList.filter(tag => tag.enabled === 1),
    
    tagsByType: (state) => {
      const groups = {}
      state.tagList.forEach(tag => {
        if (!groups[tag.tagType]) {
          groups[tag.tagType] = []
        }
        groups[tag.tagType].push(tag)
      })
      return groups
    }
  },

  actions: {
    async fetchTagList(params = {}) {
      this.loading = true
      try {
        const queryParams = {
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.searchParams,
          ...params
        }
        
        // 移除空值参数
        Object.keys(queryParams).forEach(key => {
          if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
            delete queryParams[key]
          }
        })

        console.log('调用标签列表API，参数:', queryParams)
        const res = await tagApi.getTagList(queryParams)
        console.log('标签列表API返回:', res)
        
        if (res.code === 10000) {
          this.tagList = res.data.list
          this.total = res.data.total
        }
        return res
      } catch (error) {
        console.error('获取标签列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTag(data) {
      try {
        const res = await tagApi.createTag(data)
        if (res.code === 10000) {
          // 创建成功后刷新列表
          await this.fetchTagList()
        }
        return res
      } catch (error) {
        console.error('创建标签失败:', error)
        throw error
      }
    },

    async updateTag(id, data) {
      try {
        const res = await tagApi.updateTag(id, data)
        if (res.code === 10000) {
          // 更新成功后刷新列表
          await this.fetchTagList()
        }
        return res
      } catch (error) {
        console.error('更新标签失败:', error)
        throw error
      }
    },

    async deleteTag(id) {
      try {
        const res = await tagApi.deleteTag(id)
        if (res.code === 10000) {
          // 删除成功后刷新列表
          await this.fetchTagList()
        }
        return res
      } catch (error) {
        console.error('删除标签失败:', error)
        throw error
      }
    },

    async toggleTagStatus(id, enabled) {
      try {
        const res = await tagApi.toggleTagStatus(id, enabled)
        if (res.code === 10000) {
          // 更新本地数据，避免重新请求
          const tag = this.tagList.find(t => t.id === id)
          if (tag) {
            tag.enabled = enabled
          }
        }
        return res
      } catch (error) {
        console.error('切换标签状态失败:', error)
        throw error
      }
    },

    setSearchParams(params) {
      // 处理布尔值到数字的转换
      const processedParams = { ...params }
      if (processedParams.enabled !== undefined && processedParams.enabled !== '') {
        processedParams.enabled = processedParams.enabled ? 1 : 0
      }
      this.searchParams = { ...this.searchParams, ...processedParams }
      this.currentPage = 1 // 重置到第一页
    },

    setPagination(page, pageSize) {
      this.currentPage = page
      this.pageSize = pageSize
    },

    resetSearch() {
      this.searchParams = {
        name: '',
        tagType: '',
        enabled: ''
      }
      this.currentPage = 1
    }
  }
})