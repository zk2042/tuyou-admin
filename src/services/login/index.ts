import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

export type LoginForm = {
  username: string;
  password: string;
};

export type AdminInfo = {
  id: number;
  username: string;
  role: string;
  avatar: string;
};

export type LoginData = {
  token: string;
  expires_in: number;
  admin: AdminInfo;
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
