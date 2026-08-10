export interface RoleQuery {
  page: number;
  size: number;
  role_name?: string;
  status?: string;
}

export interface RoleItem {
  id: string;
  role_name: string;
  role_code: string;
  description: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface RoleCreate {
  role_name: string;
  role_code: string;
  description: string;
}

export interface RoleEdit extends RoleCreate {
  status: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
