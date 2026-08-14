export interface PermItem {
  id: string;
  perm_name: string;
  module: string;
  perm_key: string;
  status: string;
  request_method: string;
  api_path: string;
}

interface PermQuery {
  page?: string | number;
  size?: string | number;
  perm_name?: string;
  module?: string;
  status?: string;
}

type PermBody = Partial<Omit<PermItem, 'id'>>;

type PermSeed = [string, string, string, string, string];

const seeds: PermSeed[] = [
  ['查看工作台', '工作台', 'workbench:view', 'GET', '/admin/workbench'],
  ['获取个人信息', '认证模块', 'auth:me', 'GET', '/admin/auth/me'],
  [
    '修改个人资料',
    '个人中心',
    'center:profile',
    'PUT',
    '/admin/center/profile',
  ],
  ['修改账号密码', '个人中心', 'auth:password', 'PUT', '/admin/auth/password'],
  ['修改个人头像', '个人中心', 'center:avatar', 'PUT', '/admin/center/avatar'],
  [
    '查询消息列表',
    '个人中心',
    'center:notification:list',
    'GET',
    '/admin/center/notifications',
  ],
  [
    '查询未读消息',
    '个人中心',
    'center:notification:unread',
    'GET',
    '/admin/center/notifications/unread',
  ],
  [
    '订阅消息通知',
    '个人中心',
    'center:notification:stream',
    'GET',
    '/admin/center/notifications/stream',
  ],
  [
    '全部标记已读',
    '个人中心',
    'center:notification:read-all',
    'PUT',
    '/admin/center/notifications/read-all',
  ],
  [
    '标记消息已读',
    '个人中心',
    'center:notification:read',
    'PUT',
    '/admin/center/notifications/:id/read',
  ],
  [
    '删除消息',
    '个人中心',
    'center:notification:delete',
    'DELETE',
    '/admin/center/notifications/:id',
  ],
  [
    '清空消息',
    '个人中心',
    'center:notification:clear',
    'DELETE',
    '/admin/center/notifications',
  ],
  ['批量上传图片', '公共服务', 'upload:image:batch', 'POST', '/upload/images'],
  ['查询会员列表', '用户管理', 'member:list', 'GET', '/admin/members'],
  ['查看会员详情', '用户管理', 'member:detail', 'GET', '/admin/members/:id'],
  ['编辑会员', '用户管理', 'member:edit', 'PUT', '/admin/members/:id'],
  ['删除会员', '用户管理', 'member:delete', 'DELETE', '/admin/members/:id'],
  [
    '批量删除会员',
    '用户管理',
    'member:batch-delete',
    'POST',
    '/admin/members/batch-delete',
  ],
  [
    '批量修改会员状态',
    '用户管理',
    'member:batch-status',
    'PUT',
    '/admin/members/batch-status',
  ],
  ['导出会员', '用户管理', 'member:export', 'GET', '/admin/members/export'],
  ['查询领队列表', '用户管理', 'leader:list', 'GET', '/admin/leaders'],
  ['查看领队详情', '用户管理', 'leader:detail', 'GET', '/admin/leaders/:id'],
  ['编辑领队', '用户管理', 'leader:edit', 'PUT', '/admin/leaders/:id'],
  ['删除领队', '用户管理', 'leader:delete', 'DELETE', '/admin/leaders/:id'],
  [
    '批量删除领队',
    '用户管理',
    'leader:batch-delete',
    'POST',
    '/admin/leaders/batch-delete',
  ],
  [
    '批量修改领队状态',
    '用户管理',
    'leader:batch-status',
    'PUT',
    '/admin/leaders/batch-status',
  ],
  ['导出领队', '用户管理', 'leader:export', 'GET', '/admin/leaders/export'],
  ['查询活动列表', '活动管理', 'activity:list', 'GET', '/admin/activities'],
  [
    '查看活动详情',
    '活动管理',
    'activity:detail',
    'GET',
    '/admin/activities/:id',
  ],
  ['新增活动', '活动管理', 'activity:create', 'POST', '/admin/activities'],
  ['编辑活动', '活动管理', 'activity:edit', 'PUT', '/admin/activities/:id'],
  [
    '删除活动',
    '活动管理',
    'activity:delete',
    'DELETE',
    '/admin/activities/:id',
  ],
  [
    '批量删除活动',
    '活动管理',
    'activity:batch-delete',
    'POST',
    '/admin/activities/batch-delete',
  ],
  [
    '导出活动',
    '活动管理',
    'activity:export',
    'POST',
    '/admin/activities/export',
  ],
  [
    '查询领队选项',
    '活动管理',
    'activity:leader:list',
    'GET',
    '/admin/leadernames',
  ],
  ['查询笔记列表', '内容管理', 'note:list', 'GET', '/admin/notes'],
  ['查看笔记详情', '内容管理', 'note:detail', 'GET', '/admin/notes/:id'],
  ['编辑笔记', '内容管理', 'note:edit', 'PUT', '/admin/notes/:id'],
  ['删除笔记', '内容管理', 'note:delete', 'DELETE', '/admin/notes/:id'],
  [
    '批量删除笔记',
    '内容管理',
    'note:batch-delete',
    'POST',
    '/admin/notes/batch-delete',
  ],
  ['导出笔记', '内容管理', 'note:export', 'POST', '/admin/notes/export'],
  ['查询攻略列表', '内容管理', 'guide:list', 'GET', '/admin/guides'],
  ['查看攻略详情', '内容管理', 'guide:detail', 'GET', '/admin/guides/:id'],
  ['编辑攻略', '内容管理', 'guide:edit', 'PUT', '/admin/guides/:id'],
  ['删除攻略', '内容管理', 'guide:delete', 'DELETE', '/admin/guides/:id'],
  [
    '批量删除攻略',
    '内容管理',
    'guide:batch-delete',
    'POST',
    '/admin/guides/batch-delete',
  ],
  ['导出攻略', '内容管理', 'guide:export', 'POST', '/admin/guides/export'],
  ['查询评论列表', '评论管理', 'comment:list', 'GET', '/admin/comments'],
  ['查看评论详情', '评论管理', 'comment:detail', 'GET', '/admin/comments/:id'],
  ['删除评论', '评论管理', 'comment:delete', 'DELETE', '/admin/comments/:id'],
  [
    '批量删除评论',
    '评论管理',
    'comment:batch-delete',
    'POST',
    '/admin/comments/batch-delete',
  ],
  ['查询管理员列表', '权限管理', 'manager:list', 'GET', '/admin/admins'],
  ['新增管理员', '权限管理', 'manager:create', 'POST', '/admin/admins'],
  ['编辑管理员', '权限管理', 'manager:edit', 'PUT', '/admin/admins/:id'],
  ['删除管理员', '权限管理', 'manager:delete', 'DELETE', '/admin/admins/:id'],
  [
    '重置管理员密码',
    '权限管理',
    'manager:reset-password',
    'PUT',
    '/admin/admins/:id/reset-password',
  ],
  [
    '查询管理员角色选项',
    '权限管理',
    'manager:role:list',
    'GET',
    '/admin/admins/role',
  ],
  ['查询角色列表', '权限管理', 'role:list', 'GET', '/admin/roles'],
  ['新增角色', '权限管理', 'role:create', 'POST', '/admin/roles'],
  ['编辑角色', '权限管理', 'role:edit', 'PUT', '/admin/roles/:id'],
  ['删除角色', '权限管理', 'role:delete', 'DELETE', '/admin/roles/:id'],
  [
    '查询角色菜单',
    '权限管理',
    'role:menu:list',
    'GET',
    '/admin/roles/:id/menus',
  ],
  [
    '查询角色接口权限',
    '权限管理',
    'role:permission:list',
    'GET',
    '/admin/roles/:id/permissions',
  ],
  [
    '分配角色权限',
    '权限管理',
    'role:permission:assign',
    'PUT',
    '/admin/roles/:id/permissions',
  ],
  ['查询菜单列表', '权限管理', 'menu:list', 'GET', '/admin/menus'],
  ['新增菜单', '权限管理', 'menu:create', 'POST', '/admin/menus'],
  ['编辑菜单', '权限管理', 'menu:edit', 'PUT', '/admin/menus/:id'],
  ['删除菜单', '权限管理', 'menu:delete', 'DELETE', '/admin/menus/:id'],
  [
    '查询API权限列表',
    '权限管理',
    'permission:list',
    'GET',
    '/admin/api-permissions',
  ],
  [
    '新增API权限',
    '权限管理',
    'permission:create',
    'POST',
    '/admin/api-permissions',
  ],
  [
    '编辑API权限',
    '权限管理',
    'permission:edit',
    'PUT',
    '/admin/api-permissions/:id',
  ],
  [
    '删除API权限',
    '权限管理',
    'permission:delete',
    'DELETE',
    '/admin/api-permissions/:id',
  ],
  ['查询标签列表', '标签管理', 'tag:list', 'GET', '/admin/tags'],
  ['新增标签', '标签管理', 'tag:create', 'POST', '/admin/tags'],
  ['编辑标签', '标签管理', 'tag:edit', 'PUT', '/admin/tags/:id'],
  ['删除标签', '标签管理', 'tag:delete', 'DELETE', '/admin/tags/:id'],
  [
    '批量删除标签',
    '标签管理',
    'tag:batch-delete',
    'POST',
    '/admin/tags/batch-delete',
  ],
  [
    '查询互动消息列表',
    '消息管理',
    'message:interact:list',
    'GET',
    '/admin/messages/interactions',
  ],
  [
    '删除互动消息',
    '消息管理',
    'message:interact:delete',
    'DELETE',
    '/admin/messages/:id',
  ],
  [
    '查询系统消息列表',
    '消息管理',
    'message:system:list',
    'GET',
    '/admin/messages/system',
  ],
  [
    '发送系统消息',
    '消息管理',
    'message:system:send',
    'POST',
    '/admin/messages/system',
  ],
  [
    '删除系统消息',
    '消息管理',
    'message:system:delete',
    'DELETE',
    '/admin/messages/:id',
  ],
];

