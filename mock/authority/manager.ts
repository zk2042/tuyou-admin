interface ManagerItem {
  id: string;
  username: string;
  adminname: string;
  role: string;
  status: boolean;
  create_time: string;
  last_login: string;
}

interface ManagerQuery {
  page?: string | number;
  size?: string | number;
  username?: string;
  role?: string;
  status?: string | boolean;
}

const managerList: ManagerItem[] = [
  {
    id: '1',
    username: 'content',
    adminname: '张三',
    role: '内容管理员',
    status: true,
    create_time: '2025-02-15 10:00:00',
    last_login: '2026-07-19 14:20:00',
  },
  {
    id: '2',
    username: 'operate',
    adminname: '李敏',
    role: '活动管理员',
    status: true,
    create_time: '2025-02-18 09:30:00',
    last_login: '2026-07-28 09:12:00',
  },
  {
    id: '3',
    username: 'user_admin',
    adminname: '王琪',
    role: '用户管理员',
    status: false,
    create_time: '2025-03-02 15:40:00',
    last_login: '2026-07-10 16:35:00',
  },
  {
    id: '4',
    username: 'audit',
    adminname: '陈璐',
    role: '内容管理员',
    status: true,
    create_time: '2025-03-16 11:25:00',
    last_login: '2026-07-30 18:42:00',
  },
  {
    id: '5',
    username: 'activity_ops',
    adminname: '周航',
    role: '活动管理员',
    status: false,
    create_time: '2025-03-20 13:00:00',
    last_login: '2026-07-01 09:50:00',
  },
  {
    id: '6',
    username: 'service',
    adminname: '吴迪',
    role: '用户管理员',
    status: true,
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

const normalizeBoolean = (value?: string | boolean) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
};

const pageResult = (query: ManagerQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const status = normalizeBoolean(query.status);
  const filtered = managerList.filter((item) => {
    return (
      includesText(item.username, query.username) &&
      (!query.role || item.role === query.role) &&
      (typeof status !== 'boolean' || item.status === status)
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

const handler = (req: any, res: any) => {
  res.json(pageResult(req.query || {}));
};

export default {
  'GET /api/v1/admin/admins': handler,
  'GET /admin/admins': handler,
};
