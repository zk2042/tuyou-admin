import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

export type LoginForm = {
  username: string;
  password: string;
  captchaCode: string;
  captchaKey: string;
  remember: boolean;
};

export type AdminInfo = {
  id: number;
  username: string;
  role: string;
  avatar: string;
};

export type LoginData = {
  token: string;
  refreshToken: string;
  expires_in: number;
  admin: AdminInfo;
};

export type CaptchaData = {
  captchaKey: string;
  imageUrl: string;
};

export async function adminLogin(
  data: LoginForm,
  options?: { [key: string]: any },
): Promise<ApiResponse<LoginData>> {
  return apiRequest<LoginData>({
    url: '/v1/admin/auth/login',
    method: 'POST',
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
    url: '/v1/admin/auth/captcha',
    method: 'GET',
    ...(options || {}),
  });
}
