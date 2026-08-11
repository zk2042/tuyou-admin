import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type { CurrentInfo, PwdBody } from './types';

export type { AuthMenu, CurrentInfo, PwdBody } from './types';

export async function getMe(options?: {
  [key: string]: any;
}): Promise<ApiResponse<CurrentInfo>> {
  return apiRequest<CurrentInfo>({
    url: '/admin/auth/me',
    method: 'GET',
    ...(options || {}),
  });
}

export async function updatePassword(
  data: PwdBody,
  options?: {
    [key: string]: any;
  },
) {
  return apiRequest({
    url: '/admin/auth/password',
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
