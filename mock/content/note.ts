import type { NoteDetail } from '@/services/content/note/types';
import { exportText } from '../user/shared';

type NoteMockItem = NoteDetail;

interface EditBody {
  category?: string;
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
  is_slide?: string;
  sort_field?: string;
  sort_order?: string;
  begin_time?: string;
  finish_time?: string;
}

const noteList: NoteMockItem[] = [
  {
    id: 'N001',
    cover_img:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=480&q=80',
    title: '稻城亚丁徒步攻略笔记',
    nickname: '旅行达人',
    category: '徒步',
    tags: ['川西', '稻城'],
    publish_time: '2026-07-20 00:00:00',
    view_count: 2340,
    like_count: 328,
    collect_count: 120,
    comment_count: 56,
    heat: 2844,
    is_slide: '是',
    status: '正常',
    content:
      '这条路线建议拆成三天完成，第一天适应海拔，第二天重点走长线，第三天回收营地返程。\n\n装备上优先准备防晒、保暖和轻量化雨具，体能分配要尽量均匀。',
    delete_time: '',
  },
  {
    id: 'N002',
    cover_img:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=480&q=80',
    title: '海边露营避坑清单',
    nickname: '阿哲露营',
    category: '露营',
    tags: ['海岸', '天幕', '装备'],
    publish_time: '2026-07-18 09:20:00',
    view_count: 1890,
    like_count: 276,
    collect_count: 143,
    comment_count: 42,
    heat: 2351,
    is_slide: '否',
    status: '正常',
    content:
      '海边露营最容易忽略的是防潮和风向判断，天幕要优先看地形和固定点。\n\n建议提前查看潮汐表，避免低洼营位带来的返潮问题。',
    delete_time: '',
  },
  {
    id: 'N003',
    cover_img:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=480&q=80',
    title: '青海湖骑行路线补给点整理',
    nickname: '骑行长歌',
    category: '骑行',
    tags: ['青海湖', '补给'],
    publish_time: '2026-07-16 14:05:00',
    view_count: 3210,
    like_count: 419,
    collect_count: 238,
    comment_count: 65,
    heat: 3932,
    is_slide: '是',
    status: '正常',
    content:
      '环湖骑行建议按逆时针规划，补给点和风向体验会更友好。\n\n文中整理了常见驿站、住宿点和适合休整的补水位置。',
    delete_time: '',
  },
  {
    id: 'N004',
    cover_img:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=480&q=80',
    title: '初次登山怎么准备轻量化背包',
    nickname: '高山向导阿布',
    category: '登山',
    tags: ['背包', '新手'],
    publish_time: '2026-07-14 08:30:00',
    view_count: 1460,
    like_count: 188,
    collect_count: 94,
    comment_count: 28,
    heat: 1770,
    is_slide: '否',
    status: '已下架',
    content:
      '轻量化不是一味减少装备，而是让重量和路线强度匹配。\n\n建议优先优化睡眠系统和备用衣物，避免堆叠低频用品。',
    delete_time: '',
  },
  {
    id: 'N005',
    cover_img:
      'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=480&q=80',
    title: '城市夜跑配速训练记录',
    nickname: '小风跑者',
    category: '跑步',
    tags: ['夜跑', '配速'],
    publish_time: '2026-07-12 20:10:00',
    view_count: 1128,
    like_count: 154,
    collect_count: 66,
    comment_count: 23,
    heat: 1371,
    is_slide: '否',
    status: '正常',
    content:
      '夜跑训练建议采用分段配速方式，前段热身，中段进入目标节奏，最后安排缓和恢复。\n\n城市路线要优先考虑照明和路口安全。',
    delete_time: '',
  },
  {
    id: 'N006',
    cover_img:
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=480&q=80',
    title: '周末攀岩馆训练安排',
    nickname: '攀岩教官子恒',
    category: '攀岩',
    tags: ['训练', '抱石'],
    publish_time: '2026-07-10 18:40:00',
    view_count: 980,
    like_count: 119,
    collect_count: 52,
    comment_count: 19,
    heat: 1170,
    is_slide: '否',
    status: '正常',
    content:
      '攀岩训练应把力量、技巧和恢复拆开安排，不建议连续高强度上墙。\n\n抱石与难度训练可以在同一天错峰进行。',
    delete_time: '',
  },
  {
    id: 'N007',
    cover_img:
      'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?auto=format&fit=crop&w=480&q=80',
    title: '武功山草甸露营拍照机位',
    nickname: '山野记录者',
    category: '露营',
    tags: ['武功山', '拍照'],
    publish_time: '2026-07-08 11:15:00',
    view_count: 2088,
    like_count: 267,
    collect_count: 181,
    comment_count: 49,
    heat: 2585,
    is_slide: '是',
    status: '正常',
    content:
      '草甸机位最关键的是光线窗口和营地位置选择，逆光和顺光都会影响画面层次。\n\n文中按日落、蓝调和清晨分别列了适合的机位。',
    delete_time: '',
  },
  {
    id: 'N008',
    cover_img:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=480&q=80',
    title: '溯溪鞋和防水包怎么选',
    nickname: '溪行玩家',
    category: '溯溪',
    tags: ['鞋子', '防水'],
    publish_time: '2026-07-06 16:55:00',
    view_count: 870,
    like_count: 97,
    collect_count: 41,
    comment_count: 17,
    heat: 1025,
    is_slide: '否',
    status: '正常',
    content:
      '溯溪装备更关注排水和抓地性能，防水包则要兼顾密封性和背负稳定性。\n\n鞋底纹路和脚踝支撑是选择时最核心的两个点。',
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

const pageResult = (source: NoteMockItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = source.filter((item) => {
    return (
      includesText(item.title, query.title) &&
      matchSelect(item.category, query.category) &&
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
  'GET /__mock/api/v1/admin/notes': (req: any, res: any) => {
    res.json(pageResult(noteList, req.query || {}));
  },
  'GET /__mock/api/v1/admin/notes/:id': (req: any, res: any) => {
    const current = noteList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '笔记不存在',
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
  'PUT /__mock/api/v1/admin/notes/:id': (req: any, res: any) => {
    const current = noteList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '笔记不存在',
        data: null,
      });
      return;
    }

    const body = normalizeEdit(req.body);

    if (body.category) {
      current.category = body.category;
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
  'DELETE /__mock/api/v1/admin/notes/:id': (req: any, res: any) => {
    const index = noteList.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: '笔记不存在',
        data: null,
      });
      return;
    }

    noteList.splice(index, 1);

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
  'POST /__mock/api/v1/admin/notes/batch-delete': (req: any, res: any) => {
    const body = normalizeBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));

    for (let i = noteList.length - 1; i >= 0; i -= 1) {
      if (ids.has(noteList[i].id)) {
        noteList.splice(i, 1);
      }
    }

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
  'POST /__mock/api/v1/admin/notes/export': (req: any, res: any) => {
    const body = normalizeBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));
    const rows = noteList.filter((item) => ids.has(item.id));
    const content = exportText(
      [
        'ID',
        '标题',
        '分类',
        '标签',
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
      "attachment; filename*=UTF-8''notes.xls",
    );
    res.send(`\uFEFF${content}`);
  },
};
