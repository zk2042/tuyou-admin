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
  menuName: string;
  parentId: number;
  menuType: number;
  routePath: string;
  sort: number;
  children: MenuItem[];
};

export type PermItem = {
  id: string;
  permName: string;
  permKey: string;
  requestMethod: string;
  apiPath: string;
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
  menuTree: MenuItem[];
  permTree: PermGroup[];
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
