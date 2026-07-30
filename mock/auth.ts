const admUser = {
  id: 1,
  username: 'admin',
  role: '超级管理员',
  avatar: '',
};

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

export default {
  'GET /api/v1/amdin/captcha': (_req: any, res: any) => {
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

    if (username !== 'admin' || password !== '123456') {
      sendBiz(res, 1003, '用户名或密码错误');
      return;
    }

    capMap.delete(captcha_id);

    const token = makeToken('mock_access');

    sendBiz(res, 0, '登录成功', {
      token,
      admin: admUser,
    });
  },
  'GET /api/v1/admin/auth/me': (req: any, res: any) => {
    const token = getBearer(req);

    if (!isTokenValid(token, 'mock_access')) {
      sendBiz(res, 1006, '令牌已过期');
      return;
    }

    sendBiz(res, 0, '获取成功', admUser);
  },
};
