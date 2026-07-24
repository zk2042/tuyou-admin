import { apiRequest } from '@/lib/apiRequest';

import type { UserData, UserParams } from './types';

// TODO: 后端联调时，将下面占位路径替换为真实接口地址。
export async function queryLeaderPage<T>(
  params: UserParams,
  options?: { [key: string]: any },
) {
  return apiRequest<UserData<T>>({
    url: '/v1/leaders',
    method: 'GET',
    params,
    ...(options || {}),
  });
}
