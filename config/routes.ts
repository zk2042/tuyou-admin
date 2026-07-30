export default [
  // ========== 登录（不套后台壳） ==========
  {
    path: '/login',
    component: './Login',
    layout: false,
  },

  {
    path: '/',
    redirect: '/user/member',
  },
  {
    name: '用户管理',
    path: '/user',
    icon: 'team',
    disabledTooltip: true,
    routes: [
      {
        path: '/user',
        redirect: '/user/member',
      },
      {
        name: '会员管理',
        path: '/user/member',
        icon: 'user',
        disabledTooltip: true,
        component: './User/Member',
      },
      {
        name: '领队管理',
        path: '/user/leader',
        icon: 'crown',
        disabledTooltip: true,
        component: './User/Leader',
      },
    ],
  },
  {
    name: '活动管理',
    path: '/activity',
    icon: 'calendar',
    disabledTooltip: true,
    component: './Activity',
  },
];
