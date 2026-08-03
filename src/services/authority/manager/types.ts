export interface ManagerQuery {
  page: number;
  size: number;
  username?: string;
  role?: string;
  status?: boolean;
}

export interface ManagerItem {
  id: string;
  username: string;
  adminname: string;
  role: string;
  status: boolean;
  create_time: string;
  last_login: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
