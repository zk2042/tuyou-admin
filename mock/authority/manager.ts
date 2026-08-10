interface ManagerItem {
  id: string;
  username: string;
  adminname: string;
  role: string;
  status: string;
  create_time: string;
  last_login: string;
}

interface ManagerQuery {
  page?: string | number;
  size?: string | number;
  username?: string;
  role?: string;
  status?: string;
}

interface ManagerCreateBody {
  username?: string;
  adminname?: string;
  password?: string;
  role?: string;
}

interface ManagerEditBody {
  username?: string;
  adminname?: string;
  role?: string;
  status?: string;
}

interface ManagerResetPasswordBody {
  new_password?: string;
}

const managerList: ManagerItem[] = [
  {
    id: '1',
    username: 'content',
    adminname: '张三',
    role: '内容管理员',
    status: '启用',
    create_time: '2025-02-15 10:00:00',
    last_login: '2026-07-19 14:20:00',
  },
  {
    id: '2',
    username: 'operate',
    adminname: '李敏',
    role: '运营专员',
    status: '启用',
    create_time: '2025-02-18 09:30:00',
    last_login: '2026-07-28 09:12:00',
  },
  {
    id: '3',
    username: 'user_admin',
    adminname: '王琪',
    role: '用户管理员',
    status: '禁用',
    create_time: '2025-03-02 15:40:00',
    last_login: '2026-07-10 16:35:00',
  },
  {
    id: '4',
    username: 'audit',
    adminname: '陈璐',
    role: '内容管理员',
    status: '启用',
    create_time: '2025-03-16 11:25:00',
    last_login: '2026-07-30 18:42:00',
  },
  {
    id: '5',
    username: 'activity_ops',
    adminname: '周航',
    role: '活动管理员',
    status: '禁用',
    create_time: '2025-03-20 13:00:00',
    last_login: '2026-07-01 09:50:00',
  },
  {
    id: '6',
    username: 'service',
    adminname: '吴迪',
    role: '用户管理员',
    status: '启用',
    create_time: '2025-04-01 09:15:00',
    last_login: '2026-07-31 12:18:00',
  },
];

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

const pageResult = (query: ManagerQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = managerList.filter((item) => {
    return (
      includesText(item.username, query.username) &&
      (!query.role || item.role === query.role) &&
      (!query.status || item.status === query.status)
    );
  });
  const start = (page - 1) * size;
  const list = filtered.slice(start, start + size);

  return {
    code: 0,
    message: 'success',
    data: {
      total: filtered.length,
      page,
      size,
      total_page: Math.ceil(filtered.length / size) || 1,
      list,
    },
  };
};

const listHandler = (req: any, res: any) => {
  res.json(pageResult(req.query || {}));
};

const roleHandler = (_req: any, res: any) => {
  res.json({
    code: 0,
    message: '成功',
    data: [
      { id: 1, role_name: '超级管理员' },
      { id: 2, role_name: '内容管理员' },
      { id: 3, role_name: '普通管理员' },
    ],
  });
};

const createHandler = (req: any, res: any) => {
  const body = normalizeBody<ManagerCreateBody>(req.body);

  if (!body.username || !body.adminname || !body.password || !body.role) {
    res.json({
      code: 400,
      message: '缺少必要参数',
      data: null,
    });
    return;
  }

  const exists = managerList.some((item) => item.username === body.username);

  if (exists) {
    res.json({
      code: 400,
      message: '登录账号已存在',
      data: null,
    });
    return;
  }

  const nextId = String(
    managerList.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1,
  );
  const created: ManagerItem = {
    id: nextId,
    username: body.username,
    adminname: body.adminname,
    role: body.role,
    status: '启用',
    create_time: '2026-08-03 10:00:00',
    last_login: '-',
  };

  managerList.unshift(created);

  res.json({
    code: 0,
    message: 'success',
    data: created,
  });
};

const editHandler = (req: any, res: any) => {
  const body = normalizeBody<ManagerEditBody>(req.body);
  const current = managerList.find((item) => item.id === String(req.params.id));
  const status = body.status;

  if (!current) {
    res.json({
      code: 404,
      message: '数据不存在',
      data: null,
    });
    return;
  }

  if (
    !body.username ||
    !body.adminname ||
    !body.role ||
    (status !== '启用' && status !== '禁用')
  ) {
    res.json({
      code: 400,
      message: '缺少必要参数',
      data: null,
    });
    return;
  }

  const exists = managerList.some(
    (item) => item.id !== current.id && item.username === body.username,
  );

  if (exists) {
    res.json({
      code: 400,
      message: '登录账号已存在',
      data: null,
    });
    return;
  }

  current.username = body.username;
  current.adminname = body.adminname;
  current.role = body.role;
  current.status = status;

  res.json({
    code: 0,
    message: 'success',
    data: current,
  });
};

const deleteHandler = (req: any, res: any) => {
  const index = managerList.findIndex(
    (item) => item.id === String(req.params.id),
  );

  if (index < 0) {
    res.json({
      code: 404,
      message: '数据不存在',
      data: null,
    });
    return;
  }

  managerList.splice(index, 1);

  res.json({
    code: 0,
    message: '删除成功',
    data: null,
  });
};

const resetPasswordHandler = (req: any, res: any) => {
  const body = normalizeBody<ManagerResetPasswordBody>(req.body);
  const current = managerList.find((item) => item.id === String(req.params.id));

  if (!current) {
    res.json({
      code: 404,
      message: '数据不存在',
      data: null,
    });
    return;
  }

  if (!body.new_password) {
    res.json({
      code: 400,
      message: '请输入新密码',
      data: null,
    });
    return;
  }

  res.json({
    code: 0,
    message: `已重置 ${current.username} 的密码`,
    data: null,
  });
};

export default {
  'GET /api/v1/admin/admins/role': roleHandler,
  'GET /admin/admins/role': roleHandler,
  'GET /api/v1/admin/admins': listHandler,
  'GET /admin/admins': listHandler,
  'POST /api/v1/admin/admins': createHandler,
  'POST /admin/admins': createHandler,
  'PUT /api/v1/admin/admins/:id': editHandler,
  'PUT /admin/admins/:id': editHandler,
  'DELETE /api/v1/admin/admins/:id': deleteHandler,
  'DELETE /admin/admins/:id': deleteHandler,
  'PUT /api/v1/admin/admins/:id/reset-password': resetPasswordHandler,
  'PUT /admin/admins/:id/reset-password': resetPasswordHandler,
};
