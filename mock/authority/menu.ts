type MenuType = '目录' | '菜单';

interface MenuItem {
  id: string;
  menu_name: string;
  parent_name: string | null;
  menu_type: MenuType;
  route_path: string;
  sort: number;
  status: string;
  create_time: string;
  update_time: string;
}

interface MenuQuery {
  page?: string | number;
  size?: string | number;
  menu_name?: string;
  status?: string;
}

interface MenuBody {
  menu_name?: string;
  parent_name?: string | null;
  menu_type?: MenuType;
  route_path?: string;
  sort?: number;
  status?: string;
}

const menuList: MenuItem[] = [
  {
    id: '1',
    menu_name: '工作台',
    parent_name: null,
    menu_type: '目录',
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
    menu_type: '目录',
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
    menu_type: '目录',
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
  const validParent =
    body.menu_type === '目录'
      ? body.parent_name === null
      : Boolean(body.parent_name?.trim());

  return (
    Boolean(body.menu_name?.trim()) &&
    Object.prototype.hasOwnProperty.call(body, 'parent_name') &&
    validType &&
    validParent &&
    Boolean(body.route_path?.trim()) &&
    Number.isInteger(body.sort) &&
    ['启用', '禁用'].includes(body.status || '')
  );
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
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const name = query.menu_name?.trim().toLowerCase();
  const filtered = menuList.filter((item) => {
    return (
      (!name || item.menu_name.toLowerCase().includes(name)) &&
      (!query.status || item.status === query.status)
    );
  });
  const start = (page - 1) * size;

  res.json({
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      page,
      size,
      total_page: Math.ceil(filtered.length / size) || 1,
      list: filtered.slice(start, start + size),
    },
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
    sort: body.sort!,
    status: body.status!,
    create_time: now,
    update_time: now,
  };

  menuList.unshift(created);

  res.json({
    code: 0,
    message: '新增菜单成功',
    data: created,
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
  current.sort = body.sort!;
  current.status = body.status!;
  current.update_time = formatTime();

  res.json({
    code: 0,
    message: '编辑菜单成功',
    data: current,
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
  'GET /api/v1/admin/menus': listHandler,
  'GET /admin/menus': listHandler,
  'POST /api/v1/admin/menus': createHandler,
  'POST /admin/menus': createHandler,
  'PUT /api/v1/admin/menus/:id': editHandler,
  'PUT /admin/menus/:id': editHandler,
  'DELETE /api/v1/admin/menus/:id': deleteHandler,
  'DELETE /admin/menus/:id': deleteHandler,
};
