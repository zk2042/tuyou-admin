type CurrentAdminInfo = {
  id: string;
  username: string;
  adminname: string;
  role: string;
  avatar: string;
  status: boolean;
};

type UpdateUsernameBody = Pick<CurrentAdminInfo, 'username'>;

type UpdateAvatarBody = Pick<CurrentAdminInfo, 'avatar'>;

type UpdatePasswordBody = {
  old_password?: string;
  new_password?: string;
};

type NoticeQuery = {
  page?: string;
  size?: string;
};

type NoticeItem = {
  id: number;
  type: 0 | 1 | 2;
  content: string;
  is_read: 0 | 1;
  created_at: string;
};

const currentAdmin: CurrentAdminInfo = {
  id: '1',
  username: 'admin11',
  adminname: '张三',
  role: '超级管理员',
  avatar: '',
  status: true,
};

let adminPassword = '123456';

let notificationList: NoticeItem[] = [
  {
    id: 75,
    type: 2,
    content:
      '您的账号于2026-07-29 20:30:39在Windows - Edge上登录，如非本人操作，请尽快修改密码',
    is_read: 0,
    created_at: '2026-07-29T20:30:39.326+08:00',
  },
  {
    id: 74,
    type: 2,
    content:
      '您的账号于2026-07-28 15:44:11在Windows - Chrome上登录，如非本人操作，请尽快修改密码',
    is_read: 0,
    created_at: '2026-07-28T15:44:11.215+08:00',
  },
  {
    id: 73,
    type: 2,
    content:
      '您的账号于2026-07-25 16:18:00在Windows - Edge上登录，如非本人操作，请尽快修改密码',
    is_read: 0,
    created_at: '2026-07-25T16:18:00.000+08:00',
  },
  {
    id: 72,
    type: 1,
    content: '为了保障账号安全，建议您定期修改登录密码并开启登录提醒',
    is_read: 1,
    created_at: '2026-07-21T21:33:21.043+08:00',
  },
  {
    id: 71,
    type: 0,
    content: '个人中心已升级，您现在可以直接在此页面维护头像、账号名与密码',
    is_read: 1,
    created_at: '2026-07-15T17:33:05.000+08:00',
  },
];

const capMap = new Map<string, string>();

function makeCode() {
  return Array.from({ length: 4 }, () => {
    return Math.floor(Math.random() * 10).toString();
  }).join('');
}

