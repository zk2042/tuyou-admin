export default [
  {
    path: '/login',
    component: './Login',
    layout: false,
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
