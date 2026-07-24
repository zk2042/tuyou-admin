export type UserStatus = 'enabled' | 'disabled';

export interface UserItem {
  id: string;
  avatar: string;
  nickname: string;
  mobile: string;
  status: UserStatus;
  signature: string;
  role: string;
  registeredAt: string;
  lastLogin: string;
}

export interface PageQuery {
  page?: string;
  size?: string;
  id?: string;
  nickname?: string;
  mobile?: string;
  registeredAtStart?: string;
  registeredAtEnd?: string;
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
      includesText(item.id, query.id) &&
      includesText(item.nickname, query.nickname) &&
      includesText(item.mobile, query.mobile) &&
      matchDate(
        item.registeredAt,
        query.registeredAtStart,
        query.registeredAtEnd,
      )
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
