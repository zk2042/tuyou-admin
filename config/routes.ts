export default [
  // ========== 登录（不套后台壳） ==========
  {
    path: '/login',
    component: './Login',
    layout: false,
  },

  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    name: '用户管理',
    path: '/user-management',
    routes: [
      {
        path: '/user-management',
        redirect: '/user-management/member',
      },
      {
        name: '会员管理',
        path: '/user-management/member',
        component: './UserManagement/Member',
      },
      {
        name: '领队管理',
        path: '/user-management/leader',
        component: './UserManagement/Leader',
      },
    ],
  },
];
