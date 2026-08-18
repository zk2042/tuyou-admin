import type { SensitiveWordItem } from '@/services/sensitive-word/types';

type SensitiveMockItem = SensitiveWordItem;

interface BatchBody {
  ids?: string[];
}

interface PageQuery {
  page?: string;
  size?: string;
  keyword?: string;
}

const sensitiveWordList: SensitiveMockItem[] = [
  {
    id: '1',
    word: '代开发票',
    create_time: '2026-08-01 10:00:00',
  },
  {
    id: '2',
    word: '高价回收',
    create_time: '2026-08-01 10:05:00',
  },
  {
    id: '3',
    word: '加微信',
    create_time: '2026-08-02 09:10:00',
  },
  {
    id: '4',
    word: '加v信',
    create_time: '2026-08-02 09:12:00',
  },
  {
    id: '5',
    word: '兼职日结',
    create_time: '2026-08-03 14:20:00',
  },
  {
    id: '6',
    word: '贷款代办',
    create_time: '2026-08-03 15:30:00',
  },
  {
    id: '7',
    word: '赌博网站',
    create_time: '2026-08-04 08:40:00',
  },
  {
    id: '8',
    word: '色情链接',
    create_time: '2026-08-04 11:15:00',
  },
  {
    id: '9',
    word: '官方指定',
    create_time: '2026-08-05 16:22:00',
  },
  {
    id: '10',
    word: '仅此一次',
    create_time: '2026-08-05 17:08:00',
  },
  {
    id: '11',
    word: '免费领取',
    create_time: '2026-08-06 09:35:00',
  },
  {
    id: '12',
    word: '中奖通知',
    create_time: '2026-08-06 10:47:00',
  },
  {
    id: '13',
    word: '客服热线',
    create_time: '2026-08-07 13:15:00',
  },
  {
    id: '14',
    word: '银行卡号',
    create_time: '2026-08-07 14:02:00',
  },
  {
    id: '15',
    word: '刷单返现',
    create_time: '2026-08-08 10:50:00',
  },
];

const includesText = (source: string, keyword?: string) => {
  if (!keyword) {
    return true;
  }

  return source.toLowerCase().includes(keyword.trim().toLowerCase());
};

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

const pageResult = (source: SensitiveMockItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = source.filter((item) => {
    return includesText(item.word, query.keyword);
  });
  const sorted = [...filtered].sort((prev, next) => {
    const t1 = new Date(prev.create_time).getTime();
    const t2 = new Date(next.create_time).getTime();

    return t2 - t1;
  });

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
  'GET /__mock/api/v1/admin/sensitive-words': (req: any, res: any) => {
    res.json(pageResult(sensitiveWordList, req.query || {}));
  },
  'POST /__mock/api/v1/admin/sensitive-words': (req: any, res: any) => {
    const body = req.body as { word?: string };
    const word = (body?.word ?? '').trim();

    if (!word) {
      res.json({
        code: 400,
        message: '敏感词不能为空',
        data: null,
      });
      return;
    }

    const exists = sensitiveWordList.some(
      (item) => item.word.toLowerCase() === word.toLowerCase(),
    );

    if (exists) {
      res.json({
        code: 400,
        message: '敏感词已存在',
        data: null,
      });
      return;
    }

    const nextId = sensitiveWordList.length
      ? String(Number(sensitiveWordList[sensitiveWordList.length - 1].id) + 1)
      : '1';
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const createTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds(),
    )}`;
    const item: SensitiveMockItem = {
      id: nextId,
      word,
      create_time: createTime,
    };
    sensitiveWordList.push(item);

    res.json({
      code: 0,
      message: '新增敏感词成功',
      data: item,
    });
  },
  'DELETE /__mock/api/v1/admin/sensitive-words/:id': (req: any, res: any) => {
    const index = sensitiveWordList.findIndex(
      (item) => item.id === req.params.id,
    );

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: '敏感词不存在',
        data: null,
      });
      return;
    }

    const removed = sensitiveWordList.splice(index, 1);

    res.json({
      code: 0,
      message: '删除成功',
      data: removed[0],
    });
  },
  'POST /__mock/api/v1/admin/sensitive-words/batch-delete': (
    req: any,
    res: any,
  ) => {
    const body = normalizeBatch(req.body);
    const ids = new Set((body.ids || []).map((id) => String(id)));

    for (let i = sensitiveWordList.length - 1; i >= 0; i -= 1) {
      if (ids.has(sensitiveWordList[i].id)) {
        sensitiveWordList.splice(i, 1);
      }
    }

    res.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  },
};
