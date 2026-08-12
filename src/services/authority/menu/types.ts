export interface MenuQuery {
  menu_name?: string;
  status?: string;
}

export interface ParentMenu {
  id: string;
  menu_name: string;
}

export type MenuType = '目录' | '菜单';

export interface MenuItem {
  id: string;
  menu_name: string;
  parent_id: string;
  parent_name: string;
  menu_type: 1 | 2;
  menu_type_name: MenuType;
  route_path: string;
  component: string;
  icon: string;
  hide_in_menu: 0 | 1;
  sort: number;
  status: string;
  create_time: string;
  children?: MenuItem[];
}

export interface MenuBody {
  menu_name: string;
  parent_name: string | null;
  menu_type: MenuType;
  route_path: string;
  component: string;
  icon: string;
  hide_in_menu: boolean;
  sort: number;
  status: string;
}
