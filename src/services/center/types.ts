import type { CurrentInfo } from '@/services/auth';

export type NameBody = Pick<CurrentInfo, 'username'>;

export type AvatarBody = Pick<CurrentInfo, 'avatar'>;

export type NoticeQuery = {
  page: number;
  size: number;
};

export type NoticeItem = {
  id: string;
  type: 0 | 1 | 2;
  content: string;
  is_read: 0 | 1;
  send_time: string;
};

export type NoticeData = {
  list: NoticeItem[];
  total: number;
  page: number;
  size: number;
  total_page: number;
};

export type CountData = {
  unread_count: number;
};
