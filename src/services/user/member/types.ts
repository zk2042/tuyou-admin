export interface MemberQuery {
  page: number;
  size: number;
  id?: string;
  nickname?: string;
  phone?: string;
  register_start?: string;
  register_end?: string;
}

export interface MemberItem {
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

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
