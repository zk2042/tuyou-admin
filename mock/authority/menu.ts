type MenuType = '目录' | '菜单';

export interface MenuItem {
  id: string;
  menu_name: string;
  parent_name: string | null;
  menu_type: MenuType;
  route_path: string;
  component?: string;
  icon?: string;
  hide_in_menu?: 0 | 1;
  sort: number;
  status: string;
  create_time: string;
  update_time: string;
}

interface MenuQuery {
  menu_name?: string;
  status?: string;
}

interface MenuBody {
  menu_name?: string;
  parent_name?: string | null;
  menu_type?: MenuType;
  route_path?: string;
  component?: string;
  icon?: string;
  hide_in_menu?: boolean;
  sort?: number;
  status?: string;
}

export const menuList: MenuItem[] = [
  {
    id: '1',
    menu_name: '工作台',
    parent_name: null,
    menu_type: '菜单',
    route_path: '/dashboard',
    sort: 1,
    status: '启用',
    create_time: '2026-06-10 08:27:37',
    update_time: '2026-06-17 16:37:50',
  },
  {
    id: '2',
    menu_name: '用户管理',
    parent_name: null,
    menu_type: '目录',
    route_path: '/user',
    sort: 2,
    status: '启用',
    create_time: '2026-06-10 08:30:12',
    update_time: '2026-07-08 10:21:36',
  },
  {
    id: '3',
    menu_name: '会员管理',
    parent_name: '用户管理',
    menu_type: '菜单',
    route_path: '/user/member',
    sort: 1,
    status: '启用',
    create_time: '2026-06-10 08:32:45',
    update_time: '2026-07-18 09:15:28',
  },
  {
    id: '4',
    menu_name: '领队管理',
    parent_name: '用户管理',
    menu_type: '菜单',
    route_path: '/user/leader',
    sort: 2,
    status: '启用',
    create_time: '2026-06-10 08:35:21',
    update_time: '2026-07-20 14:32:16',
  },
  {
    id: '5',
    menu_name: '活动管理',
    parent_name: null,
    menu_type: '菜单',
    route_path: '/activity',
    sort: 3,
    status: '启用',
    create_time: '2026-06-10 08:38:09',
    update_time: '2026-07-25 11:45:02',
  },
  {
    id: '6',
    menu_name: '内容管理',
    parent_name: null,
    menu_type: '目录',
    route_path: '/content',
    sort: 4,
    status: '启用',
    create_time: '2026-06-10 08:41:30',
    update_time: '2026-07-28 16:20:43',
  },
  {
    id: '7',
    menu_name: '笔记管理',
    parent_name: '内容管理',
    menu_type: '菜单',
    route_path: '/content/note',
    sort: 1,
    status: '启用',
    create_time: '2026-06-10 08:44:18',
    update_time: '2026-07-30 13:10:25',
  },
  {
    id: '8',
    menu_name: '攻略管理',
    parent_name: '内容管理',
    menu_type: '菜单',
    route_path: '/content/guide',
    sort: 2,
    status: '启用',
    create_time: '2026-06-10 08:47:56',
    update_time: '2026-08-01 09:36:48',
  },
  {
    id: '9',
    menu_name: '评论管理',
    parent_name: null,
    menu_type: '菜单',
    route_path: '/comment',
    sort: 5,
    status: '禁用',
    create_time: '2026-06-10 08:50:34',
    update_time: '2026-08-02 15:28:19',
  },
  {
    id: '10',
    menu_name: '权限管理',
    parent_name: null,
    menu_type: '目录',
    route_path: '/authority',
    sort: 6,
    status: '启用',
    create_time: '2026-06-10 08:53:12',
    update_time: '2026-08-03 10:42:31',
  },
  {
    id: '11',
    menu_name: '管理员管理',
    parent_name: '权限管理',
    menu_type: '菜单',
    route_path: '/authority/manager',
    sort: 1,
    status: '启用',
    create_time: '2026-06-10 08:56:47',
    update_time: '2026-08-04 11:15:09',
  },
  {
    id: '12',
    menu_name: '角色管理',
    parent_name: '权限管理',
    menu_type: '菜单',
    route_path: '/authority/role',
    sort: 2,
    status: '启用',
    create_time: '2026-06-10 09:00:25',
    update_time: '2026-08-04 13:26:54',
  },
  {
    id: '13',
    menu_name: '菜单管理',
    parent_name: '权限管理',
    menu_type: '菜单',
    route_path: '/authority/menu',
    sort: 3,
    status: '启用',
    create_time: '2026-08-05 09:18:32',
    update_time: '2026-08-05 09:18:32',
  },
  {
    id: '14',
    menu_name: 'API 权限管理',
    parent_name: '权限管理',
    menu_type: '菜单',
    route_path: '/authority/permissions',
    sort: 4,
    status: '启用',
    create_time: '2026-08-11 09:18:32',
    update_time: '2026-08-11 09:18:32',
  },
  {
    id: '15',
    menu_name: '标签管理',
    parent_name: null,
    menu_type: '菜单',
    route_path: '/tag',
    sort: 7,
    status: '启用',
    create_time: '2026-08-11 09:18:32',
    update_time: '2026-08-11 09:18:32',
  },
  {
    id: '16',
    menu_name: '消息管理',
    parent_name: null,
    menu_type: '目录',
    route_path: '/message',
    sort: 8,
    status: '启用',
    create_time: '2026-08-12 09:18:32',
    update_time: '2026-08-12 09:18:32',
  },
  {
    id: '17',
    menu_name: '系统消息',
    parent_name: '消息管理',
    menu_type: '菜单',
    route_path: '/message/system',
    sort: 1,
    status: '启用',
    create_time: '2026-08-12 09:18:32',
    update_time: '2026-08-12 09:18:32',
  },
  {
    id: '18',
    menu_name: '互动消息',
    parent_name: '消息管理',
    menu_type: '菜单',
    route_path: '/message/interact',
    sort: 2,
    status: '启用',
    create_time: '2026-08-12 09:18:32',
    update_time: '2026-08-12 09:18:32',
  },
];

