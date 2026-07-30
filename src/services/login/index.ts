import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

export type LoginForm = {
  username: string;
  password: string;
  captcha_id: string;
  captcha: string;
};

export type AdminInfo = {
  id: number;
  username: string;
  role: string;
  avatar: string;
};

export type LoginData = {
  token: string;
  admin: AdminInfo;
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
    url: '/v1/admin/login',
    method: 'POST',
    skipAuthToken: true,
    data,
    ...(options || {}),
  });
}

export async function getMe(options?: {
  [key: string]: any;
}): Promise<ApiResponse<AdminInfo>> {
  return apiRequest<AdminInfo>({
    url: '/v1/admin/auth/me',
    method: 'GET',
    ...(options || {}),
  });
}

export async function getCaptcha(options?: {
  [key: string]: any;
}): Promise<ApiResponse<CaptchaData>> {
  return apiRequest<CaptchaData>({
    url: '/v1/amdin/captcha',
    method: 'GET',
    skipAuthToken: true,
    ...(options || {}),
  });
}
