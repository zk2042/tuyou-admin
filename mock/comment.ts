import type { CommentDetail } from '@/services/comment/types';

type CommentMockItem = CommentDetail;

interface BatchBody {
  ids?: string[];
}

interface PageQuery {
  page?: string;
  size?: string;
  target_type?: string;
  nickname?: string;
  title?: string;
  begin_time?: string;
  finish_time?: string;
  level?: string;
  sort_field?: string;
  sort_order?: string;
}

const commentList: CommentMockItem[] = [
  {
    id: 'C001',
    nickname: '旅行爱好者',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=travel-1',
    target_type: '笔记',
    target_title: '稻城亚丁徒步攻略笔记',
    content:
      '太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了太美了！非常详细的攻略，收藏了',
    level: '一级',
    reply_to_nickname: '',
    like_count: 28,
    heat: 86,
    create_time: '2026-07-20 14:30:00',
    status: '正常',
    delete_time: '',
  },
  {
    id: 'C002',
    nickname: '露营搭子阿宁',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=camp-2',
    target_type: '攻略',
    target_title: '海边露营新手入门手册',
    content: '第二天早上风真的很大，天幕固定这块写得很实用',
    level: '一级',
    reply_to_nickname: '',
    like_count: 35,
    heat: 102,
    create_time: '2026-07-19 09:12:00',
    status: '正常',
    delete_time: '',
  },
  {
    id: 'C003',
    nickname: '高原漫游者',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mountain-3',
    target_type: '笔记',
    target_title: '青海湖骑行路线补给点整理',
    content: '我上次也是按这个补给点停的，确实节奏会轻松很多',
    level: '二级',
    reply_to_nickname: '旅行爱好者',
    like_count: 18,
    heat: 61,
    create_time: '2026-07-18 18:42:00',
    status: '正常',
    delete_time: '',
    is_sensitive: true,
    hit_words: ['补给点'],
  },
  {
    id: 'C004',
    nickname: '小风跑者',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=runner-4',
    target_type: '攻略',
    target_title: '城市夜跑训练路线推荐',
    content: '如果是工作日夜跑，江边这条线的路灯情况怎么样？',
    level: '一级',
    reply_to_nickname: '',
    like_count: 14,
    heat: 49,
    create_time: '2026-07-17 20:25:00',
    status: '正常',
    delete_time: '',
  },
  {
    id: 'C005',
    nickname: '溪谷观察员',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=river-5',
    target_type: '笔记',
    target_title: '溯溪鞋和防水包怎么选',
    content: '鞋底纹路那段我试过，湿滑石面确实差别很大',
    level: '一级',
    reply_to_nickname: '',
    like_count: 21,
    heat: 73,
    create_time: '2026-07-16 11:08:00',
    status: '正常',
    delete_time: '',
  },
  {
    id: 'C006',
    nickname: '山野记录者',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=wild-6',
    target_type: '攻略',
    target_title: '武功山两天一夜徒步攻略',
    content: '第二天看日出的话，营地建议更靠哪一侧？',
    level: '二级',
    reply_to_nickname: '露营搭子阿宁',
    like_count: 26,
    heat: 95,
    create_time: '2026-07-15 07:50:00',
    status: '正常',
    delete_time: '',
    is_sensitive: true,
    hit_words: ['营地', '日出'],
  },
  {
    id: 'C007',
    nickname: '阿哲露营',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=camp-7',
    target_type: '攻略',
    target_title: '阳朔攀岩周末安排指南',
    content: '馆内热身和野外线路切换那段已经过时，先删除了',
    level: '一级',
    reply_to_nickname: '',
    like_count: 9,
    heat: 25,
    create_time: '2026-07-14 16:15:00',
    status: '已删除',
    delete_time: '2026-07-21 10:00:00',
  },
  {
    id: 'C008',
    nickname: '骑行长歌',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ride-8',
    target_type: '笔记',
    target_title: '武功山草甸露营拍照机位',
    content: '蓝调时段那两个机位我都去拍过，角度确实很稳',
    level: '二级',
    reply_to_nickname: '山野记录者',
    like_count: 31,
    heat: 88,
    create_time: '2026-07-13 21:36:00',
    status: '正常',
    delete_time: '',
  },
  {
    id: 'C009',
    nickname: '海风旅人',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=sea-9',
    target_type: '笔记',
    target_title: '海边露营避坑清单',
    content: '潮汐表这个提醒太关键了，上次差点被返潮劝退',
    level: '一级',
    reply_to_nickname: '',
    like_count: 42,
    heat: 120,
    create_time: '2026-07-12 08:40:00',
    status: '正常',
    delete_time: '',
  },
  {
    id: 'C010',
    nickname: '攻略收藏家',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=guide-10',
    target_type: '攻略',
    target_title: '西藏自驾游完整指南',
    content: '补给节点和海拔适应这两部分整理得很清楚',
    level: '一级',
    reply_to_nickname: '',
    like_count: 57,
    heat: 145,
    create_time: '2026-07-11 13:05:00',
    status: '正常',
    delete_time: '',
    is_sensitive: true,
    hit_words: [],
  },
];

