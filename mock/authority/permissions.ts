interface PermItem {
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
  ['查看当前账号', '个人中心', 'admin:center:me', 'GET', '/admin/auth/me'],
  [
    '修改账号密码',
    '个人中心',
    'admin:center:password',
    'PUT',
    '/admin/auth/password',
  ],
  [
    '修改个人资料',
    '个人中心',
    'admin:center:profile',
    'PUT',
    '/admin/center/profile',
  ],
  [
    '修改个人头像',
    '个人中心',
    'admin:center:avatar',
    'PUT',
    '/admin/center/avatar',
  ],
  [
    '查询消息列表',
    '个人中心',
    'admin:center:notice:list',
    'GET',
    '/admin/center/notifications',
  ],
  [
    '查询未读消息',
    '个人中心',
    'admin:center:notice:unread',
    'GET',
    '/admin/center/notifications/unread',
  ],
  [
    '全部标记已读',
    '个人中心',
    'admin:center:notice:read-all',
    'PUT',
    '/admin/center/notifications/read-all',
  ],
  [
    '标记消息已读',
    '个人中心',
    'admin:center:notice:read',
    'PUT',
    '/admin/center/notifications/:id/read',
  ],
  [
    '删除消息',
    '个人中心',
    'admin:center:notice:delete',
    'DELETE',
    '/admin/center/notifications/:id',
  ],
  [
    '清空消息',
    '个人中心',
    'admin:center:notice:clear',
    'DELETE',
    '/admin/center/notifications',
  ],
  [
    '查询会员列表',
    '用户管理',
    'admin:user:member:list',
    'GET',
    '/admin/members',
  ],
  [
    '查看会员详情',
    '用户管理',
    'admin:user:member:detail',
    'GET',
    '/admin/members/:id',
  ],
  [
    '编辑会员',
    '用户管理',
    'admin:user:member:edit',
    'PUT',
    '/admin/members/:id',
  ],
  [
    '删除会员',
    '用户管理',
    'admin:user:member:delete',
    'DELETE',
    '/admin/members/:id',
  ],
  [
    '批量删除会员',
    '用户管理',
    'admin:user:member:batch-delete',
    'POST',
    '/admin/members/batch-delete',
  ],
  [
    '批量修改会员状态',
    '用户管理',
    'admin:user:member:batch-status',
    'PUT',
    '/admin/members/batch-status',
  ],
  [
    '导出会员',
    '用户管理',
    'admin:user:member:export',
    'GET',
    '/admin/members/export',
  ],
  [
    '查询领队列表',
    '用户管理',
    'admin:user:leader:list',
    'GET',
    '/admin/leaders',
  ],
  [
    '查看领队详情',
    '用户管理',
    'admin:user:leader:detail',
    'GET',
    '/admin/leaders/:id',
  ],
  [
    '编辑领队',
    '用户管理',
    'admin:user:leader:edit',
    'PUT',
    '/admin/leaders/:id',
  ],
  [
    '删除领队',
    '用户管理',
    'admin:user:leader:delete',
    'DELETE',
    '/admin/leaders/:id',
  ],
  [
    '批量删除领队',
    '用户管理',
    'admin:user:leader:batch-delete',
    'POST',
    '/admin/leaders/batch-delete',
  ],
  [
    '批量修改领队状态',
    '用户管理',
    'admin:user:leader:batch-status',
    'PUT',
    '/admin/leaders/batch-status',
  ],
  [
    '导出领队',
    '用户管理',
    'admin:user:leader:export',
    'GET',
    '/admin/leaders/export',
  ],
  [
    '查询活动列表',
    '活动管理',
    'admin:activity:list',
    'GET',
    '/admin/activities',
  ],
  [
    '查看活动详情',
    '活动管理',
    'admin:activity:detail',
    'GET',
    '/admin/activities/:id',
  ],
  [
    '新增活动',
    '活动管理',
    'admin:activity:create',
    'POST',
    '/admin/activities',
  ],
  [
    '编辑活动',
    '活动管理',
    'admin:activity:edit',
    'PUT',
    '/admin/activities/:id',
  ],
  [
    '删除活动',
    '活动管理',
    'admin:activity:delete',
    'DELETE',
    '/admin/activities/:id',
  ],
  [
    '批量删除活动',
    '活动管理',
    'admin:activity:batch-delete',
    'POST',
    '/admin/activities/batch-delete',
  ],
  [
    '导出活动',
    '活动管理',
    'admin:activity:export',
    'POST',
    '/admin/activities/export',
  ],
  [
    '查询领队选项',
    '活动管理',
    'admin:activity:leader:list',
    'GET',
    '/admin/leadernames',
  ],
  [
    '上传活动图片',
    '活动管理',
    'admin:activity:image:upload',
    'POST',
    '/admin/upload/image',
  ],
  [
    '查询笔记列表',
    '内容管理',
    'admin:content:note:list',
    'GET',
    '/admin/notes',
  ],
  [
    '查看笔记详情',
    '内容管理',
    'admin:content:note:detail',
    'GET',
    '/admin/notes/:id',
  ],
  [
    '编辑笔记',
    '内容管理',
    'admin:content:note:edit',
    'PUT',
    '/admin/notes/:id',
  ],
  [
    '删除笔记',
    '内容管理',
    'admin:content:note:delete',
    'DELETE',
    '/admin/notes/:id',
  ],
  [
    '批量删除笔记',
    '内容管理',
    'admin:content:note:batch-delete',
    'POST',
    '/admin/notes/batch-delete',
  ],
  [
    '导出笔记',
    '内容管理',
    'admin:content:note:export',
    'POST',
    '/admin/notes/export',
  ],
  [
    '查询攻略列表',
    '内容管理',
    'admin:content:guide:list',
    'GET',
    '/admin/guides',
  ],
  [
    '查看攻略详情',
    '内容管理',
    'admin:content:guide:detail',
    'GET',
    '/admin/guides/:id',
  ],
  [
    '编辑攻略',
    '内容管理',
    'admin:content:guide:edit',
    'PUT',
    '/admin/guides/:id',
  ],
  [
    '删除攻略',
    '内容管理',
    'admin:content:guide:delete',
    'DELETE',
    '/admin/guides/:id',
  ],
  [
    '批量删除攻略',
    '内容管理',
    'admin:content:guide:batch-delete',
    'POST',
    '/admin/guides/batch-delete',
  ],
  [
    '导出攻略',
    '内容管理',
    'admin:content:guide:export',
    'POST',
    '/admin/guides/export',
  ],
  ['查询评论列表', '评论管理', 'admin:comment:list', 'GET', '/admin/comments'],
  [
    '查看评论详情',
    '评论管理',
    'admin:comment:detail',
    'GET',
    '/admin/comments/:id',
  ],
  [
    '删除评论',
    '评论管理',
    'admin:comment:delete',
    'DELETE',
    '/admin/comments/:id',
  ],
  [
    '批量删除评论',
    '评论管理',
    'admin:comment:batch-delete',
    'POST',
    '/admin/comments/batch-delete',
  ],
  [
    '查询管理员列表',
    '权限管理',
    'admin:authority:manager:list',
    'GET',
    '/admin/admins',
  ],
  [
    '新增管理员',
    '权限管理',
    'admin:authority:manager:create',
    'POST',
    '/admin/admins',
  ],
  [
    '编辑管理员',
    '权限管理',
    'admin:authority:manager:edit',
    'PUT',
    '/admin/admins/:id',
  ],
  [
    '删除管理员',
    '权限管理',
    'admin:authority:manager:delete',
    'DELETE',
    '/admin/admins/:id',
  ],
  [
    '重置管理员密码',
    '权限管理',
    'admin:authority:manager:reset-password',
    'PUT',
    '/admin/admins/:id/reset-password',
  ],
  [
    '查询角色列表',
    '权限管理',
    'admin:authority:role:list',
    'GET',
    '/admin/roles',
  ],
  [
    '新增角色',
    '权限管理',
    'admin:authority:role:create',
    'POST',
    '/admin/roles',
  ],
  [
    '编辑角色',
    '权限管理',
    'admin:authority:role:edit',
    'PUT',
    '/admin/roles/:id',
  ],
  [
    '删除角色',
    '权限管理',
    'admin:authority:role:delete',
    'DELETE',
    '/admin/roles/:id',
  ],
  [
    '查询菜单列表',
    '权限管理',
    'admin:authority:menu:list',
    'GET',
    '/admin/menus',
  ],
  [
    '新增菜单',
    '权限管理',
    'admin:authority:menu:create',
    'POST',
    '/admin/menus',
  ],
  [
    '编辑菜单',
    '权限管理',
    'admin:authority:menu:edit',
    'PUT',
    '/admin/menus/:id',
  ],
  [
    '删除菜单',
    '权限管理',
    'admin:authority:menu:delete',
    'DELETE',
    '/admin/menus/:id',
  ],
  [
    '查询API权限列表',
    '权限管理',
    'admin:authority:permission:list',
    'GET',
    '/admin/api-permissions',
  ],
];

const permList: PermItem[] = seeds.map(
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

export default {
  'GET /api/v1/admin/api-permissions': listHandler,
  'GET /admin/api-permissions': listHandler,
  'POST /api/v1/admin/api-permissions': createHandler,
  'POST /admin/api-permissions': createHandler,
  'PUT /api/v1/admin/api-permissions/:id': editHandler,
  'PUT /admin/api-permissions/:id': editHandler,
  'DELETE /api/v1/admin/api-permissions/:id': deleteHandler,
  'DELETE /admin/api-permissions/:id': deleteHandler,
};