const normalizeBody = <T extends object>(body?: T | string) => {
  if (!body) {
    return {} as T;
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T;
    } catch {
      return {} as T;
    }
  }

  return body;
};

const validBody = (body: MenuBody) => {
  const validType = body.menu_type === '目录' || body.menu_type === '菜单';

  return (
    Boolean(body.menu_name?.trim()) &&
    Object.prototype.hasOwnProperty.call(body, 'parent_name') &&
    validType &&
    Boolean(body.route_path?.trim()) &&
    typeof body.component === 'string' &&
    typeof body.icon === 'string' &&
    typeof body.hide_in_menu === 'boolean' &&
    (body.menu_type === '目录' || Boolean(body.component.trim())) &&
    Number.isInteger(body.sort) &&
    ['启用', '禁用'].includes(body.status || '')
  );
};

const componentMap: Record<string, string> = {
  '/dashboard': './Dashboard',
  '/user/member': './User/Member',
  '/user/leader': './User/Leader',
  '/activity': './Activity',
  '/content/note': './Content/Note',
  '/content/guide': './Content/Guide',
  '/comment': './Comment',
  '/authority/manager': './Authority/Manager',
  '/authority/role': './Authority/Role',
  '/authority/menu': './Authority/Menu',
  '/authority/permissions': './Authority/Permissions',
  '/tag': './Tag',
  '/message/system': './Message/System',
  '/message/interact': './Message/Interact',
};

const iconMap: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/user': 'team',
  '/activity': 'calendar',
  '/content': 'read',
  '/comment': 'comment',
  '/authority': 'safetyCertificate',
  '/tag': 'tag',
  '/message': 'bell',
};

const getParentId = (item: MenuItem) => {
  if (!item.parent_name) return '0';
  return (
    menuList.find((menu) => menu.menu_name === item.parent_name)?.id || '0'
  );
};

const toResponse = (item: MenuItem): any => ({
  id: item.id,
  menu_name: item.menu_name,
  parent_id: getParentId(item),
  parent_name: item.parent_name || '',
  menu_type: item.menu_type === '目录' ? 1 : 2,
  menu_type_name: item.menu_type,
  route_path: item.route_path,
  component: item.component ?? componentMap[item.route_path] ?? '',
  icon: item.icon ?? iconMap[item.route_path] ?? '',
  hide_in_menu: item.hide_in_menu ?? 0,
  sort: item.sort,
  status: item.status,
  create_time: item.create_time.slice(0, 10),
  children: [],
});

