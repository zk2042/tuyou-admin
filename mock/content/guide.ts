import type { GuideDetail } from '@/services/content/guide/types';
import { exportText } from '../user/shared';

type GuideMockItem = GuideDetail;

interface EditBody {
  category?: string;
  difficulty?: string;
  is_slide?: boolean | string;
  status?: string;
}

interface BatchBody {
  ids?: string[];
}

interface PageQuery {
  page?: string;
  size?: string;
  title?: string;
  category?: string;
  difficulty?: string;
  is_slide?: string;
  sort_field?: string;
  sort_order?: string;
  begin_time?: string;
  finish_time?: string;
}

const guideList: GuideMockItem[] = [
  {
    id: 'G001',
    cover_img:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=480&q=80',
    title: '西藏自驾游完整指南',
    nickname: '老司机',
    category: '徒步',
    tags: ['西藏', '风景', '人文'],
    difficulty: '高等',
    publish_time: '2026-07-20 00:00:00',
    view_count: 5620,
    like_count: 520,
    collect_count: 1280,
    comment_count: 89,
    heat: 7509,
    is_slide: '是',
    status: '正常',
    content:
      '这篇攻略按线路准备、海拔适应、补给节点和住宿节奏拆分整理，适合首次规划长线西藏行程的用户。\n\n建议优先确定时间窗口，再按区域拆解每日行程强度。',
    distance: '2200km',
    duration: '10天9晚',
    transport: '自驾',
    delete_time: '',
  },
  {
    id: 'G002',
    cover_img:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=480&q=80',
    title: '青海湖骑行七日计划',
    nickname: '骑行长歌',
    category: '骑行',
    tags: ['青海湖', '补给', '骑行'],
    difficulty: '中高等',
    publish_time: '2026-07-18 09:20:00',
    view_count: 4210,
    like_count: 468,
    collect_count: 820,
    comment_count: 71,
    heat: 5569,
    is_slide: '是',
    status: '正常',
    content:
      '攻略覆盖环湖节奏安排、逆风路段、住宿补给点和车辆保障建议。\n\n如果是第一次做多日骑行，建议预留一天机动时间。',
    distance: '360km',
    duration: '7天6晚',
    transport: '骑行',
    delete_time: '',
  },
  {
    id: 'G003',
    cover_img:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=480&q=80',
    title: '海边露营新手入门手册',
    nickname: '阿哲露营',
    category: '露营',
    tags: ['露营', '入门'],
    difficulty: '入门',
    publish_time: '2026-07-16 14:05:00',
    view_count: 2860,
    like_count: 332,
    collect_count: 459,
    comment_count: 38,
    heat: 3689,
    is_slide: '否',
    status: '正常',
    content:
      '内容涵盖天幕、桌椅、灯光、防潮和营位选择，适合第一次露营的新手快速上手。\n\n文中把高频出错点都按清单方式整理好了。',
    distance: '80km',
    duration: '2天1晚',
    transport: '自驾',
    delete_time: '',
  },
  {
    id: 'G004',
    cover_img:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=480&q=80',
    title: '四姑娘山双桥沟轻徒步攻略',
    nickname: '旅行达人',
    category: '徒步',
    tags: ['川西', '高原'],
    difficulty: '中等',
    publish_time: '2026-07-14 08:30:00',
    view_count: 1940,
    like_count: 210,
    collect_count: 305,
    comment_count: 26,
    heat: 2481,
    is_slide: '否',
    status: '已下架',
    content:
      '这篇攻略重点整理了交通接驳、观景点分布和轻装徒步建议。\n\n由于路线信息待更新，当前先保留为下架状态。',
    distance: '12km',
    duration: '1天',
    transport: '大巴',
    delete_time: '',
  },
  {
    id: 'G005',
    cover_img:
      'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=480&q=80',
    title: '城市夜跑训练路线推荐',
    nickname: '小风跑者',
    category: '跑步',
    tags: ['夜跑', '路线'],
    difficulty: '入门',
    publish_time: '2026-07-12 20:10:00',
    view_count: 1380,
    like_count: 165,
    collect_count: 102,
    comment_count: 21,
    heat: 1668,
    is_slide: '否',
    status: '正常',
    content:
      '攻略按公园、江边和城市道路三类路线给出建议，同时整理了照明、安全和补水点选择方法。\n\n适合从休闲跑过渡到系统训练的用户。',
    distance: '10km',
    duration: '1.5小时',
    transport: '步行',
    delete_time: '',
  },
  {
    id: 'G006',
    cover_img:
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=480&q=80',
    title: '阳朔攀岩周末安排指南',
    nickname: '攀岩教官子恒',
    category: '攀岩',
    tags: ['攀岩', '阳朔'],
    difficulty: '中高等',
    publish_time: '2026-07-10 18:40:00',
    view_count: 1760,
    like_count: 205,
    collect_count: 244,
    comment_count: 33,
    heat: 2242,
    is_slide: '否',
    status: '正常',
    content:
      '攻略覆盖装备准备、馆内热身、野外线路切换和天气判断，适合有一定基础的周末短途用户。\n\n建议提前联系当地教练确认场地开放情况。',
    distance: '950km',
    duration: '2天1晚',
    transport: '高铁',
    delete_time: '',
  },
  {
    id: 'G007',
    cover_img:
      'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?auto=format&fit=crop&w=480&q=80',
    title: '武功山两天一夜徒步攻略',
    nickname: '山野记录者',
    category: '登山',
    tags: ['武功山', '营地'],
    difficulty: '高等',
    publish_time: '2026-07-08 11:15:00',
    view_count: 3988,
    like_count: 402,
    collect_count: 690,
    comment_count: 58,
    heat: 5138,
    is_slide: '是',
    status: '正常',
    content:
      '这篇攻略重点在营地选择、爬升节奏、补水节点和天气窗口判断。\n\n如果体能一般，建议把日出安排放到第二天早晨而不是强行夜爬。',
    distance: '18km',
    duration: '2天1晚',
    transport: '大巴',
    delete_time: '',
  },
  {
    id: 'G008',
    cover_img:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=480&q=80',
    title: '溯溪路线装备准备指南',
    nickname: '溪行玩家',
    category: '溯溪',
    tags: ['溯溪', '装备'],
    difficulty: '中等',
    publish_time: '2026-07-06 16:55:00',
    view_count: 1540,
    like_count: 144,
    collect_count: 188,
    comment_count: 24,
    heat: 1896,
    is_slide: '否',
    status: '正常',
    content:
      '攻略从鞋袜、防水包、绳索和应急药品四个维度整理了常见装备搭配。\n\n更偏向周末短线和新中级用户使用。',
    distance: '6km',
    duration: '5小时',
    transport: '包车',
    delete_time: '',
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
  热度: 'heat',
  浏览量: 'view_count',
  点赞量: 'like_count',
  评论量: 'comment_count',
  收藏量: 'collect_count',
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

const normalizeEdit = (body?: EditBody | string): EditBody => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as EditBody;
    } catch {
      return {};
    }
  }

  return body;
};

