import type { UserItem } from './shared';
import { pageResult } from './shared';

interface LeaderItem extends UserItem {
  leadCount: number;
}

const leaderList: LeaderItem[] = [
  {
    id: 'L1001',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=wangleader',
    nickname: '登山领队小王',
    mobile: '158****1111',
    signature: '山野有路，热爱无边，带你去看更高处的风景。',
    leadCount: 48,
    status: 'enabled',
    role: '领队',
    registeredAt: '2025-03-15',
    lastLogin: '2026-07-22 07:30',
  },
  {
    id: 'L1002',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=zhangleader',
    nickname: '骑行老张',
    mobile: '137****2222',
    signature: '车轮滚过山海，也愿带你体验风的速度。',
    leadCount: 36,
    status: 'enabled',
    role: '领队',
    registeredAt: '2025-05-20',
    lastLogin: '2026-07-21 19:15',
  },
  {
    id: 'L1003',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=lileader',
    nickname: '户外达人小李',
    mobile: '186****3333',
    signature: '愿每一次出发都不被辜负，把风景留给值得的人。',
    leadCount: 52,
    status: 'enabled',
    role: '领队',
    registeredAt: '2024-11-08',
    lastLogin: '2026-07-22 06:40',
  },
  {
    id: 'L1004',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=zhouleader',
    nickname: '攀岩教练阿周',
    mobile: '177****4444',
    signature: '岩壁之上见真章，安全与挑战从来都同样重要。',
    leadCount: 12,
    status: 'disabled',
    role: '领队',
    registeredAt: '2026-06-01',
    lastLogin: '2026-07-20 14:55',
  },
  {
    id: 'L1005',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=heleader',
    nickname: '露营主理人小何',
    mobile: '139****5566',
    signature: '帐篷之外，真正吸引人的往往是人与人之间的连接。',
    leadCount: 28,
    status: 'enabled',
    role: '领队',
    registeredAt: '2025-09-18',
    lastLogin: '2026-07-19 21:10',
  },
  {
    id: 'L1006',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=guleader',
    nickname: '越野向导阿顾',
    mobile: '136****7788',
    signature: '复杂路线交给我，尽情去体验奔赴远方的自由。',
    leadCount: 41,
    status: 'disabled',
    role: '领队',
    registeredAt: '2025-01-12',
    lastLogin: '2026-07-18 08:35',
  },
];

export default {
  'GET /api/v1/leaders': (req: any, res: any) => {
    res.json(pageResult(leaderList, req.query || {}));
  },
};
