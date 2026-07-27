export interface LeaderQuery {
  page: number;
  size: number;
  id?: string;
  nickname?: string;
  phone?: string;
  register_start?: string;
  register_end?: string;
}

export interface LeaderItem {
  id: string | number;
  avatar: string;
  cover?: string;
  cover_style?: string;
  nickname: string;
  phone: string;
  bio: string;
  lead_count: number;
  status: string;
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
