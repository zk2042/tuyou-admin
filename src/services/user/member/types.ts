export interface MemberQuery {
  page: number;
  size: number;
  id?: string;
  nickname?: string;
  phone?: string;
  register_start?: string;
  register_end?: string;
  status?: string;
}

export interface MemberItem {
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

export interface MemberEdit {
  status?: string;
  role?: '普通会员' | '领队';
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
