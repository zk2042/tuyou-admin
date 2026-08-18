export interface CommentQuery {
  page: number;
  size: number;
  target_type?: string;
  nickname?: string;
  title?: string;
  begin_time?: string;
  finish_time?: string;
  level?: string;
  sort_field?: string;
  sort_order?: string;
}

export interface BatchReq {
  ids: string[];
}

export interface CommentItem {
  id: string;
  nickname: string;
  avatar: string;
  target_type: string;
  target_title: string;
  content: string;
  level: string;
  reply_to_nickname: string;
  like_count: number;
  heat: number;
  create_time: string;
  status: string;
  delete_time: string;
  is_sensitive?: boolean;
  hit_words?: string[];
}

export type CommentDetail = CommentItem;

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
