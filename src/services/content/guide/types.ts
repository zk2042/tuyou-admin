export interface GuideQuery {
  page: number;
  size: number;
  title?: string;
  category?: string;
  difficulty?: string;
  is_slide?: string;
  sort_field?: string;
  sort_order?: string;
  begin_time?: string;
  finish_time?: string;
}

export interface GuideEditReq {
  category: string;
  is_slide: string;
  status: string;
}

export interface BatchReq {
  ids: string[];
}

export interface GuideItem {
  id: string;
  cover_img: string;
  title: string;
  nickname: string;
  category: string;
  tags: string[] | null;
  difficulty: string;
  publish_time: string;
  view_count: number;
  like_count: number;
  collect_count: number;
  comment_count: number;
  heat: number;
  is_slide: string;
  status: string;
}

export interface GuideDetail extends GuideItem {
  content: string;
  distance: string;
  duration: string;
  transport: string;
  delete_time: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
