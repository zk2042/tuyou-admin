export interface UserItem {
  id: string;
  avatar: string;
  bg_img?: string;
  nickname: string;
  phone: string;
  follow_count: number;
  favorite_count: number;
  publish_count: number;
  fans_count: number;
  status: string;
  bio: string;
  role: string;
  register_time: string;
  last_login: string;
}

export interface PageQuery {
  page?: string;
  size?: string;
  id?: string;
  nickname?: string;
  phone?: string;
  register_start?: string;
  register_end?: string;
}

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

export const pageResult = <T extends UserItem>(
  source: T[],
  query: PageQuery,
) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);
  const filtered = source.filter((item) => {
    return (
      includesText(String(item.id), query.id) &&
      includesText(item.nickname, query.nickname) &&
      includesText(item.phone, query.phone) &&
      matchDate(item.register_time, query.register_start, query.register_end)
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

export const detailResult = <T>(data: T | null) => {
  if (!data) {
    return {
      code: 404,
      message: '数据不存在',
      data: null,
    };
  }

  return {
    code: 0,
    message: '成功',
    data,
  };
};

export const findItem = <T extends UserItem>(
  source: T[],
  id?: string,
): T | undefined => {
  return source.find((item) => String(item.id) === String(id));
};

interface UpdateData {
  status?: string;
  role?: '普通会员' | '领队';
}

interface BatchData {
  ids?: string[];
}

interface BatchStatusData extends BatchData {
  status?: string;
}

const normalizeUpdate = (body?: UpdateData | string): UpdateData => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as UpdateData;
    } catch {
      return {};
    }
  }

  return body;
};

const normalizeBatch = (body?: BatchData | string): BatchData => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as BatchData;
    } catch {
      return {};
    }
  }

  return body;
};

const normalizeBatchStatus = (
  body?: BatchStatusData | string,
): BatchStatusData => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as BatchStatusData;
    } catch {
      return {};
    }
  }

  return body;
};

export const updateItem = <T extends UserItem>(
  source: T[],
  id?: string,
  body?: UpdateData | string,
) => {
  const current = findItem(source, id);

  if (!current) {
    return detailResult(null);
  }

  const data = normalizeUpdate(body);

  if (data.status) {
    current.status = data.status;
  }

  if (data.role) {
    current.role = data.role;
  }

  return detailResult(current);
};

export const removeItem = <T extends UserItem>(source: T[], id?: string) => {
  const index = source.findIndex((item) => String(item.id) === String(id));

  if (index < 0) {
    return detailResult(null);
  }

  source.splice(index, 1);

  return {
    code: 0,
    message: '删除成功',
    data: null,
  };
};

export const removeItems = <T extends UserItem>(
  source: T[],
  body?: BatchData | string,
) => {
  const data = normalizeBatch(body);
  const ids = new Set((data.ids || []).map((id) => String(id)));

  if (!ids.size) {
    return {
      code: 400,
      message: '请选择要删除的数据',
      data: null,
    };
  }

  for (let i = source.length - 1; i >= 0; i -= 1) {
    if (ids.has(String(source[i].id))) {
      source.splice(i, 1);
    }
  }

  return {
    code: 0,
    message: '删除成功',
    data: null,
  };
};

export const updateStatusItems = <T extends UserItem>(
  source: T[],
  body?: BatchStatusData | string,
) => {
  const data = normalizeBatchStatus(body);
  const ids = new Set((data.ids || []).map((id) => String(id)));

  if (!ids.size) {
    return {
      code: 400,
      message: '请选择要修改状态的数据',
      data: null,
    };
  }

  if (!data.status) {
    return {
      code: 400,
      message: '请选择目标状态',
      data: null,
    };
  }

  const nextStatus = data.status;

  source.forEach((item) => {
    if (ids.has(item.id)) {
      item.status = nextStatus;
    }
  });

  return {
    code: 0,
    message: '状态更新成功',
    data: null,
  };
};

const escapeCell = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
};

export const exportText = (
  headers: string[],
  rows: Array<Array<string | number | undefined>>,
) => {
  const head = headers.join('\t');
  const body = rows.map((row) => row.map(escapeCell).join('\t'));

  return [head, ...body].join('\n');
};
