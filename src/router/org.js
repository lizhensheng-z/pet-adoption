export default [
  // 机构首页 - 并列于普通首页
  {
    path: '/org',
    name: 'OrgHome',
    component: () => import('@/views/org/Dashboard.vue'),
    meta: { requiresAuth: true, permission: 'org:access', title: '机构首页' }
  },

  // 宠物管理相关 - 扁平化结构
  {
    path: '/org/pet',
    name: 'OrgPetList',
    component: () => import('@/views/org/PetList.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:list', title: '宠物管理' }
  },
  {
    path: '/org/pet/create',
    name: 'OrgPetCreate',
    component: () => import('@/views/org/PetCreate.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:create', title: '创建宠物' }
  },
  {
    path: '/org/pet/edit/:id',
    name: 'OrgPetEdit',
    component: () => import('@/views/org/PetEdit.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:edit', title: '编辑宠物' }
  },
  {
    path: '/org/pet/detail/:id',
    name: 'OrgPetDetail',
    component: () => import('@/views/org/PetDetail.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:list', title: '宠物详情' }
  },

  // 申请管理相关
  {
    path: '/org/adoptions',
    name: 'OrgAdoptions',
    component: () => import('@/views/org/Adoptions.vue'),
    meta: { requiresAuth: true, permission: 'org:adoption:list', title: '领养申请管理' }
  },
  {
    path: '/org/adoptions/:id',
    name: 'OrgAdoptionDetail',
    component: () => import('@/views/org/AdoptionDetail.vue'),
    meta: { requiresAuth: true, permission: 'org:adoption:view', title: '申请详情审核' }
  },

  // 回访管理
  {
    path: '/org/followup',
    name: 'OrgFollowup',
    component: () => import('@/views/org/Followup.vue'),
    meta: { requiresAuth: true, permission: 'org:followup:list', title: '回访管理' }
  },

  // 统计数据
  {
    path: '/org/statistics',
    name: 'OrgStatistics',
    component: () => import('@/views/org/Statistics.vue'),
    meta: { requiresAuth: true, permission: 'org:statistics:view', title: '统计数据' }
  },

  // 机构资料
  {
    path: '/org/profile',
    name: 'OrgProfile',
    component: () => import('@/views/org/Profile.vue'),
    meta: { requiresAuth: true, permission: 'org:profile:edit', title: '机构资料' }
  },
  {
    path: '/org/profile/complete',
    name: 'OrgProfileComplete',
    component: () => import('@/views/org/ProfileComplete.vue'),
    meta: { requiresAuth: true, title: '完善机构资料' }
  },
  {
    path: '/org/profile/rejected',
    name: 'OrgProfileRejected',
    component: () => import('@/views/org/ProfileComplete.vue'),
    meta: { requiresAuth: true, permission: 'org:profile:edit', title: '修改机构资料' }
  },

  // 等待审核
  {
    path: '/org/waiting',
    name: 'OrgWaiting',
    component: () => import('@/views/org/Waiting.vue'),
    meta: { requiresAuth: true, title: '等待审核' }
  }
]