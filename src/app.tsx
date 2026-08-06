// 运行时配置
import { formatNoticeTime } from '@/constants/common-const';
import { getMe, type CurrentInfo } from '@/services/auth';
import {
  queryNotice,
  queryNoticeUnread,
  type NoticeItem,
} from '@/services/center';
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
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, useLocation, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import {
  App,
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Empty,
  Popover,
  Space,
  Spin,
  Typography,
} from 'antd';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import routes from '../config/routes';
import { requestConfig } from './api/requestConfig';
import './global.less';

const APP_LOGO =
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

export type InitialState = CurrentInfo;

type AppRoute = {
  path?: string;
  name?: string;
  routes?: AppRoute[];
};

type BreadcrumbRoute = {
  path: string;
  title: string;
};

const headerNoticeMap = {
  0: '系统通知',
  1: '安全设置提醒',
  2: '设备登录提醒',
} as const;

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

function normalizePath(path: string) {
  if (!path || path === '/') {
    return '/';
  }

  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function collectNamedRoutes(routeList: AppRoute[]) {
  return routeList.reduce<BreadcrumbRoute[]>((result, route) => {
    if (route.path && route.name) {
      result.push({
        path: normalizePath(route.path),
        title: route.name,
      });
    }

    if (route.routes?.length) {
      result.push(...collectNamedRoutes(route.routes));
    }

    return result;
  }, []);
}

const routeMap = collectNamedRoutes(routes as AppRoute[]);

function buildBreadcrumbs(pathname: string) {
  const currentPath = normalizePath(pathname);
  return routeMap
    .filter(({ path }) => {
      return currentPath === path || currentPath.startsWith(`${path}/`);
    })
    .sort(
      (prev, next) => prev.path.split('/').length - next.path.split('/').length,
    );
}

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

function LayoutHeader() {
  const location = useLocation();
  const { initialState } = useModel('@@initialState');
  const { collapsed, toggleMenu } = useSider();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((state) => state.notice.unreadCount);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);

  const crumbs = useMemo(
    () => buildBreadcrumbs(location.pathname),
    [location.pathname],
  );

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

  const loadTopNotice = async () => {
    setNoticeLoading(true);

    try {
      const response = await queryNotice({
        page: 1,
        size: 5,
      });

      setNoticeList(response.data?.list ?? []);
    } catch {
      setNoticeList([]);
    } finally {
      setNoticeLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken() || !initialState?.id) {
      dispatch(setUnreadCount(0));
      return;
    }

    void loadUnread();
  }, [dispatch, initialState?.id, location.pathname]);

  const noticeContent = (
    <div className="notice-pop">
      <div className="notice-list">
        <Spin spinning={noticeLoading}>
          {noticeList.length ? (
            noticeList.map((item) => (
              <div key={item.id} className="notice-item">
                <div className="notice-top">
                  <span className="notice-title">
                    {headerNoticeMap[item.type]}
                  </span>
                  <span className="notice-time">
                    {formatNoticeTime(item.created_at)}
                  </span>
                </div>
                <div className="notice-text">{item.content}</div>
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无消息"
            />
          )}
        </Spin>
      </div>
      <div
        className="notice-more"
        onClick={() => {
          setNoticeOpen(false);
          history.push('/center');
        }}
      >
        查看全部
      </div>
    </div>
  );

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
        <Popover
          trigger="click"
          open={noticeOpen}
          placement="bottomRight"
          content={noticeContent}
          onOpenChange={(open) => {
            setNoticeOpen(open);

            if (open) {
              void loadTopNotice();
            }
          }}
        >
          <span className="header-action">
            <Badge dot={unreadCount > 0} className="header-badge">
              <BellOutlined />
            </Badge>
          </span>
        </Popover>

        <Dropdown
          trigger={['hover']}
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
      return cachedUser;
    }

    setUser(response.data);

    return response.data;
  } catch {
    return cachedUser;
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
  actionsRender: false,
  avatarProps: false,
  menuFooterRender: false,
  token: {
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
  onPageChange: () => {
    const { pathname, search } = history.location;
    const cachedUser = getUser<InitialState>();
    const hasLogin = Boolean(
      getToken() && (initialState?.id || cachedUser?.id),
    );
    const isLogin = pathname === '/login';

    if (!hasLogin && !isLogin) {
      redirectToLogin();
      return;
    }

    if (hasLogin && isLogin) {
      const redirect = new URLSearchParams(search).get('redirect') || '/';
      history.replace(redirect);
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
