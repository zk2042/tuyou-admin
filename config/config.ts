import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const rawEnv = process.env.UMI_ENV || 'dev';
const currentEnv = (rawEnv in proxy ? rawEnv : 'dev') as keyof typeof proxy;

console.log('[Umi Config] rawEnv:', rawEnv);
console.log('[Umi Config] currentEnv:', currentEnv);

export default defineConfig({
  // ========== 构建配置 ==========
  hash: true, // 打包产物带 hash，避免浏览器缓存
  fastRefresh: true, // 热更新保留组件 state
  ignoreMomentLocale: true, // 去掉 moment 国际化，减包体积
  esbuildMinifyIIFE: true, // 避免 esbuild helper 冲突导致构建失败

  // ========== 路由 ==========
  routes,

  // ========== 代理（根据 UMI_ENV 自动切换环境） ==========
  proxy: proxy[currentEnv],

  // ========== Umi Max 插件 ==========
  antd: {
    theme: {
      token: {
        colorPrimary: '#2e7d32',
        colorPrimaryHover: '#38953cff',
        colorPrimaryActive: '#2b732eff',
      },
    },
  },
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
  define: {
    'process.env.APP_ENV': JSON.stringify(currentEnv),
    'process.env.UMI_ENV': JSON.stringify(currentEnv),
  },
  npmClient: 'npm',
});
