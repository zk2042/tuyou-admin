export interface ManagerQuery {
  page: number;
  size: number;
  username?: string;
  role?: string;
  status?: string;
}

export interface ManagerItem {
  id: string;
  username: string;
  adminname: string;
  role: string;
  status: string;
  create_time: string;
  last_login: string;
}

export interface ManagerCreate {
  username: string;
  adminname: string;
  password: string;
  role: string;
}

export interface ManagerEdit {
  username: string;
  adminname: string;
  role: string;
  status: string;
}

export interface ManagerResetPassword {
  new_password: string;
}

export interface RoleName {
  id: number;
  role_name: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
