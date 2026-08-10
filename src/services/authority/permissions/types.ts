export interface PermQuery {
  page: number;
  size: number;
  perm_name?: string;
  module?: string;
  status?: boolean;
}

export interface PermItem {
  id: string;
  perm_name: string;
  module: string;
  perm_key: string;
  status: boolean;
  request_method: string;
  api_path: string;
}

export interface PermBody {
  perm_name: string;
  module: string;
  perm_key: string;
  status: boolean;
  request_method: string;
  api_path: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
