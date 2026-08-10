export interface MenuQuery {
  page: number;
  size: number;
  menu_name?: string;
  status?: string;
}

export type MenuType = '目录' | '菜单';

export interface MenuItem {
  id: string;
  menu_name: string;
  parent_name: string | null;
  menu_type: MenuType;
  route_path: string;
  sort: number;
  status: string;
  create_time: string;
  update_time: string;
}

export interface MenuBody {
  menu_name: string;
  parent_name: string | null;
  menu_type: MenuType;
  route_path: string;
  sort: number;
  status: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
