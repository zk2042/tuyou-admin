// 运行时配置
import Footer from '@/components/Footer';
import Forbidden from '@/pages/Exception/403';
import NotFound from '@/pages/Exception/404';
import { getMe, type CurrentInfo } from '@/services/auth';
import { queryNoticeUnread } from '@/services/center';
import { adminLogout } from '@/services/login';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnreadCount } from '@/store/slices/noticeSlice';
import {
  clearAuth as clearToken,
  getToken,
  getUser,
  setUser,
} from '@/utils/auth';
import { setAppInstance } from '@/utils/message';
import {
  buildAppRoutes,
  buildMenuMeta,
  normalizePath,
  pageMap,
} from '@/utils/route';
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Outlet, useAccess, useLocation, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import {
  App,
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Space,
  Typography,
} from 'antd';
import type { ComponentType, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { requestConfig } from './api/requestConfig';
import './global.less';

const APP_LOGO =
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

export type InitialState = CurrentInfo;

// 清理登录状态，并根据需要记录登录后的回跳地址
function redirectToLogin(redirect = true) {
  clearToken();
  store.dispatch(setUnreadCount(0));

  if (window.location.pathname === '/login') {
    return;
  }

  if (redirect) {
    const { pathname, search } = window.location;
    const params = new URLSearchParams({
      redirect: `${pathname}${search}`,
    });
    window.location.href = `/login?${params.toString()}`;
    return;
  }

  window.location.href = '/login';
}

async function logout() {
  try {
    await adminLogout({ skipErrorHandler: true });
  } catch {
  } finally {
    redirectToLogin(false);
  }
}

// 同步 ProLayout 侧边栏折叠状态并提供切换方法
function useSider() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const syncState = () => {
      const sider = document.querySelector('.ant-pro-sider');
      setCollapsed(
        sider?.classList.contains('ant-pro-sider-collapsed') ?? false,
      );
    };

    syncState();

    const observer = new MutationObserver(syncState);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMenu = () => {
    const button = document.querySelector<HTMLElement>(
      '.ant-pro-sider-collapsed-button',
    );
    button?.click();
  };

  return {
    collapsed,
    toggleMenu,
  };
}

// 应用顶部栏，包含面包屑、通知入口和用户菜单
function LayoutHeader() {
  const location = useLocation();
  const { initialState } = useModel('@@initialState');
  const { collapsed, toggleMenu } = useSider();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((state) => state.notice.unreadCount);
  const { hasPerm } = useAccess();
  const canViewNotification = hasPerm('center:notification:list');
  const canViewUnread = hasPerm('center:notification:unread');

  const menuMeta = useMemo(
    () => [
      ...buildMenuMeta(initialState?.menu_tree),
      { path: '/center', title: '个人中心' },
    ],
    [initialState?.menu_tree],
  );

  const crumbs = useMemo(() => {
    const currentPath = location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1) || '/'
      : location.pathname;

    return menuMeta
      .filter(({ path }) => {
        return currentPath === path || currentPath.startsWith(`${path}/`);
      })
      .sort(
        (prev, next) =>
          prev.path.split('/').length - next.path.split('/').length,
      );
  }, [location.pathname, menuMeta]);

  const displayName = initialState?.username || '当前用户';

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'profile',
        label: '个人中心',
      },
      {
        key: 'logout',
        label: '退出登录',
        danger: true,
      },
    ],
    [],
  );

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      void logout();
      return;
    }

    if (key === 'profile') {
      history.push('/center');
      return;
    }
  };

  const loadUnread = async () => {
    try {
      const response = await queryNoticeUnread();
      dispatch(setUnreadCount(response.data?.unread_count ?? 0));
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (!getToken() || !initialState?.id || !canViewUnread) {
      dispatch(setUnreadCount(0));
      return;
    }

    void loadUnread();
  }, [canViewUnread, dispatch, initialState?.id, location.pathname]);

  return (
    <div className="app-header">
      <Space size={16} className="header-left">
        <span className="header-action" onClick={toggleMenu}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <Breadcrumb
          items={crumbs.map((item, index) => ({
            title:
              index === crumbs.length - 1 ? (
                item.title
              ) : (
                <span
                  className="crumb-link"
                  onClick={() => history.push(item.path)}
                >
                  {item.title}
                </span>
              ),
          }))}
        />
      </Space>

      <Space size={20} className="header-actions">
        {canViewNotification ? (
          <span
            className="header-action"
            onClick={() => history.push('/center')}
          >
            <Badge dot={unreadCount > 0} className="header-badge">
              <BellOutlined />
            </Badge>
          </span>
        ) : null}

        <Dropdown
          trigger={['click']}
          menu={{
            items: menuItems,
            onClick: handleUserMenuClick,
          }}
        >
          <Space size={10} className="user-trigger">
            <Avatar src={initialState?.avatar || undefined} alt={displayName}>
              {displayName.slice(0, 1).toUpperCase()}
            </Avatar>
            <Typography.Text ellipsis className="user-name">
              {displayName}
            </Typography.Text>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
}

// 将 Ant Design App 实例桥接给非组件模块使用
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

// 注入 Ant Design 上下文和 Redux 全局状态
export function rootContainer(container: ReactNode) {
  return (
    <App>
      <AppMessageBridge>
        <Provider store={store}>{container}</Provider>
      </AppMessageBridge>
    </App>
  );
}

