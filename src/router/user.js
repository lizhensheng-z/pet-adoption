export default [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/user/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/pets',
    name: 'PetList',
    component: () => import('@/views/user/PetList.vue'),
    meta: { title: '宠物列表' }
  },
  {
    path: '/pets/:id',
    name: 'PetDetail',
    component: () => import('@/views/user/PetDetail.vue'),
    meta: { title: '宠物详情' }
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: () => import('@/views/user/AIAssistant.vue'),
    meta: { title: 'AI小助手' }
  },
  {
    path: '/apply/:petId',
    name: 'ApplyPet',
    component: () => import('@/views/user/ApplyPet.vue'),
    meta: { requiresAuth: true, title: '申请领养' }
  },
  {
    path: '/applications',
    name: 'Applications',
    component: () => import('@/views/user/Applications.vue'),
    meta: { requiresAuth: true, title: '我的申请' }
  },
  {
    path: '/applications/:id',
    name: 'ApplicationDetail',
    component: () => import('@/views/user/ApplicationDetail.vue'),
    meta: { requiresAuth: true, title: '申请详情' }
  },
  {
    path: '/checkins',
    name: 'Checkins',
    component: () => import('@/views/user/Checkins.vue'),
    meta: { requiresAuth: true, title: '我的打卡' }
  },
  {
    path: '/checkins/create',
    name: 'CreateCheckin',
    component: () => import('@/views/user/CreateCheckin.vue'),
    meta: { requiresAuth: true, title: '发布打卡' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/user/Favorites.vue'),
    meta: { requiresAuth: true, title: '我的收藏' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { requiresAuth: true, title: '个人资料' }
  },
  {
    path: '/preference',
    name: 'Preference',
    component: () => import('@/views/user/Preference.vue'),
    meta: { requiresAuth: true, title: '偏好设置' }
  },
  {
    path: '/credit',
    name: 'Credit',
    component: () => import('@/views/user/Credit.vue'),
    meta: { requiresAuth: true, title: '信用中心' }
  },
  {
    path: '/notices',
    name: 'UserNotices',
    component: () => import('@/views/user/NoticeList.vue'),
    meta: { title: '系统公告' }
  },
  {
    path: '/notices/:id',
    name: 'UserNoticeDetail',
    component: () => import('@/views/user/NoticeDetail.vue'),
    meta: { title: '公告详情' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
    meta: { title: '注册' }
  }
]