function makeImage(code: string) {
  const chars = code
    .split('')
    .map((char, index) => {
      const rotate = [-12, 8, -6, 10][index] || 0;
      const x = 18 + index * 24;
      const y = 33 + (index % 2 === 0 ? 0 : 2);
      return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    })
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="124" height="52" viewBox="0 0 124 52">
      <rect width="124" height="52" rx="12" fill="#f7fbf7"/>
      <path d="M10 14C28 24 44 6 62 16C80 26 98 10 114 18" stroke="rgba(46,125,50,0.18)" stroke-width="2" fill="none"/>
      <path d="M8 38C24 28 40 46 58 36C78 24 92 42 116 30" stroke="rgba(46,125,50,0.16)" stroke-width="2" fill="none"/>
      <g fill="#2e7d32" font-family="Arial, sans-serif" font-size="26" font-style="italic" font-weight="700">
        ${chars}
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeToken(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function formatIso8(date = new Date()) {
  const utc8 = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const year = utc8.getUTCFullYear();
  const month = String(utc8.getUTCMonth() + 1).padStart(2, '0');
  const day = String(utc8.getUTCDate()).padStart(2, '0');
  const hour = String(utc8.getUTCHours()).padStart(2, '0');
  const minute = String(utc8.getUTCMinutes()).padStart(2, '0');
  const second = String(utc8.getUTCSeconds()).padStart(2, '0');
  const ms = String(utc8.getUTCMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}+08:00`;
}

function isTokenValid(token: string, prefix: string) {
  return Boolean(token) && token.startsWith(`${prefix}_`);
}

function getBearer(req: any) {
  const auth = req.headers.authorization || '';
  return auth.replace(/^Bearer\s+/i, '');
}

function sendBiz(res: any, code: number, message: string, data: any = null) {
  res.json({
    code,
    message,
    data,
  });
}

function normalizeBody<T extends object>(body?: T | string) {
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
}

function validateToken(req: any, res: any) {
  const token = getBearer(req);

  if (!isTokenValid(token, 'mock_access')) {
    sendBiz(res, 1006, '令牌已过期');
    return false;
  }

  return true;
}

function getMeHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  sendBiz(res, 0, '获取成功', currentAdmin);
}

function updateUsernameHandler(req: any, res: any) {
  const body = normalizeBody<UpdateUsernameBody>(req.body);

  if (!validateToken(req, res)) {
    return;
  }

  if (!body.username) {
    sendBiz(res, 2002, '缺少必要参数');
    return;
  }

  currentAdmin.username = body.username;

  sendBiz(res, 0, '用户账号更新成功', currentAdmin);
}

function updateAvatarHandler(req: any, res: any) {
  const body = normalizeBody<UpdateAvatarBody>(req.body);

  if (!validateToken(req, res)) {
    return;
  }

  currentAdmin.avatar = body.avatar || '';

  sendBiz(res, 0, '头像更新成功', currentAdmin);
}

function updatePasswordHandler(req: any, res: any) {
  const body = normalizeBody<UpdatePasswordBody>(req.body);

  if (!validateToken(req, res)) {
    return;
  }

  if (!body.old_password || !body.new_password) {
    sendBiz(res, 2002, '缺少必要参数');
    return;
  }

  if (body.old_password !== adminPassword) {
    sendBiz(res, 1003, '原密码错误');
    return;
  }

  adminPassword = body.new_password;
  notificationList = [
    {
      id: Date.now(),
      type: 1,
      content: '您的登录密码已更新，请妥善保管新密码',
      is_read: 0,
      created_at: formatIso8(),
    },
    ...notificationList,
  ];

  sendBiz(res, 0, '密码修改成功', null);
}

function normalizeNoticeQuery(query?: NoticeQuery) {
  const page = Math.max(Number(query?.page || 1), 1);
  const size = Math.min(Math.max(Number(query?.size || 10), 1), 100);

  return {
    page,
    size,
  };
}

function buildNotificationData(query?: NoticeQuery) {
  const { page, size } = normalizeNoticeQuery(query);
  const start = (page - 1) * size;
  const list = notificationList.slice(start, start + size);

  return {
    list,
    total: notificationList.length,
    page,
    size,
    total_page: Math.ceil(notificationList.length / size) || 1,
  };
}

function buildUnreadData() {
  return {
    unread_count: notificationList.filter((item) => item.is_read === 0).length,
  };
}

function queryNotificationsHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  sendBiz(res, 0, '获取成功', buildNotificationData(req.query || {}));
}

function queryUnreadHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  sendBiz(res, 0, '获取成功', buildUnreadData());
}

function markAllNotificationsReadHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  notificationList = notificationList.map((item) => ({
    ...item,
    is_read: 1,
  }));

  sendBiz(res, 0, '已全部标记为已读', buildNotificationData(req.query || {}));
}

function markNotificationReadHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  const id = Number(req.params?.id);
  const index = notificationList.findIndex((item) => item.id === id);

  if (index < 0) {
    sendBiz(res, 2004, '消息不存在');
    return;
  }

  notificationList[index] = {
    ...notificationList[index],
    is_read: 1,
  };

  sendBiz(res, 0, '已标记为已读', null);
}

function deleteNotificationHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  const id = Number(req.params?.id);
  const index = notificationList.findIndex((item) => item.id === id);

  if (index < 0) {
    sendBiz(res, 2004, '消息不存在');
    return;
  }

  notificationList.splice(index, 1);

  sendBiz(res, 0, '消息删除成功', null);
}

function clearNotificationsHandler(req: any, res: any) {
  if (!validateToken(req, res)) {
    return;
  }

  notificationList = [];

  sendBiz(res, 0, '已清空所有消息', buildNotificationData(req.query || {}));
}

export default {
  'GET /api/v1/admin/captcha': (_req: any, res: any) => {
    const code = makeCode();
    const key = `mock_${Date.now().toString(36)}`;

    capMap.set(key, code);

    res.json({
      code: 0,
      data: {
        captcha_id: key,
        captcha_image: makeImage(code),
      },
    });
  },
  'POST /api/v1/admin/login': (req: any, res: any) => {
    const { username, password, captcha_id, captcha } = req.body || {};
    const code = capMap.get(captcha_id);

    if (!username || !password || !captcha_id || !captcha) {
      sendBiz(res, 2002, '缺少必要参数');
      return;
    }

    if (!code || code.toUpperCase() !== String(captcha).toUpperCase()) {
      sendBiz(res, 2003, '验证码错误');
      return;
    }

    if (username !== currentAdmin.username || password !== adminPassword) {
      sendBiz(res, 1003, '用户名或密码错误');
      return;
    }

    capMap.delete(captcha_id);

    const token = makeToken('mock_access');

    sendBiz(res, 0, '登录成功', {
      token,
      id: currentAdmin.id,
      username: currentAdmin.username,
      role: currentAdmin.role,
      avatar: currentAdmin.avatar,
      menuTree: [],
      permTree: [],
    });
  },
  'GET /api/v1/admin/auth/me': getMeHandler,
  'PUT /api/v1/admin/auth/password': updatePasswordHandler,
  'PUT /api/v1/admin/center/profile': updateUsernameHandler,
  'PUT /api/v1/admin/center/avatar': updateAvatarHandler,
  'GET /api/v1/admin/center/notifications': queryNotificationsHandler,
  'GET /api/v1/admin/center/notifications/unread': queryUnreadHandler,
  'PUT /api/v1/admin/center/notifications/read-all':
    markAllNotificationsReadHandler,
  'PUT /api/v1/admin/center/notifications/:id/read':
    markNotificationReadHandler,
  'DELETE /api/v1/admin/center/notifications/:id': deleteNotificationHandler,
  'DELETE /api/v1/admin/center/notifications': clearNotificationsHandler,
};
