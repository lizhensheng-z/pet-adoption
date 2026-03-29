export default [
  {
    path: '/admin', // 绝对路径
    name: 'AdminDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, permission: 'admin:access', title: '管理首页' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDataDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, permission: 'admin:dashboard:view', title: '数据看板' }
  },
  {
    path: '/admin/pet-audits',
    name: 'AdminPetAudits',
    component: () => import('@/views/admin/PetAudit.vue'),
    meta: { requiresAuth: true, permission: 'admin:pet:audit', title: '宠物审核' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/Users.vue'),
    meta: { requiresAuth: true, permission: 'admin:user:list', title: '用户管理' }
  },
  {
    path: '/admin/users/:id',
    name: 'AdminUserDetail',
    component: () => import('@/views/admin/UserDetail.vue'),
    meta: { requiresAuth: true, permission: 'admin:user:view', title: '用户详情' }
  },
  {
    path: '/admin/tags',
    name: 'AdminTags',
    component: () => import('@/views/admin/Tags.vue'),
    meta: { requiresAuth: true, permission: 'admin:tag:manage', title: '标签管理' }
  },
  {
    path: '/admin/config',
    name: 'AdminConfig',
    component: () => import('@/views/admin/Config.vue'),
    meta: { requiresAuth: true, permission: 'admin:config:edit', title: '系统配置' }
  },
  {
    path: '/admin/notices',
    name: 'AdminNotices',
    component: () => import('@/views/admin/Notices.vue'),
    meta: { requiresAuth: true, permission: 'admin:notice:manage', title: '公告管理' }
  },
  {
    path: '/admin/audit-logs',
    name: 'AdminAuditLogs',
    component: () => import('@/views/admin/AuditLogs.vue'),
    meta: { requiresAuth: true, permission: 'admin:log:view', title: '审计日志' }
  }
]