export const permList: PermItem[] = seeds.map(
  ([perm_name, module, perm_key, request_method, api_path], index) => ({
    id: String(index + 1),
    perm_name,
    module,
    perm_key,
    status: '启用',
    request_method,
    api_path,
  }),
);

const includesText = (source: string, keyword?: string) => {
  if (!keyword) {
    return true;
  }

  return source.toLowerCase().includes(keyword.trim().toLowerCase());
};

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

const isValidBody = (body: PermBody): body is Omit<PermItem, 'id'> => {
  return Boolean(
    body.perm_name &&
      body.module &&
      body.perm_key &&
      body.request_method &&
      body.api_path &&
      ['启用', '禁用'].includes(body.status || ''),
  );
};

const pageResult = (query: PermQuery) => {
  const page = Math.max(Number(query.page || 1), 1);
  const size = Math.max(Number(query.size || 10), 1);
  const filtered = permList.filter((item) => {
    return (
      includesText(item.perm_name, query.perm_name) &&
      includesText(item.module, query.module) &&
      (!query.status || item.status === query.status)
    );
  });
  const start = (page - 1) * size;

  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      page,
      size,
      total_page: Math.ceil(filtered.length / size) || 1,
      list: filtered.slice(start, start + size),
    },
  };
};

const listHandler = (req: any, res: any) => {
  res.json(pageResult(req.query || {}));
};

