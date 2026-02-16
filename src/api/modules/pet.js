import http from '@/api/request.js'

/**
 * 宠物相关API接口
 */
export const petAPI = {
  /**
   * 获取宠物列表（用户端）
   */
  getPets(params) {
    return http.get('/pets', params)
  },

  /**
   * 获取宠物详情
   */
  getPetDetail(id) {
    return http.get(`/pets/${id}`)
  },

  /**
   * 获取机构自己的宠物列表
   */
  getOrgPetList(params) {
    return http.get('/pets/org/my-pets', params)
  },

  /**
   * 创建宠物
   */
  createPet(data) {
    return http.post('/pets/org/createPet', data)
  },

  /**
   * 更新宠物信息
   */
  updatePet(id, data) {
    return http.put(`/pets/org/${id}`, data)
  },

  /**
   * 删除宠物
   */
  deletePet(id) {
    return http.delete(`/pets/org/${id}`)
  },

  /**
   * 收藏/取消收藏
   */
  toggleFavorite(petId) {
    return http.post(`/pets/${petId}/favorite`)
  },

  /**
   * 检查收藏状态
   */
  checkFavorite(petId) {
    return http.get(`/pets/${petId}/favorite/status`)
  }
}

/**
 * 领养申请相关API接口
 */
export const applicationAPI = {
  /**
   * 提交领养申请
   */
  submitApplication(data) {
    return http.post('/applications', data)
  },

  /**
   * 获取申请记录详情
   */
  getApplicationDetail(id) {
    return http.get(`/applications/${id}`)
  },

  /**
   * 获取我的申请列表
   */
  getMyApplications(params) {
    return http.get('/applications/my', params)
  }
}

// 为了兼容性，也可以保留一个默认导出
export default {
  petAPI,
  applicationAPI
}










// import http from '@/api/request.js'

// /**
//  * 宠物相关API接口
//  */
// export default {
//   /**
//    * 获取机构宠物列表
//    * @param {Object} params 查询参数
//    * @param {number} params.pageNo 页码
//    * @param {number} params.pageSize 每页数量
//    * @param {string} params.status 状态
//    * @param {string} params.auditStatus 审核状态
//    * @param {string} params.sortBy 排序字段
//    * @param {string} params.order 排序方式
//    * @returns {Promise} 返回Promise对象
//    */
//   getOrgPetList(params) {
//     return http.get('/pets/org/my-pets', params)
//   },

//   /**
//    * 创建宠物
//    * @param {Object} data 宠物信息
//    * @returns {Promise} 返回Promise对象
//    */
//   createPet(data) {
//     return http.post('/pets/org/createPet', data)
//   },

//   /**
//    * 更新宠物信息
//    * @param {number} id 宠物ID
//    * @param {Object} data 更新数据
//    * @returns {Promise} 返回Promise对象
//    */
//   updatePet(id, data) {
//     return http.put(`/pets/org/${id}`, data)
//   },

//   /**
//    * 获取宠物详情
//    * @param {number} id 宠物ID
//    * @returns {Promise} 返回Promise对象
//    */
//   getPetDetail(id) {
//     return http.get(`/pets/${id}`)
//   },

//   /**
//    * 删除宠物
//    * @param {number} id 宠物ID
//    * @returns {Promise} 返回Promise对象
//    */
//   deletePet(id) {
//     return http.delete(`/pets/org/${id}`)
//   },

//   /**
//    * 获取宠物列表（用户端）
//    * @param {Object} params 查询参数
//    * @returns {Promise} 返回Promise对象
//    */
//   getPetList(params) {
//     return http.get('/pets', params)
//   }
// }