// 根据当前用户菜单在运行时重建可访问路由
export function patchRoutes({
  routes,
  routeComponents,
}: {
  routes: Record<string, any>;
  routeComponents: Record<string, ComponentType>;
}) {
  const user = getUser<InitialState>();
  const menuTree = user?.menu_tree || [];
  const appRoutes = buildAppRoutes(menuTree);
  const routeMap = new Map<string, any>();

  Object.values(routes).forEach((route: any) => {
    if (route?.path && route.id !== 'ant-design-pro-layout') {
      routeMap.set(route.path, route);
    }
  });

  const layoutRoute = Object.values(routes).find(
    (route: any) => route?.id === 'ant-design-pro-layout',
  );

  if (!layoutRoute) {
    return;
  }

  const nextRoutes: Record<string, any> = {
    'ant-design-pro-layout': {
      ...layoutRoute,
      routes: [],
    },
  };

  let routeId = 0;
  const createId = () => `runtime-route-${routeId++}`;

  const appendRoute = (route: any, parentId?: string) => {
    const source = route.path ? routeMap.get(route.path) : undefined;
    const id =
      source?.id && source.id !== 'ant-design-pro-layout'
        ? source.id
        : createId();

    const component =
      typeof route.component === 'string'
        ? pageMap[route.component]?.component
        : undefined;

    const nextRoute = {
      ...(source || {}),
      ...route,
      id,
      parentId,
    };

    delete nextRoute.component;

    if (source?.routes && !route.routes) {
      delete nextRoute.routes;
    }

    nextRoutes[id] = nextRoute;

    if (source?.id && routeComponents[source.id]) {
      routeComponents[id] = routeComponents[source.id];
    } else if (component) {
      routeComponents[id] = component;
    } else if (route.routes?.length) {
      routeComponents[id] = Outlet;
    }

    if (route.routes?.length) {
      nextRoute.routes = route.routes.map((item: any) => {
        const childId = appendRoute(item, id);
        return nextRoutes[childId];
      });
    }

    return id;
  };

  for (const route of appRoutes) {
    if (route.layout === false) {
      appendRoute(route);
      continue;
    }

    const childId = appendRoute(route, 'ant-design-pro-layout');
    nextRoutes['ant-design-pro-layout'].routes.push(nextRoutes[childId]);
  }

  Object.keys(routes).forEach((key) => {
    delete routes[key];
  });

  Object.assign(routes, nextRoutes);
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<InitialState | undefined> {
  const token = getToken();

  if (!token) {
    clearToken();
    return undefined;
  }

  const cachedUser = getUser<InitialState>();

  try {
    const response = await getMe();
    if (!response.data) {
      clearToken();
      return undefined;
    }

    const menuChanged =
      JSON.stringify(cachedUser?.menu_tree ?? []) !==
      JSON.stringify(response.data.menu_tree);
    setUser(response.data);

    if (menuChanged && window.location.pathname !== '/login') {
      window.location.replace('/');
    }

    return response.data;
  } catch {
    clearToken();
    return undefined;
  }
}

// ========== 请求配置 ==========
export const request: RequestConfig = {
  ...requestConfig,
};

export const layout: RunTimeLayoutConfig = ({ initialState }) => ({
  logo: APP_LOGO,
  title: '途友管理后台',
  navTheme: 'light',
  headerRender: false,
  rightContentRender: false,
  footerRender: () => <Footer />,
  actionsRender: false,
  avatarProps: false,
  menuFooterRender: false,
  token: {
    pageContainer: {
      paddingBlockPageContainerContent: 8,
    },
    sider: {
      colorMenuBackground: '#141414',
      colorTextMenu: 'rgba(255,255,255,0.75)',
      colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
      colorTextMenuTitle: 'rgba(255,255,255,0.95)',
      colorBgMenuItemHover: 'rgba(46,125,50,0.12)',
      colorBgMenuItemSelected: '#2e7d32',
      colorTextMenuItemHover: '#ffffff',
      colorTextMenuActive: 'rgba(255,255,255,0.85)',
      colorTextMenuSelected: 'rgba(255,255,255,0.85)',
      colorBgCollapsedButton: '#1f1f1f',
      colorTextCollapsedButton: 'rgba(255,255,255,0.85)',
      colorTextCollapsedButtonHover: '#ffffff',
    },
  },
  menu: {
    locale: false,
  },
  unAccessible: <Forbidden />,
  noFound: <NotFound />,
  onPageChange: () => {
    const { pathname, search } = history.location;
    const currentPath = normalizePath(pathname);
    const cachedUser = getUser<InitialState>();
    const hasLogin = Boolean(
      getToken() && (initialState?.id || cachedUser?.id),
    );
    const isLogin = currentPath === '/login';

    if (!hasLogin && !isLogin) {
      redirectToLogin();
      return;
    }

    if (hasLogin && isLogin) {
      const redirect = new URLSearchParams(search).get('redirect') || '/';
      history.replace(redirect);
      return;
    }

    if (isLogin || currentPath === '/') {
      return;
    }
  },
  childrenRender: (children) => (
    <div className="app-layout">
      <LayoutHeader />
      <div className="layout-body">{children}</div>
    </div>
  ),
  logout: () => {
    void logout();
  },
});
