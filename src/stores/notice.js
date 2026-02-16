import { defineStore } from 'pinia'
import { noticeApi, userNoticeApi } from '@/api/modules/admin.js'

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    // 公告列表
    noticeList: [],
    total: 0,
    currentNotice: null,
    loading: false,
    
    // 用户端公告列表
    userNoticeList: [],
    userTotal: 0,
    
    // 分页信息
    pagination: {
      pageNo: 1,
      pageSize: 10
    }
  }),

  getters: {
    // 获取已发布公告
    publishedNotices: (state) => 
      state.noticeList.filter(notice => notice.status === 'PUBLISHED'),
    
    // 获取草稿公告
    draftNotices: (state) => 
      state.noticeList.filter(notice => notice.status === 'DRAFT'),
    
    // 获取已删除公告
    removedNotices: (state) => 
      state.noticeList.filter(notice => notice.status === 'REMOVED')
  },

  actions: {
  // 获取管理端公告列表
    async fetchNoticeList(params = {}) {
      this.loading = true
      try {
        const response = await noticeApi.getNoticeList({
          page: this.pagination.pageNo,
          size: this.pagination.pageSize,
          ...params
        })
        if (response.code === 10000) {
          // 适配后端返回格式
          const data = response.data
          this.noticeList = data.records || data.list || []
          this.total = data.total || data.totalCount || 0
          this.pagination.pageNo = data.current || data.page || 1
          this.pagination.pageSize = data.size || 10
        }
        return response
      } catch (error) {
        console.error('获取公告列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取公告详情
    async fetchNoticeDetail(id) {
      try {
        const response = await noticeApi.getNoticeDetail(id)
        if (response.code === 10000) {
          this.currentNotice = response.data
        }
        return response
      } catch (error) {
        console.error('获取公告详情失败:', error)
        throw error
      }
    },

    // 创建公告
    async createNotice(data) {
      try {
        const response = await noticeApi.createNotice(data)
        if (response.code === 10000) {
          // 创建成功后刷新列表
          await this.fetchNoticeList()
        }
        return response
      } catch (error) {
        console.error('创建公告失败:', error)
        throw error
      }
    },

    // 更新公告
    async updateNotice(id, data) {
      try {
        const response = await noticeApi.updateNotice(id, data)
        if (response.code === 10000) {
          // 更新成功后刷新列表
          await this.fetchNoticeList()
        }
        return response
      } catch (error) {
        console.error('更新公告失败:', error)
        throw error
      }
    },

    // 删除公告
    async deleteNotice(id) {
      try {
        const response = await noticeApi.deleteNotice(id)
        if (response.code === 10000) {
          // 删除成功后刷新列表
          await this.fetchNoticeList()
        }
        return response
      } catch (error) {
        console.error('删除公告失败:', error)
        throw error
      }
    },

    // 更新公告状态
    async updateNoticeStatus(id, status) {
      try {
        const response = await noticeApi.updateNoticeStatus(id, status)
        if (response.code === 10000) {
          // 更新状态后刷新列表
          await this.fetchNoticeList()
        }
        return response
      } catch (error) {
        console.error('更新公告状态失败:', error)
        throw error
      }
    },

  // 获取用户端公告列表
    async fetchUserNoticeList(params = {}) {
      this.loading = true
      try {
        const response = await userNoticeApi.getNoticeList({
          page: 1,
          size: 10,
          ...params
        })
        if (response.code === 10000) {
          this.userNoticeList = response.data.records || response.data.list || []
          this.userTotal = response.data.total || response.data.totalCount || 0
        }
        return response
      } catch (error) {
        console.error('获取用户端公告列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取用户端公告详情
    async fetchUserNoticeDetail(id) {
      try {
        const response = await userNoticeApi.getNoticeDetail(id)
        if (response.code === 10000) {
          this.currentNotice = response.data
        }
        return response
      } catch (error) {
        console.error('获取用户端公告详情失败:', error)
        throw error
      }
    },

    // 设置分页参数
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    // 重置公告列表
    resetNoticeList() {
      this.noticeList = []
      this.total = 0
      this.pagination = {
        pageNo: 1,
        pageSize: 10
      }
    },

    // 重置用户端公告列表
    resetUserNoticeList() {
      this.userNoticeList = []
      this.userTotal = 0
    },

    // 清空当前公告
    clearCurrentNotice() {
      this.currentNotice = null
    }
  }
})