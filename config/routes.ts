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
    disabledTooltip: true,
    routes: [
      {
        path: '/user',
        redirect: '/user/member',
      },
      {
        name: '会员管理',
        path: '/user/member',
        disabledTooltip: true,
        component: './User/Member',
      },
      {
        name: '领队管理',
        path: '/user/leader',
        disabledTooltip: true,
        component: './User/Leader',
      },
    ],
  },
];
