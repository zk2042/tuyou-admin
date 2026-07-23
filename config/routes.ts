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
];
