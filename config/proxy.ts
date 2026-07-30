export default {
  dev: {
    '/api/': {
      target: 'http://192.168.10.7:83',
      changeOrigin: true,
    },
  },
  localhost: {
    // 本地后端环境
    // 适用于：本地前端 + 本地后端联调
    // '/api/': {
    //   target: 'http://localhost:3000',    // ← 本地后端
    //   changeOrigin: true,
    // },
  },
  test: {
    // 测试环境
    // 适用于：联调测试 / QA 验证
    // 如果测试环境已经通过网关或 Nginx 暴露 /api/*，通常不需要 pathRewrite
    // '/api/': {
    //   target: 'https://test-api.xxx.com',
    //   changeOrigin: true,
    // },
  },
  prod: {
    // 正式生产环境
    // 适用于：本地前端临时联调生产接口
    // 注意：生产环境一般要求 HTTPS，并确认是否允许跨域或代理转发
    // '/api/': {
    //   target: 'https://api.xxx.com',
    //   changeOrigin: true,
    // },
  },
  pre: {
    // 预发布环境
    // 适用于：生产前验收、灰度验证
    // '/api/': {
    //   target: 'https://pre-api.xxx.com',
    //   changeOrigin: true,
    // },
  },
};