const includesText = (source: string, keyword?: string) => {
  if (!keyword) {
    return true;
  }

  return source.toLowerCase().includes(keyword.trim().toLowerCase());
};

const matchSelect = (source: string, current?: string) => {
  if (!current) {
    return true;
  }

  return source === current;
};

const matchDate = (value: string, start?: string, end?: string) => {
  if (start && value < start) {
    return false;
  }

  if (end && value > end) {
    return false;
  }

  return true;
};

const sortKey = {
  likes: 'like_count',
  heat: 'heat',
} as const;

const normalizeBatch = (body?: BatchBody | string): BatchBody => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as BatchBody;
    } catch {
      return {};
    }
  }

  return body;
};

const pageResult = (source: CommentMockItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = source.filter((item) => {
    return (
      matchSelect(item.target_type, query.target_type) &&
      includesText(item.nickname, query.nickname) &&
      includesText(item.target_title, query.title) &&
      matchSelect(item.level, query.level) &&
      matchDate(item.create_time, query.begin_time, query.finish_time)
    );
  });
  const sortField = sortKey[query.sort_field as keyof typeof sortKey];
  const sortOrder = query.sort_order;
  const sorted = [...filtered];

  if (sortField && sortOrder) {
    sorted.sort((prev, next) => {
      const delta = prev[sortField] - next[sortField];
      return sortOrder === '升序' ? delta : -delta;
    });
  }

  const start = (page - 1) * size;
  const list = sorted.slice(start, start + size);

  return {
    code: 0,
    message: '成功',
    data: {
      list,
      total: sorted.length,
      page,
      size,
      total_page: Math.ceil(sorted.length / size) || 1,
    },
  };
};

export default {
  'GET /__mock/api/v1/admin/comments': (req: any, res: any) => {
    res.json(pageResult(commentList, req.query || {}));
  },
  'GET /__mock/api/v1/admin/comments/:id': (req: any, res: any) => {
    const current = commentList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '评论不存在',
        data: null,
      });
      return;
    }

    res.json({
      code: 0,
      message: '成功',
      data: current,
    });
  },
  'DELETE /__mock/api/v1/admin/comments/:id': (req: any, res: any) => {
    const index = commentList.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: '评论不存在',
        data: null,
      });
      return;
    }

    commentList.splice(index, 1);

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
  'POST /__mock/api/v1/admin/comments/batch-delete': (req: any, res: any) => {
    const body = normalizeBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));

    for (let i = commentList.length - 1; i >= 0; i -= 1) {
      if (ids.has(commentList[i].id)) {
        commentList.splice(i, 1);
      }
    }

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
};
