import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name 默认设置配置
 * @description 包含系统的基础配置，如主题、布局、logo等
 * @author zk
 * @time 2026-07-19
 */

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#2e7d32',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '途友管理后台',
  // logo: null,                   // 先不用 logo，后面再加
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    sider: {
      colorMenuBackground: '#141414',
      colorTextMenu: 'rgba(255,255,255,0.85)',
      colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
      colorTextMenuTitle: 'rgba(255,255,255,0.95)',

      colorBgMenuItemHover: 'rgba(46,125,50,0.12)',
      colorBgMenuItemSelected: '#2e7d32',

      colorTextMenuItemHover: '#ffffff',
      colorTextMenuActive: '#ffffff',
      colorTextMenuSelected: '#ffffff',

      colorBgCollapsedButton: '#1f1f1f',
      colorTextCollapsedButton: 'rgba(255,255,255,0.85)',
      colorTextCollapsedButtonHover: '#ffffff',
    },
  },
};

export default Settings;
