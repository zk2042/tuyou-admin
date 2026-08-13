export interface TagQuery {
  page: number;
  size: number;
  tag_name?: string;
  status?: string;
  begin_time?: string;
  finish_time?: string;
}

export interface CreateReq {
  tag_name: string;
  status: string;
}

export interface EditReq {
  status: string;
  is_hot: string;
}

export interface BatchReq {
  ids: string[];
}

export interface TagItem {
  id: string;
  tag_name: string;
  status: string;
  created_at: string;
  is_hot: string;
  delete_time: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
