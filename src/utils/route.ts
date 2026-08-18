import type { AuthMenu } from '@/services/auth';
import {
  AuditOutlined,
  BellOutlined,
  CalendarOutlined,
  CarOutlined,
  CarryOutOutlined,
  CommentOutlined,
  DashboardOutlined,
  HeartOutlined,
  KeyOutlined,
  OneToOneOutlined,
  ProfileOutlined,
  ReadOutlined,
  ReconciliationOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
  StarOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ComponentType, ReactNode } from 'react';
import { createElement, lazy } from 'react';

export type AppRoute = {
  path?: string;
  name?: string;
  icon?: ReactNode;
  component?: string;
  redirect?: string;
  hideInMenu?: boolean;
  disabledTooltip?: boolean;
  layout?: boolean;
  routes?: AppRoute[];
};

type BreadcrumbRoute = {
  path: string;
  title: string;
};

export type RouteMeta = {
  path: string;
  title: string;
};

type PageRule = {
  component: ComponentType;
  paths?: string[];
};

// 页面组件白名单，同时可限制组件允许绑定的路由地址
export const pageMap: Record<string, PageRule> = {
  './Dashboard': {
    component: lazy(() => import('@/pages/Dashboard')),
    paths: ['/dashboard'],
  },
  './Center': {
    component: lazy(() => import('@/pages/Center')),
    paths: ['/center'],
  },
  './User/Member': {
    component: lazy(() => import('@/pages/User/Member')),
  },
  './User/Leader': {
    component: lazy(() => import('@/pages/User/Leader')),
  },
  './Activity': {
    component: lazy(() => import('@/pages/Activity')),
  },
  './Content/Note': {
    component: lazy(() => import('@/pages/Content/Note')),
  },
  './Content/Guide': {
    component: lazy(() => import('@/pages/Content/Guide')),
  },
  './Comment': {
    component: lazy(() => import('@/pages/Comment')),
  },
  './Authority/Manager': {
    component: lazy(() => import('@/pages/Authority/Manager')),
  },
  './Authority/Role': {
    component: lazy(() => import('@/pages/Authority/Role')),
  },
  './Authority/Menu': {
    component: lazy(() => import('@/pages/Authority/Menu')),
  },
  './Authority/Permissions': {
    component: lazy(() => import('@/pages/Authority/Permissions')),
  },
  './Tag': {
    component: lazy(() => import('@/pages/Tag')),
  },
  './Message/System': {
    component: lazy(() => import('@/pages/Message/System')),
  },
  './Message/Interact': {
    component: lazy(() => import('@/pages/Message/Interact')),
  },
  './SensitiveWord': {
    component: lazy(() => import('@/pages/SensitiveWord')),
  },
};

const iconMap: Record<string, ComponentType> = {
  dashboard: DashboardOutlined,
  team: TeamOutlined,
  heart: HeartOutlined,
  star: StarOutlined,
  calendar: CalendarOutlined,
  profile: ProfileOutlined,
  reconciliation: ReconciliationOutlined,
  read: ReadOutlined,
  comment: CommentOutlined,
  safetyCertificate: SafetyCertificateOutlined,
  tag: TagOutlined,
  bell: BellOutlined,
  car: CarOutlined,
  carryOut: CarryOutOutlined,
  oneToOne: OneToOneOutlined,
  smile: SmileOutlined,
  rocket: RocketOutlined,
  key: KeyOutlined,
  audit: AuditOutlined,
};

const reservedPaths = new Set(['/', '/login', '/center', '/403', '*']);

// 统一移除非根路径末尾的斜杠，便于路由比较
export function normalizePath(path: string) {
  if (!path || path === '/') {
    return '/';
  }

  return path.endsWith('/') ? path.slice(0, -1) : path;
}

