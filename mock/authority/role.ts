import { menuList } from './menu';
import { permList } from './permissions';

interface RoleItem {
  id: string;
  role_name: string;
  role_code: string;
  description: string;
  status: string;
  create_time: string;
  update_time: string;
}

interface RoleQuery {
  page?: string | number;
  size?: string | number;
  role_name?: string;
  status?: string;
}

interface RoleCreateBody {
  role_name?: string;
  role_code?: string;
  description?: string;
}

interface RoleEditBody extends RoleCreateBody {
  status?: string;
}

interface RolePermBody {
  menu_ids?: string[];
  perm_ids?: string[];
}

interface RoleGrant {
  menu_ids: string[];
  perm_ids: string[];
}

const roleList: RoleItem[] = [
  {
    id: '1',
    role_name: '内容管理员',
    role_code: 'content_admin',
    description: '管理笔记、攻略、评论等内容相关模块',
    status: '启用',
    create_time: '2025-02-15 10:00:00',
    update_time: '2026-08-01 15:41:33',
  },
  {
    id: '2',
    role_name: '运营专员',
    role_code: 'operation_specialist',
    description: '负责平台日常运营及活动配置',
    status: '启用',
    create_time: '2025-02-18 09:30:00',
    update_time: '2026-07-30 11:20:15',
  },
  {
    id: '3',
    role_name: '用户管理员',
    role_code: 'user_admin',
    description: '管理会员、领队及用户状态',
    status: '启用',
    create_time: '2025-03-02 15:40:00',
    update_time: '2026-07-28 16:35:20',
  },
  {
    id: '4',
    role_name: '活动管理员',
    role_code: 'activity_admin',
    description: '负责活动审核、发布及报名管理',
    status: '启用',
    create_time: '2025-03-20 13:00:00',
    update_time: '2026-07-25 09:50:42',
  },
  {
    id: '5',
    role_name: '评论审核员',
    role_code: 'comment_reviewer',
    description: '审核用户评论并处理违规内容',
    status: '禁用',
    create_time: '2025-04-08 10:25:00',
    update_time: '2026-06-18 14:12:36',
  },
  {
    id: '6',
    role_name: '数据观察员',
    role_code: 'data_viewer',
    description: '查看平台运营数据和统计报表',
    status: '禁用',
    create_time: '2025-05-12 11:10:00',
    update_time: '2026-06-02 17:22:08',
  },
  {
    id: '7',
    role_name: '客服专员',
    role_code: 'customer_service',
    description: '处理用户咨询、反馈和投诉',
    status: '启用',
    create_time: '2025-06-01 09:00:00',
    update_time: '2026-07-21 10:18:45',
  },
];

const roleGrants: Record<string, RoleGrant> = {
  '1': {
    menu_ids: ['1', '6', '7', '8', '15', '16', '17', '18'],
    perm_ids: permList
      .filter((item) =>
        ['内容管理', '评论管理', '标签管理', '消息管理'].includes(item.module),
      )
      .map((item) => item.id),
  },
  '2': {
    menu_ids: ['1', '5', '6', '7', '8', '15', '16', '17', '18'],
    perm_ids: permList
      .filter((item) =>
        ['活动管理', '内容管理', '标签管理', '消息管理'].includes(item.module),
      )
      .map((item) => item.id),
  },
  '3': {
    menu_ids: ['1', '2', '3', '4', '16', '17', '18'],
    perm_ids: permList
      .filter((item) => ['用户管理', '消息管理'].includes(item.module))
      .map((item) => item.id),
  },
  '4': {
    menu_ids: ['1', '5', '16', '17'],
    perm_ids: permList
      .filter(
        (item) =>
          ['活动管理', '消息管理'].includes(item.module) ||
          item.perm_key === 'message:system:list' ||
          item.perm_key === 'message:system:send',
      )
      .map((item) => item.id),
  },
  '5': {
    menu_ids: ['1', '9'],
    perm_ids: permList
      .filter((item) => item.module === '评论管理')
      .map((item) => item.id),
  },
  '6': {
    menu_ids: ['1'],
    perm_ids: permList
      .filter((item) => item.request_method === 'GET')
      .map((item) => item.id),
  },
  '7': {
    menu_ids: ['1', '2', '3', '4', '16', '17', '18'],
    perm_ids: permList
      .filter((item) =>
        ['个人中心', '用户管理', '消息管理'].includes(item.module),
      )
      .map((item) => item.id),
  },
};

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

