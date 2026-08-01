import type { ActDetail } from '@/services/activity/types';
import { exportText } from './user/shared';

type ActivityMockItem = ActDetail & {
  address?: string;
  create_time: string;
};

interface CreateBody {
  title?: string;
  leader_name?: string;
  cover_img?: string;
  activity_type?: string;
  address?: string;
  start_time?: string;
  end_time?: string;
  max_people?: number;
  price?: number;
  difficulty?: string;
  activity_content?: string;
}

interface EditBody {
  is_slide?: boolean | string;
}

interface BatchBody {
  ids?: string[];
}

interface PageQuery {
  page?: string;
  size?: string;
  title?: string;
  leader_name?: string;
  activity_type?: string;
  difficulty?: string;
  fee?: string;
  activity_status?: string;
  is_slide?: string;
  begin_time?: string;
  finish_time?: string;
}

interface LeaderItem {
  id: string;
  leader_name: string;
}

const coverList = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=240&q=80',
];

const leaderList: LeaderItem[] = [
  { id: 'M001', leader_name: '登山领队小王登山领队' },
  { id: 'M002', leader_name: '骑行长歌' },
  { id: 'M003', leader_name: '户外达人' },
  { id: 'M004', leader_name: '攀岩教练' },
  { id: 'M005', leader_name: '徒步导师' },
  { id: 'M006', leader_name: '山林率人' },
  { id: 'M007', leader_name: '露营领队阿哲' },
  { id: 'M008', leader_name: '徒步队长阿远' },
  { id: 'M009', leader_name: '骑行教练木子' },
  { id: 'M010', leader_name: '攀岩教官子恒' },
  { id: 'M011', leader_name: '高山向导阿布' },
  { id: 'M012', leader_name: '阿海' },
];

