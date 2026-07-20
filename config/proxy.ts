export default {
  dev: {
    // '/api/': {
    //   target: 'http://后端IP:端口',   // ← 改这行
    //   changeOrigin: true,
    //   // pathRewrite: { '^/api': '' },   // 如果后端接口不带 /api 前缀，取消注释
    // },
  },
  localhost: {
    // '/api/': {
    //   target: 'http://localhost:3000',    // ← 本地后端
    //   changeOrigin: true,
    // },
  },
  test: {
    // '/api/': {
    //   target: 'https://test-api.xxx.com',
    //   changeOrigin: true,
    // },
  },
  pre: {
    // '/api/': {
    //   target: 'https://pre-api.xxx.com',
    //   changeOrigin: true,
    // },
  },
};
