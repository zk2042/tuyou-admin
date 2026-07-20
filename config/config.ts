import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

// 打印REACT_APP_ENV变量的几种方式
console.log('REACT_APP_ENV:', REACT_APP_ENV); // 方式1：直接打印变量值
console.log('当前环境:', process.env.REACT_APP_ENV); // 方式2：通过process.env访问
console.debug('调试信息 - 环境变量:', { REACT_APP_ENV }); // 方式3：以对象形式打印

export default defineConfig({
  // ========== 构建配置 ==========
  hash: true, // 打包产物带 hash，避免浏览器缓存
  fastRefresh: true, // 热更新保留组件 state
  ignoreMomentLocale: true, // 去掉 moment 国际化，减包体积

  // ========== 路由 ==========
  routes,

  // ========== 代理（根据 REACT_APP_ENV 自动切换环境） ==========
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],

  // ========== Umi Max 插件 ==========
  antd: {},
  access: {}, // RBAC 权限插件
  model: {}, // 数据流插件（useModel）
  initialState: {}, // 全局初始状态（getInitialState）
  request: {}, // 内置请求库（umi-request）
  layout: {
    title: '途友管理后台',
    locale: false, // 关掉国际化，只用中文
    ...defaultSettings, // 主题、布局模式从独立文件引入
  },

  // ========== 工程化 ==========
  moment2dayjs: {
    // antd DatePicker 底层从 moment 切到 dayjs
    preset: 'antd',
    plugins: ['duration'],
  },
  npmClient: 'npm',
});