const createHandler = (req: any, res: any) => {
  const body = normalizeBody<PermBody>(req.body);

  if (!isValidBody(body)) {
    res.json({ code: 400, message: '缺少必要参数', data: null });
    return;
  }

  if (permList.some((item) => item.perm_key === body.perm_key)) {
    res.json({ code: 400, message: '权限标识已存在', data: null });
    return;
  }

  const created: PermItem = {
    id: String(
      permList.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1,
    ),
    ...body,
    request_method: body.request_method.toUpperCase(),
  };

  permList.unshift(created);
  res.json({ code: 0, message: '新增 API 权限成功', data: created });
};

const editHandler = (req: any, res: any) => {
  const body = normalizeBody<PermBody>(req.body);
  const current = permList.find((item) => item.id === String(req.params.id));

  if (!current) {
    res.json({ code: 404, message: 'API 权限不存在', data: null });
    return;
  }

  if (!isValidBody(body)) {
    res.json({ code: 400, message: '缺少必要参数', data: null });
    return;
  }

  if (
    permList.some(
      (item) => item.id !== current.id && item.perm_key === body.perm_key,
    )
  ) {
    res.json({ code: 400, message: '权限标识已存在', data: null });
    return;
  }

  Object.assign(current, body, {
    request_method: body.request_method.toUpperCase(),
  });
  res.json({ code: 0, message: '编辑 API 权限成功', data: current });
};

const deleteHandler = (req: any, res: any) => {
  const index = permList.findIndex((item) => item.id === String(req.params.id));

  if (index < 0) {
    res.json({ code: 404, message: 'API 权限不存在', data: null });
    return;
  }

  permList.splice(index, 1);
  res.json({ code: 0, message: '删除 API 权限成功', data: null });
};

const moduleHandler = (_req: any, res: any) => {
  const names = [
    '上传模块',
    '个人中心',
    '内容模块',
    '工作台',
    '权限模块',
    '活动模块',
    '用户模块',
    '认证模块',
    '评论模块',
    '标签管理',
    '消息管理',
  ];

  res.json({
    code: 0,
    message: '成功',
    data: names.map((name, index) => ({ id: String(index + 1), name })),
  });
};

export default {
  'GET /__mock/api/v1/admin/api-permissions/module': moduleHandler,
  'GET /admin/api-permissions/module': moduleHandler,
  'GET /__mock/api/v1/admin/api-permissions': listHandler,
  'GET /admin/api-permissions': listHandler,
  'POST /__mock/api/v1/admin/api-permissions': createHandler,
  'POST /admin/api-permissions': createHandler,
  'PUT /__mock/api/v1/admin/api-permissions/:id': editHandler,
  'PUT /admin/api-permissions/:id': editHandler,
  'DELETE /__mock/api/v1/admin/api-permissions/:id': deleteHandler,
  'DELETE /admin/api-permissions/:id': deleteHandler,
};
