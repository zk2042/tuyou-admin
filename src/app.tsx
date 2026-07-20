// 运行时配置
import { LOCAL_STORAGE_KEY } from '@/constants';
import { store } from '@/store';
import { setAppInstance } from '@/utils/message';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { App } from 'antd';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { requestConfig } from './api/requestConfig';

const APP_LOGO =
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

export type CurrentUser = {
  id: number;
  username: string;
  avatar?: string;
  role: string;
};

const MOCK_CURRENT_USER: CurrentUser = {
  id: 1,
  username: 'tuyou_zk',
  avatar: '',
  role: 'admin',
};

export type InitialState = CurrentUser & {
  name: string;
};

function redirectToLogin() {
  localStorage.removeItem(LOCAL_STORAGE_KEY.USER_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEY.USER_INFO);

  if (window.location.pathname === '/login') {
    return;
  }

  const { pathname, search } = window.location;
  const params = new URLSearchParams({
    redirect: `${pathname}${search}`,
  });
  window.location.href = `/login?${params.toString()}`;
}

function AppMessageBridge(props: { children: ReactNode }) {
  const app = App.useApp();

  useEffect(() => {
    setAppInstance(app);

    return () => {
      setAppInstance(null);
    };
  }, [app]);

  return <>{props.children}</>;
}

export function rootContainer(container: ReactNode) {
  return (
    <App>
      <AppMessageBridge>
        <Provider store={store}>{container}</Provider>
      </AppMessageBridge>
    </App>
  );
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<InitialState> {
  let currentUser = MOCK_CURRENT_USER;
  const cachedUser = localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO);

  if (cachedUser) {
    try {
      currentUser = JSON.parse(cachedUser) as CurrentUser;
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY.USER_INFO);
    }
  } else {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.USER_INFO,
      JSON.stringify(MOCK_CURRENT_USER),
    );
  }

  // TODO: 等后端接口好了，优先请求当前管理员信息，再更新 localStorage 缓存。
  return {
    ...currentUser,
    name: currentUser.username,
    avatar: currentUser.avatar || APP_LOGO,
  };
}

// ========== 请求配置 ==========
export const request: RequestConfig = {
  ...requestConfig,
};

export const layout: RunTimeLayoutConfig = () => ({
  logo: APP_LOGO,
  title: '途友管理后台',
  menu: {
    locale: false,
  },
  logout: () => {
    redirectToLogin();
  },
});
