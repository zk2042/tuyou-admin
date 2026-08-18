export interface SensitiveWordQuery {
  page: number;
  size: number;
  keyword?: string;
}

export interface SensitiveWordItem {
  id: string;
  word: string;
  create_time: string;
}

export type SensitiveWordDetail = SensitiveWordItem;

export interface SensitiveWordCreate {
  word: string;
}

export interface BatchReq {
  ids: string[];
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
