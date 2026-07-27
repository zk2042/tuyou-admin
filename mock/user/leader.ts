import type { UserItem } from './shared';
import { detailResult, exportText, findItem, pageResult } from './shared';

const DEFAULT_COVER =
  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

interface LeaderItem extends UserItem {
  lead_count: number;
}

const leaderList: LeaderItem[] = [
  {
    id: 'L1001',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=wangleader',
    cover: DEFAULT_COVER,
    cover_style: 'linear-gradient(135deg,#c5e1a5,#7cb342)',
    nickname: '登山领队小王',
    phone: '158****1111',
    bio: '山野有路，热爱无边，带你去看更高处的风景。',
    lead_count: 48,
    status: '正常',
    role: '领队',
    register_time: '2025-03-15',
    last_login: '2026-07-22 07:30',
  },
  {
    id: 'L1002',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=zhangleader',
    cover: DEFAULT_COVER,
    cover_style: 'linear-gradient(135deg,#b3e5fc,#4fc3f7)',
    nickname: '骑行老张',
    phone: '137****2222',
    bio: '车轮滚过山海，也愿带你体验风的速度。',
    lead_count: 36,
    status: '正常',
    role: '领队',
    register_time: '2025-05-20',
    last_login: '2026-07-21 19:15',
  },
  {
    id: 'L1003',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=lileader',
    cover: DEFAULT_COVER,
    cover_style: 'linear-gradient(135deg,#dcedc8,#9ccc65)',
    nickname: '户外达人小李',
    phone: '186****3333',
    bio: '愿每一次出发都不被辜负，把风景留给值得的人。',
    lead_count: 52,
    status: '正常',
    role: '领队',
    register_time: '2024-11-08',
    last_login: '2026-07-22 06:40',
  },
  {
    id: 'L1004',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=zhouleader',
    cover: DEFAULT_COVER,
    cover_style: 'linear-gradient(135deg,#ffe0b2,#fb8c00)',
    nickname: '攀岩教练阿周',
    phone: '177****4444',
    bio: '岩壁之上见真章，安全与挑战从来都同样重要。',
    lead_count: 12,
    status: '禁用',
    role: '领队',
    register_time: '2026-06-01',
    last_login: '2026-07-20 14:55',
  },
  {
    id: 'L1005',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=heleader',
    cover: DEFAULT_COVER,
    cover_style: 'linear-gradient(135deg,#f8bbd0,#ec407a)',
    nickname: '露营主理人小何',
    phone: '139****5566',
    bio: '帐篷之外，真正吸引人的往往是人与人之间的连接。',
    lead_count: 28,
    status: '正常',
    role: '领队',
    register_time: '2025-09-18',
    last_login: '2026-07-19 21:10',
  },
  {
    id: 'L1006',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=guleader',
    cover: DEFAULT_COVER,
    cover_style: 'linear-gradient(135deg,#d1c4e9,#7e57c2)',
    nickname: '越野向导阿顾',
    phone: '136****7788',
    bio: '复杂路线交给我，尽情去体验奔赴远方的自由。',
    lead_count: 41,
    status: '禁用',
    role: '领队',
    register_time: '2025-01-12',
    last_login: '2026-07-18 08:35',
  },
];

export default {
  'GET /api/v1/admin/leaders': (req: any, res: any) => {
    res.json(pageResult(leaderList, req.query || {}));
  },
  'GET /api/v1/admin/leaders/:id': (req: any, res: any) => {
    res.json(detailResult(findItem(leaderList, req.params.id) || null));
  },
  'POST /api/v1/admin/leaders/export': (_req: any, res: any) => {
    const content = exportText(
      [
        'ID',
        '昵称',
        '手机号',
        '状态',
        '角色',
        '带队次数',
        '个性签名',
        '注册时间',
        '最近登录',
      ],
      leaderList.map((item) => [
        item.id,
        item.nickname,
        item.phone,
        item.status,
        item.role,
        item.lead_count,
        item.bio,
        item.register_time,
        item.last_login,
      ]),
    );

    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      "attachment; filename*=UTF-8''leaders.xls",
    );
    res.send(`\uFEFF${content}`);
  },
};
