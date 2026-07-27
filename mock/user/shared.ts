export interface UserItem {
  id: string | number;
  avatar: string;
  cover?: string;
  cover_style?: string;
  nickname: string;
  phone: string;
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
  id?: string | number,
): T | undefined => {
  return source.find((item) => String(item.id) === String(id));
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