const activityList: ActivityMockItem[] = [
  {
    id: 'A001',
    cover_img: coverList[0],
    title: '四姑娘山大峰攀登大峰攀登',
    leader_member_id: 'M001',
    leader_name: '登山领队小王登山领队',
    activity_type: '登山',
    start_time: '2026-08-15',
    end_time: '2026-08-17',
    price: 1280,
    current_people: 8,
    max_people: 20,
    difficulty: '中等',
    is_slide: '是',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '集合后从映秀统一乘车进山，第一天完成营地适应与基础技术讲解，第二天凌晨冲顶后下撤返程。\n\n线路包含基础高山行走、碎石坡通过和简单绳结教学，适合有一定徒步经验的用户。',
    delete_time: null,
    create_time: '2026-07-12',
  },
  {
    id: 'A002',
    cover_img: coverList[1],
    title: '青海湖环湖骑行',
    leader_member_id: 'M002',
    leader_name: '骑行长歌',
    activity_type: '骑行',
    start_time: '2026-08-20',
    end_time: '2026-08-25',
    price: 2580,
    current_people: 15,
    max_people: 30,
    difficulty: '中高等',
    is_slide: '是',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '活动全程配备领骑与收队，按照湖区补给点分段推进。\n\n行程包含车辆保障、途中补给和高原骑行注意事项说明。',
    delete_time: null,
    create_time: '2026-07-10',
  },
  {
    id: 'A003',
    cover_img: coverList[2],
    title: '川西秋色露营之旅',
    leader_member_id: 'M003',
    leader_name: '户外达人',
    activity_type: '露营',
    start_time: '2026-07-28',
    end_time: '2026-07-30',
    price: 880,
    current_people: 20,
    max_people: 20,
    difficulty: '入门',
    is_slide: '否',
    activity_status: '进行中',
    is_del: '已删除',
    activity_content:
      '川西营地活动包含天幕搭建、基础炉具使用和夜间营地活动。\n\n因档期调整该活动已删除，仅用于展示删除态详情。',
    delete_time: '2026-07-05 10:00:00',
    create_time: '2026-07-01',
  },
  {
    id: 'A004',
    cover_img: coverList[3],
    title: '阳朔攀岩体验营',
    leader_member_id: 'M004',
    leader_name: '攀岩教练',
    activity_type: '攀岩',
    start_time: '2026-09-05',
    end_time: '2026-09-07',
    price: 1680,
    current_people: 6,
    max_people: 12,
    difficulty: '高等',
    is_slide: '否',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '课程包含热身、线路阅读、保护站位和基础坠落练习。\n\n现场提供公共装备，建议自备贴身速干衣物和攀岩鞋。',
    delete_time: null,
    create_time: '2026-07-20',
  },
  {
    id: 'A005',
    cover_img: coverList[4],
    title: '虎跳峡徒步穿越',
    leader_member_id: 'M005',
    leader_name: '徒步导师',
    activity_type: '徒步',
    start_time: '2026-07-15',
    end_time: '2026-07-17',
    price: 1580,
    current_people: 18,
    max_people: 18,
    difficulty: '中等',
    is_slide: '否',
    activity_status: '已结束',
    is_del: '已删除',
    activity_content:
      '线路分两天完成，包含峡谷步道穿越与观景平台停留。\n\n该活动已结束并删除，详情保留用于历史记录查看。',
    delete_time: '2026-07-18 08:30:00',
    create_time: '2026-06-28',
  },
  {
    id: 'A006',
    cover_img: coverList[4],
    title: '太行山轻徒步',
    leader_member_id: 'M006',
    leader_name: '山林率人',
    activity_type: '徒步',
    start_time: '2026-07-21',
    end_time: '2026-07-22',
    price: 699,
    current_people: 21,
    max_people: 24,
    difficulty: '中等',
    is_slide: '否',
    activity_status: '已结束',
    is_del: '正常',
    activity_content:
      '周末短线徒步活动，节奏轻松，适合刚开始接触户外活动的用户。\n\n领队会在出发前统一说明装备和补水建议。',
    delete_time: null,
    create_time: '2026-06-25',
  },
  {
    id: 'A007',
    cover_img: coverList[1],
    title: '莫干山竹海露营夜话',
    leader_member_id: 'M007',
    leader_name: '露营领队阿哲',
    activity_type: '露营',
    start_time: '2026-08-06',
    end_time: '2026-08-07',
    price: 0,
    current_people: 16,
    max_people: 30,
    difficulty: '入门',
    is_slide: '是',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '活动包含营地搭建、晚间篝火交流和次日轻徒步。\n\n路线强度较低，适合亲友结伴参加。',
    delete_time: null,
    create_time: '2026-07-08',
  },
  {
    id: 'A008',
    cover_img: coverList[0],
    title: '武功山草甸穿越',
    leader_member_id: 'M008',
    leader_name: '徒步队长阿远',
    activity_type: '徒步',
    start_time: '2026-09-12',
    end_time: '2026-09-14',
    price: 1999,
    current_people: 11,
    max_people: 16,
    difficulty: '高等',
    is_slide: '否',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '武功山线路包含草甸穿越、营地扎营和晨间云海观景。\n\n建议参与者具备连续爬升徒步经验。',
    delete_time: null,
    create_time: '2026-07-14',
  },
  {
    id: 'A009',
    cover_img: coverList[2],
    title: '千岛湖环线骑行',
    leader_member_id: 'M009',
    leader_name: '骑行教练木子',
    activity_type: '骑行',
    start_time: '2026-08-18',
    end_time: '2026-08-19',
    price: 980,
    current_people: 24,
    max_people: 24,
    difficulty: '中等',
    is_slide: '是',
    activity_status: '已结束',
    is_del: '正常',
    activity_content:
      '路线按配速分组骑行，补给车可处理中途体力不支和物资补给。\n\n适合希望体验中距离环湖骑行的用户。',
    delete_time: null,
    create_time: '2026-07-03',
  },
  {
    id: 'A010',
    cover_img: coverList[3],
    title: '飞拉达攀岩初阶课',
    leader_member_id: 'M010',
    leader_name: '攀岩教官子恒',
    activity_type: '攀岩',
    start_time: '2026-08-23',
    end_time: '2026-08-23',
    price: 560,
    current_people: 7,
    max_people: 10,
    difficulty: '中等',
    is_slide: '否',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '课程从装备认识开始，逐步进入上墙体验与站位保护训练。\n\n适合第一次接触攀岩和飞拉达项目的用户。',
    delete_time: null,
    create_time: '2026-07-16',
  },
  {
    id: 'A011',
    cover_img: coverList[4],
    title: '梅里雪山雨崩轻装徒步',
    leader_member_id: 'M011',
    leader_name: '高山向导阿布',
    activity_type: '登山',
    start_time: '2026-10-02',
    end_time: '2026-10-06',
    price: null,
    current_people: 5,
    max_people: 14,
    difficulty: '中高等',
    is_slide: '否',
    activity_status: '报名中',
    is_del: '正常',
    activity_content:
      '行程包含村落住宿、雪山观景和长距离徒步进出线路。\n\n领队会根据天气情况调整每日发车和徒步节奏。',
    delete_time: null,
    create_time: '2026-07-18',
  },
  {
    id: 'A012',
    cover_img: coverList[0],
    title: '海边日出轻骑体验',
    leader_member_id: 'M012',
    leader_name: '阿海',
    activity_type: '骑行',
    start_time: '2026-08-02',
    end_time: '2026-08-02',
    price: 0,
    current_people: 19,
    max_people: 25,
    difficulty: '入门',
    is_slide: '是',
    activity_status: '进行中',
    is_del: '已删除',
    activity_content:
      '清晨集合后沿海岸线缓速骑行，中途安排拍照和补给点停留。\n\n由于运营调整，该场活动已删除。',
    delete_time: '2026-07-21 09:20:00',
    create_time: '2026-07-02',
  },
];

