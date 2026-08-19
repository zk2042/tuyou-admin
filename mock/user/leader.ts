import type { UserItem } from './shared';
import {
  detailResult,
  exportText,
  findItem,
  pageResult,
  removeItem,
  removeItems,
  updateItem,
  updateStatusItems,
} from './shared';

const DEFAULT_BG_IMG =
  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

interface LeaderItem extends UserItem {
  leading_count: number;
}

const leaderList: LeaderItem[] = [
  {
    id: 'L1001',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=wangleader',
    bg_img: DEFAULT_BG_IMG,
    nickname: '登山领队小王',
    phone: '158****1111',
    follow_count: 182,
    favorite_count: 96,
    publish_count: 34,
    fans_count: 1280,
    bio: '山野有路，热爱无边，带你去看更高处的风景。',
    leading_count: 48,
    status: '启用',
    role: '领队',
    register_time: '2025-03-15',
    last_login: '2026-07-22 07:30',
  },
  {
    id: 'L1002',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=zhangleader',
    bg_img: DEFAULT_BG_IMG,
    nickname: '骑行老张',
    phone: '137****2222',
    follow_count: 145,
    favorite_count: 88,
    publish_count: 29,
    fans_count: 962,
    bio: '车轮滚过山海，也愿带你体验风的速度。',
    leading_count: 36,
    status: '启用',
    role: '领队',
    register_time: '2025-05-20',
    last_login: '2026-07-21 19:15',
  },
  {
    id: 'L1003',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=lileader',
    bg_img: DEFAULT_BG_IMG,
    nickname: '户外达人小李',
    phone: '186****3333',
    follow_count: 236,
    favorite_count: 114,
    publish_count: 41,
    fans_count: 1546,
    bio: '愿每一次出发都不被辜负，把风景留给值得的人。',
    leading_count: 52,
    status: '启用',
    role: '领队',
    register_time: '2024-11-08',
    last_login: '2026-07-22 06:40',
  },
  {
    id: 'L1004',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=zhouleader',
    bg_img: DEFAULT_BG_IMG,
    nickname: '攀岩教练阿周',
    phone: '177****4444',
    follow_count: 73,
    favorite_count: 46,
    publish_count: 15,
    fans_count: 524,
    bio: '岩壁之上见真章，安全与挑战从来都同样重要。',
    leading_count: 12,
    status: '禁用',
    role: '领队',
    register_time: '2026-06-01',
    last_login: '2026-07-20 14:55',
  },
  {
    id: 'L1005',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=heleader',
    bg_img: DEFAULT_BG_IMG,
    nickname: '露营主理人小何',
    phone: '139****5566',
    follow_count: 164,
    favorite_count: 102,
    publish_count: 31,
    fans_count: 1188,
    bio: '帐篷之外，真正吸引人的往往是人与人之间的连接。',
    leading_count: 28,
    status: '启用',
    role: '领队',
    register_time: '2025-09-18',
    last_login: '2026-07-19 21:10',
  },
  {
    id: 'L1006',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=guleader',
    bg_img: DEFAULT_BG_IMG,
    nickname: '越野向导阿顾',
    phone: '136****7788',
    follow_count: 128,
    favorite_count: 77,
    publish_count: 26,
    fans_count: 845,
    bio: '复杂路线交给我，尽情去体验奔赴远方的自由。',
    leading_count: 41,
    status: '禁用',
    role: '领队',
    register_time: '2025-01-12',
    last_login: '2026-07-18 08:35',
  },
];

export default {
  'GET /__mock/api/v1/admin/leaders': (req: any, res: any) => {
    res.json(pageResult(leaderList, req.query || {}));
  },
  'GET /__mock/api/v1/admin/leaders/:id': (req: any, res: any) => {
    res.json(detailResult(findItem(leaderList, req.params.id) || null));
  },
  'PUT /__mock/api/v1/admin/leaders/:id': (req: any, res: any) => {
    res.json(updateItem(leaderList, req.params.id, req.body));
  },
  'DELETE /__mock/api/v1/admin/leaders/:id': (req: any, res: any) => {
    res.json(removeItem(leaderList, req.params.id));
  },
  'POST /__mock/api/v1/admin/leaders/batch-delete': (req: any, res: any) => {
    res.json(removeItems(leaderList, req.body));
  },
  'PUT /__mock/api/v1/admin/leaders/batch-status': (req: any, res: any) => {
    res.json(updateStatusItems(leaderList, req.body));
  },
  'GET /__mock/api/v1/admin/leaders/export': (_req: any, res: any) => {
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
        item.status === '启用' ? '正常' : item.status,
        item.role,
        item.leading_count,
        item.bio,
        item.register_time,
        item.last_login,
      ]),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="leader_export_20260804.xlsx"',
    );
    res.send(`\uFEFF${content}`);
  },
};
