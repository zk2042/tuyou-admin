export type AuthMenu = {
  id: string | number;
  menu_name: string;
  parent_id: string | number;
  menu_type: number;
  route_path: string;
  component?: string;
  icon: string;
  hide_in_menu: boolean | number;
  sort: number;
  children: AuthMenu[] | null;
};

export type CurrentInfo = {
  id: string;
  username: string;
  adminname: string;
  role: string;
  avatar: string;
  status: string;
  menu_tree: AuthMenu[];
  perm_keys: string[];
};

export type PwdBody = {
  old_password: string;
  new_password: string;
};
