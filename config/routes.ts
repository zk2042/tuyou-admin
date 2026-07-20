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
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  {
    name: ' CRUD 示例',
    path: '/table',
    component: './Table',
  },
];