const pageResult = (query: RoleQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = roleList.filter((item) => {
    return (
      includesText(item.role_name, query.role_name) &&
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
  const body = normalizeBody<RoleCreateBody>(req.body);

  if (!body.role_name || !body.role_code || !body.description) {
    res.json({
      code: 400,
      message: '缺少必要参数',
      data: null,
    });
    return;
  }

  const exists = roleList.some(
    (item) =>
      item.role_name === body.role_name || item.role_code === body.role_code,
  );

  if (exists) {
    res.json({
      code: 400,
      message: '角色名称或角色标识已存在',
      data: null,
    });
    return;
  }

  const nextId = String(
    roleList.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1,
  );
  const created: RoleItem = {
    id: nextId,
    role_name: body.role_name,
    role_code: body.role_code,
    description: body.description,
    status: '启用',
    create_time: '2026-08-04 14:00:00',
    update_time: '2026-08-04 14:00:00',
  };

  roleList.unshift(created);

  res.json({
    code: 0,
    message: '新增角色成功',
    data: created,
  });
};

const editHandler = (req: any, res: any) => {
  const body = normalizeBody<RoleEditBody>(req.body);
  const current = roleList.find((item) => item.id === String(req.params.id));
  const status = body.status;

  if (!current) {
    res.json({
      code: 404,
      message: '角色不存在',
      data: null,
    });
    return;
  }

  if (
    !body.role_name ||
    !body.role_code ||
    !body.description ||
    (status !== '启用' && status !== '禁用')
  ) {
    res.json({
      code: 400,
      message: '缺少必要参数',
      data: null,
    });
    return;
  }

  const exists = roleList.some(
    (item) =>
      item.id !== current.id &&
      (item.role_name === body.role_name || item.role_code === body.role_code),
  );

  if (exists) {
    res.json({
      code: 400,
      message: '角色名称或角色标识已存在',
      data: null,
    });
    return;
  }

  current.role_name = body.role_name;
  current.role_code = body.role_code;
  current.description = body.description;
  current.status = status;
  current.update_time = '2026-08-04 14:00:00';

  res.json({
    code: 0,
    message: '编辑角色成功',
    data: current,
  });
};

const deleteHandler = (req: any, res: any) => {
  const index = roleList.findIndex((item) => item.id === String(req.params.id));

  if (index < 0) {
    res.json({
      code: 404,
      message: '角色不存在',
      data: null,
    });
    return;
  }

  const [deleted] = roleList.splice(index, 1);
  delete roleGrants[deleted.id];

  res.json({
    code: 0,
    message: '删除角色成功',
    data: null,
  });
};

const getRole = (id: unknown) =>
  roleList.find((item) => item.id === String(id));

const menuTreeHandler = (req: any, res: any) => {
  const role = getRole(req.params.id);

  if (!role) {
    res.json({ code: 404, message: '角色不存在', data: null });
    return;
  }

  const checked = new Set(roleGrants[role.id]?.menu_ids ?? []);
  const roots = menuList
    .filter((item) => item.parent_name === null)
    .sort((a, b) => a.sort - b.sort);
  const menuTree = roots.map((root) => ({
    id: root.id,
    name: root.menu_name,
    checked: checked.has(root.id),
    children: menuList
      .filter((item) => item.parent_name === root.menu_name)
      .sort((a, b) => a.sort - b.sort)
      .map((item) => ({
        id: item.id,
        name: item.menu_name,
        checked: checked.has(item.id),
        children: [],
      })),
  }));

  res.json({ code: 0, message: '成功', data: { menu_tree: menuTree } });
};

const permTreeHandler = (req: any, res: any) => {
  const role = getRole(req.params.id);

  if (!role) {
    res.json({ code: 404, message: '角色不存在', data: null });
    return;
  }

  const checked = new Set(roleGrants[role.id]?.perm_ids ?? []);
  const modules = Array.from(new Set(permList.map((item) => item.module)));
  const permissionTree = modules.map((module) => ({
    module,
    children: permList
      .filter((item) => item.module === module)
      .map((item) => ({
        id: item.id,
        name: `${item.perm_name}（${item.perm_key}）`,
        checked: checked.has(item.id),
      })),
  }));

  res.json({
    code: 0,
    message: '成功',
    data: { permission_tree: permissionTree },
  });
};

const savePermHandler = (req: any, res: any) => {
  const role = getRole(req.params.id);
  const body = normalizeBody<RolePermBody>(req.body);

  if (!role) {
    res.json({ code: 404, message: '角色不存在', data: null });
    return;
  }

  if (!Array.isArray(body.menu_ids) || !Array.isArray(body.perm_ids)) {
    res.json({ code: 400, message: '缺少必要参数', data: null });
    return;
  }

  const menuIds = new Set(menuList.map((item) => item.id));
  const permIds = new Set(permList.map((item) => item.id));
  const invalidMenu = body.menu_ids.some(
    (id) => typeof id !== 'string' || !menuIds.has(id),
  );
  const invalidPerm = body.perm_ids.some(
    (id) => typeof id !== 'string' || !permIds.has(id),
  );

  if (invalidMenu || invalidPerm) {
    res.json({ code: 400, message: '菜单或权限 ID 不存在', data: null });
    return;
  }

  roleGrants[role.id] = {
    menu_ids: Array.from(new Set(body.menu_ids)),
    perm_ids: Array.from(new Set(body.perm_ids)),
  };

  res.json({ code: 0, message: '权限分配成功', data: null });
};

export default {
  'GET /__mock/api/v1/admin/roles': listHandler,
  'GET /admin/roles': listHandler,
  'POST /__mock/api/v1/admin/roles': createHandler,
  'POST /admin/roles': createHandler,
  'PUT /__mock/api/v1/admin/roles/:id': editHandler,
  'PUT /admin/roles/:id': editHandler,
  'DELETE /__mock/api/v1/admin/roles/:id': deleteHandler,
  'DELETE /admin/roles/:id': deleteHandler,
  'GET /__mock/api/v1/admin/roles/:id/menus': menuTreeHandler,
  'GET /admin/roles/:id/menus': menuTreeHandler,
  'GET /__mock/api/v1/admin/roles/:id/permissions': permTreeHandler,
  'GET /admin/roles/:id/permissions': permTreeHandler,
  'PUT /__mock/api/v1/admin/roles/:id/permissions': savePermHandler,
  'PUT /admin/roles/:id/permissions': savePermHandler,
};
