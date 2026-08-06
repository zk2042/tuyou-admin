import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

export type LoginForm = {
  username: string;
  password: string;
  captcha_id: string;
  captcha: string;
};

export type MenuItem = {
  id: string;
  menu_name: string;
  parent_id: string;
  menu_type: number;
  route_path: string;
  sort: number;
  children: MenuItem[] | null;
};

export type PermItem = {
  id: string;
  perm_name: string;
  perm_key: string;
  request_method: string;
  api_path: string;
};

export type PermGroup = {
  module: string;
  children: PermItem[];
};

export type LoginData = {
  token: string;
  id: string;
  username: string;
  role: string;
  avatar: string;
  menu_tree: MenuItem[];
  perm_tree: PermGroup[];
};

export type CaptchaData = {
  captcha_id: string;
  captcha_image: string;
};

export async function adminLogin(
  data: LoginForm,
  options?: { [key: string]: any },
): Promise<ApiResponse<LoginData>> {
  return apiRequest<LoginData>({
    url: '/admin/login',
    method: 'POST',
    skipAuthToken: true,
    data,
    ...(options || {}),
  });
}

export async function adminLogout(options?: { [key: string]: any }) {
  return apiRequest({
    url: '/admin/logout',
    method: 'POST',
    ...(options || {}),
  });
}

export async function getCaptcha(options?: {
  [key: string]: any;
}): Promise<ApiResponse<CaptchaData>> {
  return apiRequest<CaptchaData>({
    url: '/admin/captcha',
    method: 'GET',
    skipAuthToken: true,
    ...(options || {}),
  });
}
