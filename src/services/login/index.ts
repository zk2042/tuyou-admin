import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';
import type { AuthMenu } from '@/services/auth';

export type LoginForm = {
  username: string;
  password: string;
  captcha_id: string;
  captcha: string;
};

export type LoginData = {
  token: string;
  id: string;
  username: string;
  role: string;
  avatar: string;
  menu_tree: AuthMenu[];
  perm_keys: string[];
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
