export default [
  {
    path: '/login',
    component: './Login',
    layout: false,
  },
  {
    path: '/center',
    name: '个人中心',
    hideInMenu: true,
    component: './Center',
  },
  {
    path: '/403',
    hideInMenu: true,
    component: './Exception/403',
  },
  {
    path: '*',
    layout: false,
    component: './Exception/404',
  },
];