const pageResult = (source: GuideMockItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = source.filter((item) => {
    return (
      includesText(item.title, query.title) &&
      matchSelect(item.category, query.category) &&
      matchSelect(item.difficulty, query.difficulty) &&
      matchSelect(item.is_slide, query.is_slide) &&
      matchDate(item.publish_time, query.begin_time, query.finish_time)
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
  'GET /api/v1/admin/guides': (req: any, res: any) => {
    res.json(pageResult(guideList, req.query || {}));
  },
  'GET /api/v1/admin/guides/:id': (req: any, res: any) => {
    const current = guideList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '攻略不存在',
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
  'PUT /api/v1/admin/guides/:id': (req: any, res: any) => {
    const current = guideList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '攻略不存在',
        data: null,
      });
      return;
    }

    const body = normalizeEdit(req.body);

    if (body.category) {
      current.category = body.category;
    }

    if (body.difficulty) {
      current.difficulty = body.difficulty;
    }

    if (body.status) {
      current.status = body.status === '下架' ? '已下架' : body.status;
    }

    if (body.is_slide !== undefined) {
      current.is_slide =
        body.is_slide === true ||
        body.is_slide === 'true' ||
        body.is_slide === '是'
          ? '是'
          : '否';
    }

    res.json({
      code: 0,
      message: '更新成功',
      data: current,
    });
  },
  'DELETE /api/v1/admin/guides/:id': (req: any, res: any) => {
    const index = guideList.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: '攻略不存在',
        data: null,
      });
      return;
    }

    guideList.splice(index, 1);

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
  'POST /api/v1/admin/guides/batch-delete': (req: any, res: any) => {
    const body = normalizeBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));

    for (let i = guideList.length - 1; i >= 0; i -= 1) {
      if (ids.has(guideList[i].id)) {
        guideList.splice(i, 1);
      }
    }

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
  'POST /api/v1/admin/guides/export': (req: any, res: any) => {
    const body = normalizeBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));
    const rows = guideList.filter((item) => ids.has(item.id));
    const content = exportText(
      [
        'ID',
        '标题',
        '分类',
        '标签',
        '难度',
        '发布人',
        '发布时间',
        '浏览量',
        '点赞',
        '收藏',
        '评论',
        '热度',
        '幻灯片',
        '状态',
      ],
      rows.map((item) => [
        item.id,
        item.title,
        item.category,
        item.tags.join(' / '),
        item.difficulty,
        item.nickname,
        item.publish_time,
        item.view_count,
        item.like_count,
        item.collect_count,
        item.comment_count,
        item.heat,
        item.is_slide,
        item.status,
      ]),
    );

    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      "attachment; filename*=UTF-8''guides.xls",
    );
    res.send(`\uFEFF${content}`);
  },
};