export function getLoginRedirect(search: string) {
  const redirect = new URLSearchParams(search).get('redirect');

  if (!redirect) {
    return '/';
  }

  try {
    const target = new URL(redirect, window.location.origin);
    const path = normalizePath(target.pathname);

    if (
      target.origin !== window.location.origin ||
      path === '/login' ||
      path === '/403' ||
      path === '*'
    ) {
      return '/';
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return '/';
  }
}

function isReservedPath(path?: string) {
  return !path || reservedPaths.has(normalizePath(path));
}

function getMenuIcon(icon?: string) {
  const component = icon ? iconMap[icon] : undefined;
  return component ? createElement(component) : undefined;
}

export function sortMenus(menuList?: AuthMenu[] | null) {
  return [...(menuList || [])].sort((prev, next) => {
    if (prev.sort === next.sort) {
      return String(prev.id).localeCompare(String(next.id), 'zh-Hans-CN', {
        numeric: true,
      });
    }

    return prev.sort - next.sort;
  });
}

function isValidPage(item: AuthMenu) {
  if (!item.component || isReservedPath(item.route_path)) {
    return false;
  }

  const rule = pageMap[item.component];
  if (!rule) {
    return false;
  }

  if (!rule.paths) {
    return true;
  }

  return rule.paths.includes(normalizePath(item.route_path));
}

// 递归收集可访问页面的路径和标题
function collectMenuMeta(menuList?: AuthMenu[] | null) {
  return sortMenus(menuList).reduce<RouteMeta[]>((result, item) => {
    if (isValidPage(item)) {
      result.push({
        path: normalizePath(item.route_path),
        title: item.menu_name,
      });
    }

    if (item.children?.length) {
      result.push(...collectMenuMeta(item.children));
    }

    return result;
  }, []);
}

export function hasMenuPath(path: string, menuList?: AuthMenu[] | null) {
  const currentPath = normalizePath(path);

  return collectMenuMeta(menuList).some((item) => item.path === currentPath);
}

function firstPath(menuList?: AuthMenu[] | null): string | undefined {
  for (const item of sortMenus(menuList)) {
    if (isReservedPath(item.route_path)) {
      continue;
    }

    if (isValidPage(item)) {
      return item.route_path;
    }

    const childPath = firstPath(item.children);
    if (childPath) {
      return childPath;
    }
  }

  return undefined;
}

// 将后端菜单树转换为 Umi 路由结构
export function transformMenu(menuList?: AuthMenu[] | null): AppRoute[] {
  return sortMenus(menuList).reduce<AppRoute[]>((result, item) => {
    if (isReservedPath(item.route_path)) {
      return result;
    }

    const route: AppRoute = {
      name: item.menu_name,
      path: item.route_path,
      icon: getMenuIcon(item.icon),
      hideInMenu: Boolean(item.hide_in_menu),
      disabledTooltip: true,
    };

    if (isValidPage(item)) {
      route.component = item.component;
      result.push(route);

      return result;
    }

    const children = transformMenu(item.children);
    const redirect = firstPath(item.children);

    if (children.length) {
      route.routes = [
        {
          path: item.route_path,
          redirect,
        },
        ...children,
      ];
      result.push(route);
    }

    return result;
  }, []);
}

// 生成包含登录页、权限页和兜底页的完整路由表
export function buildAppRoutes(menuTree?: AuthMenu[]) {
  const homePath = firstPath(menuTree) || '/403';

  return [
    {
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      path: '/',
      redirect: homePath,
    },
    {
      path: '/center',
      name: '个人中心',
      hideInMenu: true,
      component: './Center',
    },
    ...transformMenu(menuTree),
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
  ] as AppRoute[];
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

// 根据当前地址生成由父级到子级排列的面包屑
export function buildBreadcrumbs(pathname: string, routeList: AppRoute[]) {
  const currentPath = normalizePath(pathname);
  return collectNamedRoutes(routeList)
    .filter(({ path }) => {
      return currentPath === path || currentPath.startsWith(`${path}/`);
    })
    .sort(
      (prev, next) => prev.path.split('/').length - next.path.split('/').length,
    );
}

export function buildMenuMeta(menuList?: AuthMenu[] | null) {
  return collectNamedRoutes(transformMenu(menuList));
}
