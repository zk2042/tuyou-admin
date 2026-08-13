import type { TagItem } from '@/services/tag/types';

// Mock 数据比 TagItem 多一个 is_hot 字段（编辑时会用到）
type TagMockItem = TagItem;

interface PageQuery {
  page?: string;
  size?: string;
  tag_name?: string;
  status?: string;
  begin_time?: string;
  finish_time?: string;
}

interface CreateBody {
  tag_name?: string;
  status?: string;
}

interface EditBody {
  status?: string;
  is_hot?: string;
}

interface BatchBody {
  ids?: string[];
}

// 造 18 条假数据，覆盖启用/禁用、热门/非热门
const tagList: TagMockItem[] = [
  {
    id: '1',
    tag_name: '徒步',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-01 10:00:00',
    delete_time: '',
  },
  {
    id: '2',
    tag_name: '露营',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-02 11:00:00',
    delete_time: '2026-08-06 10:00:00',
  },
  {
    id: '3',
    tag_name: '骑行',
    status: '启用',
    is_hot: '否',
    created_at: '2026-07-03 12:00:00',
    delete_time: '',
  },
  {
    id: '4',
    tag_name: '摄影',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-04 13:00:00',
    delete_time: '',
  },
  {
    id: '5',
    tag_name: '美食',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-05 14:00:00',
    delete_time: '',
  },
  {
    id: '6',
    tag_name: '潜水',
    status: '禁用',
    is_hot: '否',
    created_at: '2026-07-06 15:00:00',
    delete_time: '',
  },
  {
    id: '7',
    tag_name: '攀岩',
    status: '启用',
    is_hot: '否',
    created_at: '2026-07-07 16:00:00',
    delete_time: '',
  },
  {
    id: '8',
    tag_name: '滑雪',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-08 17:00:00',
    delete_time: '2026-08-02 10:00:00',
  },
  {
    id: '9',
    tag_name: '自驾',
    status: '启用',
    is_hot: '否',
    created_at: '2026-07-09 18:00:00',
    delete_time: '',
  },
  {
    id: '10',
    tag_name: '穷游',
    status: '禁用',
    is_hot: '否',
    created_at: '2026-07-10 19:00:00',
    delete_time: '',
  },
  {
    id: '11',
    tag_name: '亲子游',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-11 20:00:00',
    delete_time: '',
  },
  {
    id: '12',
    tag_name: '蜜月旅行',
    status: '启用',
    is_hot: '否',
    created_at: '2026-07-12 21:00:00',
    delete_time: '',
  },
  {
    id: '13',
    tag_name: '古镇',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-13 22:00:00',
    delete_time: '',
  },
  {
    id: '14',
    tag_name: '海岛',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-14 23:00:00',
    delete_time: '',
  },
  {
    id: '15',
    tag_name: '雪山',
    status: '启用',
    is_hot: '否',
    created_at: '2026-07-15 09:00:00',
    delete_time: '2026-08-07 10:00:00',
  },
  {
    id: '16',
    tag_name: '沙漠',
    status: '禁用',
    is_hot: '否',
    created_at: '2026-07-16 10:00:00',
    delete_time: '',
  },
  {
    id: '17',
    tag_name: '草原',
    status: '启用',
    is_hot: '是',
    created_at: '2026-07-17 11:00:00',
    delete_time: '',
  },
  {
    id: '18',
    tag_name: '温泉',
    status: '启用',
    is_hot: '否',
    created_at: '2026-07-18 12:00:00',
    delete_time: '',
  },
];

// 模糊匹配标签名
const includesText = (source: string, keyword?: string) => {
  if (!keyword) {
    return true;
  }
  return source.toLowerCase().includes(keyword.trim().toLowerCase());
};

// 精确匹配状态
const matchSelect = (source: string, current?: string) => {
  if (!current) {
    return true;
  }
  return source === current;
};

// 时间范围匹配（created_at 在 [begin_time, finish_time] 之间）
const matchDate = (value: string, start?: string, end?: string) => {
  if (start && value < start) {
    return false;
  }
  if (end && value > end) {
    return false;
  }
  return true;
};

// 规范化 POST body（Umi mock 有时会传字符串）
const normalizeBody = <T>(body?: T | string): T => {
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

// 分页 + 筛选（标签名 + 状态 + 创建时间范围）
const pageResult = (source: TagMockItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);

  const filtered = source.filter((item) => {
    return (
      includesText(item.tag_name, query.tag_name) &&
      matchSelect(item.status, query.status) &&
      matchDate(item.created_at, query.begin_time, query.finish_time)
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

// 格式化当前时间
const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default {
  // 1. 分页查询列表（支持 tag_name / status / begin_time / finish_time）
  'GET /__mock/api/v1/admin/tags': (req: any, res: any) => {
    res.json(pageResult(tagList, req.query || {}));
  },

  // 2. 新增标签
  'POST /__mock/api/v1/admin/tags': (req: any, res: any) => {
    const body = normalizeBody<CreateBody>(req.body);

    if (!body.tag_name) {
      res.status(400).json({
        code: 400,
        message: '标签名称不能为空',
        data: null,
      });
      return;
    }

    // 名称重复校验
    const exists = tagList.some((item) => item.tag_name === body.tag_name);
    if (exists) {
      res.status(400).json({
        code: 400,
        message: '标签名称已存在',
        data: null,
      });
      return;
    }

    const newTag: TagMockItem = {
      id: String(Date.now()),
      tag_name: body.tag_name,
      status: body.status || '启用',
      is_hot: '否',
      created_at: now(),
      delete_time: '',
    };

    tagList.unshift(newTag);

    res.json({
      code: 0,
      message: '创建成功',
      data: newTag,
    });
  },

  // 3. 编辑标签（改 status + is_hot）
  'PUT /__mock/api/v1/admin/tags/:id': (req: any, res: any) => {
    const body = normalizeBody<EditBody>(req.body);
    const index = tagList.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: '标签不存在',
        data: null,
      });
      return;
    }

    tagList[index] = {
      ...tagList[index],
      status: body.status ?? tagList[index].status,
      is_hot: body.is_hot ?? tagList[index].is_hot,
    };

    res.json({
      code: 0,
      message: '更新成功',
      data: tagList[index],
    });
  },

  // 4. 删除标签
  'DELETE /__mock/api/v1/admin/tags/:id': (req: any, res: any) => {
    const index = tagList.findIndex((item) => item.id === req.params.id);

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: '标签不存在',
        data: null,
      });
      return;
    }

    tagList.splice(index, 1);

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },

  // 5. 批量删除
  'POST /__mock/api/v1/admin/tags/batch-delete': (req: any, res: any) => {
    const body = normalizeBody<BatchBody>(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));

    let deleted = 0;
    for (let i = tagList.length - 1; i >= 0; i -= 1) {
      if (ids.has(tagList[i].id)) {
        tagList.splice(i, 1);
        deleted += 1;
      }
    }

    res.json({
      code: 0,
      message: `已删除 ${deleted} 条标签`,
      data: null,
    });
  },
};