const includesText = (source: string, keyword?: string) => {
  if (!keyword) {
    return true;
  }

  return source.toLowerCase().includes(keyword.trim().toLowerCase());
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

const matchSelect = (source: string, current?: string) => {
  if (!current) {
    return true;
  }

  return source === current;
};

const priceType = (price?: number | null) => {
  if (price === null || price === undefined) {
    return '';
  }

  return price > 0 ? '收费' : '免费';
};

const nextId = () => {
  const maxId = activityList.reduce((max, item) => {
    const num = Number(item.id.slice(1));
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return `A${String(maxId + 1).padStart(3, '0')}`;
};

const nextLead = () => {
  const maxId = leaderList.reduce((max, item) => {
    const num = Number(item.id.slice(1));
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return `M${String(maxId + 1).padStart(3, '0')}`;
};

const nowText = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

const parseBatch = (body?: BatchBody | string) => {
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

const pageResult = (source: ActivityMockItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = source.filter((item) => {
    return (
      includesText(item.title, query.title) &&
      matchSelect(item.leader_name, query.leader_name) &&
      matchSelect(item.difficulty, query.difficulty) &&
      matchSelect(priceType(item.price), query.fee) &&
      matchSelect(item.activity_status, query.activity_status) &&
      matchSelect(item.activity_type, query.activity_type) &&
      matchSelect(item.is_slide, query.is_slide) &&
      matchDate(item.start_time, query.begin_time, query.finish_time)
    );
  });
  const start = (page - 1) * size;
  const list = filtered.slice(start, start + size);

  return {
    code: 0,
    message: '成功',
    data: {
      list,
      total: filtered.length,
      page,
      size,
      total_page: Math.ceil(filtered.length / size) || 1,
    },
  };
};

export default {
  'POST /api/v1/admin/upload/image': (_req: any, res: any) => {
    res.json({
      code: 0,
      message: '成功',
      data: {
        url: `https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80&t=${Date.now()}`,
      },
    });
  },
  'GET /api/v1/admin/leadernames': (_req: any, res: any) => {
    res.json({
      code: 0,
      message: '成功',
      data: leaderList,
    });
  },
  'GET /api/v1/admin/activities': (req: any, res: any) => {
    res.json(pageResult(activityList, req.query || {}));
  },
  'GET /api/v1/admin/activities/:id': (req: any, res: any) => {
    const current = activityList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '活动不存在',
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
  'POST /api/v1/admin/activities': (req: any, res: any) => {
    const body = (req.body || {}) as CreateBody;
    const leaderId =
      leaderList.find((item) => item.leader_name === body.leader_name)?.id ||
      nextLead();

    const newItem: ActivityMockItem = {
      id: nextId(),
      cover_img: body.cover_img || '',
      title: body.title || '',
      leader_member_id: leaderId,
      leader_name: body.leader_name || '',
      activity_type: body.activity_type || '',
      address: body.address || '',
      start_time: body.start_time || '',
      end_time: body.end_time || '',
      price: typeof body.price === 'number' ? body.price : null,
      current_people: 0,
      max_people: body.max_people || 0,
      difficulty: body.difficulty || '',
      is_slide: '否',
      activity_status: '报名中',
      is_del: '正常',
      activity_content: body.activity_content || '',
      delete_time: null,
      create_time: nowText(),
    };

    activityList.unshift(newItem);

    res.json({
      code: 0,
      message: '成功',
      data: null,
    });
  },
  'PUT /api/v1/admin/activities/:id': (req: any, res: any) => {
    const current = activityList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '活动不存在',
        data: null,
      });
      return;
    }

    const body = (req.body || {}) as EditBody;
    const nextSlide =
      body.is_slide === true ||
      body.is_slide === 'true' ||
      body.is_slide === '是';

    current.is_slide = nextSlide ? '是' : '否';

    res.json({
      code: 0,
      message: '成功',
      data: current,
    });
  },
  'POST /api/v1/admin/activities/batch-delete': (req: any, res: any) => {
    const body = parseBatch(req.body);
    const ids = Array.isArray(body.ids) ? body.ids : [];

    ids.forEach((id) => {
      const current = activityList.find((item) => item.id === id);

      if (!current) {
        return;
      }

      current.is_del = '已删除';
      current.delete_time = current.delete_time || nowText();
    });

    res.json({
      code: 0,
      message: '成功',
      data: null,
    });
  },
  'POST /api/v1/admin/activities/export': (req: any, res: any) => {
    const body = parseBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));
    const rows = activityList.filter((item) => ids.has(item.id));
    const content = exportText(
      [
        'ID',
        '活动名称',
        '发起人',
        '活动类型',
        '开始时间',
        '结束时间',
        '价格',
        '难度',
        '幻灯片',
        '活动状态',
      ],
      rows.map((item) => [
        item.id,
        item.title,
        item.leader_name,
        item.activity_type,
        item.start_time,
        item.end_time,
        item.price ?? '',
        item.difficulty,
        item.is_slide,
        item.activity_status,
      ]),
    );

    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      "attachment; filename*=UTF-8''activities.xls",
    );
    res.send(`\uFEFF${content}`);
  },
  'DELETE /api/v1/admin/activities/:id': (req: any, res: any) => {
    const current = activityList.find((item) => item.id === req.params.id);

    if (!current) {
      res.status(404).json({
        code: 404,
        message: '活动不存在',
        data: null,
      });
      return;
    }

    current.is_del = '已删除';
    current.delete_time = current.delete_time || nowText();

    res.json({
      code: 0,
      message: '成功',
      data: null,
    });
  },
};
