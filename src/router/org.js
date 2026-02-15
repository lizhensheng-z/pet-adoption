export default [
  {
    path: '/org',
    name: 'OrgDashboard',
    component: () => import('@/views/org/Dashboard.vue'),
    meta: { requiresAuth: true, permission: 'org:access', title: '机构首页' }
  },
  {
    path: '/org/pets',
    name: 'OrgPetList',
    component: () => import('@/views/org/PetList.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:list', title: '宠物管理' }
  },
  {
    path: '/org/pets/create',
    name: 'OrgPetCreate',
    component: () => import('@/views/org/PetCreate.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:create', title: '创建宠物' }
  },
  {
    path: '/org/pets/:id/edit',
    name: 'OrgPetEdit',
    component: () => import('@/views/org/PetEdit.vue'),
    meta: { requiresAuth: true, permission: 'org:pet:edit', title: '编辑宠物' }
  },
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
  {
    path: '/org/adoptions',
    name: 'OrgAdoptions',
    component: () => import('@/views/org/Adoptions.vue'),
    meta: { requiresAuth: true, permission: 'org:adoption:list', title: '领养记录' }
  },
  {
    path: '/org/followup',
    name: 'OrgFollowup',
    component: () => import('@/views/org/Followup.vue'),
    meta: { requiresAuth: true, permission: 'org:followup:list', title: '回访管理' }
  },
  {
    path: '/org/profile',
    name: 'OrgProfile',
    component: () => import('@/views/org/Profile.vue'),
    meta: { requiresAuth: true, permission: 'org:profile:edit', title: '机构资料' }
  },
  {
    path: '/org/statistics',
    name: 'OrgStatistics',
    component: () => import('@/views/org/Statistics.vue'),
    meta: { requiresAuth: true, permission: 'org:statistics:view', title: '统计数据' }
  }
]