const buildTree = (source: MenuItem[]) => {
  const matched = new Set(source.map((item) => item.id));
  const nodes = new Map(source.map((item) => [item.id, toResponse(item)]));
  const roots: any[] = [];

  source.forEach((item) => {
    const node = nodes.get(item.id);
    const parentId = getParentId(item);
    if (parentId !== '0' && matched.has(parentId)) {
      nodes.get(parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sort = (list: any[]) => {
    list.sort((a, b) => a.sort - b.sort);
    list.forEach((item) => sort(item.children));
    return list;
  };

  return sort(roots);
};

const filterTree = (list: any[], name?: string, status?: string): any[] => {
  return list.reduce<any[]>((result, item) => {
    const children = filterTree(item.children, name, status);
    const matched =
      (!name || item.menu_name.toLowerCase().includes(name)) &&
      (!status || item.status === status);

    if (matched || children.length) {
      result.push({ ...item, children });
    }

    return result;
  }, []);
};

const formatTime = () => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
};

const listHandler = (req: any, res: any) => {
  const query = (req.query || {}) as MenuQuery;
  const name = query.menu_name?.trim().toLowerCase();

  res.json({
    code: 0,
    message: '成功',
    data: filterTree(buildTree(menuList), name, query.status),
  });
};

const parentListHandler = (_req: any, res: any) => {
  res.json({
    code: 0,
    message: '成功',
    data: menuList
      .filter((item) => item.parent_name === null)
      .sort((prev, next) => prev.sort - next.sort)
      .map((item) => ({
        id: item.id,
        menu_name: item.menu_name,
      })),
  });
};

const createHandler = (req: any, res: any) => {
  const body = normalizeBody<MenuBody>(req.body);

  if (!validBody(body)) {
    res.json({
      code: 400,
      message: '缺少必要参数',
      data: null,
    });
    return;
  }

  const menuName = body.menu_name!.trim();
  const exists = menuList.some((item) => item.menu_name === menuName);

  if (exists) {
    res.json({
      code: 400,
      message: '菜单名称已存在',
      data: null,
    });
    return;
  }

  const now = formatTime();
  const created: MenuItem = {
    id: String(
      menuList.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1,
    ),
    menu_name: menuName,
    parent_name: body.parent_name?.trim() || null,
    menu_type: body.menu_type!,
    route_path: body.route_path!.trim(),
    component: body.component!.trim(),
    icon: body.icon!.trim(),
    hide_in_menu: body.hide_in_menu ? 1 : 0,
    sort: body.sort!,
    status: body.status!,
    create_time: now,
    update_time: now,
  };

  menuList.unshift(created);

  res.json({
    code: 0,
    message: '新增菜单成功',
    data: toResponse(created),
  });
};

const editHandler = (req: any, res: any) => {
  const body = normalizeBody<MenuBody>(req.body);
  const current = menuList.find((item) => item.id === String(req.params.id));

  if (!current) {
    res.json({
      code: 404,
      message: '菜单不存在',
      data: null,
    });
    return;
  }

  if (!validBody(body)) {
    res.json({
      code: 400,
      message: '缺少必要参数',
      data: null,
    });
    return;
  }

  const menuName = body.menu_name!.trim();
  const exists = menuList.some(
    (item) => item.id !== current.id && item.menu_name === menuName,
  );

  if (exists) {
    res.json({
      code: 400,
      message: '菜单名称已存在',
      data: null,
    });
    return;
  }

  current.menu_name = menuName;
  current.parent_name = body.parent_name?.trim() || null;
  current.menu_type = body.menu_type!;
  current.route_path = body.route_path!.trim();
  current.component = body.component!.trim();
  current.icon = body.icon!.trim();
  current.hide_in_menu = body.hide_in_menu ? 1 : 0;
  current.sort = body.sort!;
  current.status = body.status!;
  current.update_time = formatTime();

  res.json({
    code: 0,
    message: '编辑菜单成功',
    data: toResponse(current),
  });
};

const deleteHandler = (req: any, res: any) => {
  const index = menuList.findIndex((item) => item.id === String(req.params.id));

  if (index < 0) {
    res.json({
      code: 404,
      message: '菜单不存在',
      data: null,
    });
    return;
  }

  menuList.splice(index, 1);

  res.json({
    code: 0,
    message: '删除菜单成功',
    data: null,
  });
};

export default {
  'GET /__mock/api/v1/admin/menus/all': parentListHandler,
  'GET /admin/menus/all': parentListHandler,
  'GET /__mock/api/v1/admin/menus': listHandler,
  'GET /admin/menus': listHandler,
  'POST /__mock/api/v1/admin/menus': createHandler,
  'POST /admin/menus': createHandler,
  'PUT /__mock/api/v1/admin/menus/:id': editHandler,
  'PUT /admin/menus/:id': editHandler,
  'DELETE /__mock/api/v1/admin/menus/:id': deleteHandler,
  'DELETE /admin/menus/:id': deleteHandler,
};
