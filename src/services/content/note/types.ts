export interface NoteQuery {
  page: number;
  size: number;
  title?: string;
  category?: string;
  is_slide?: string;
  sort_field?: string;
  sort_order?: string;
  begin_time?: string;
  finish_time?: string;
}

export interface EditReq {
  is_slide: string;
}

export interface BatchReq {
  ids: string[];
}

export interface NoteItem {
  id: string;
  cover_img: string;
  title: string;
  nickname: string;
  category: string;
  tags: string[];
  publish_time: string;
  view_count: number;
  like_count: number;
  collect_count: number;
  comment_count: number;
  heat: number;
  is_slide: string;
  status: string;
}

export interface NoteDetail extends NoteItem {
  content: string;
  delete_time: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
