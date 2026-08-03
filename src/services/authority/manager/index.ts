import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type { ManagerItem, ManagerQuery, PageData } from './types';

export async function queryManager(
  params: ManagerQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<ManagerItem>>> {
  return apiRequest<PageData<ManagerItem>>({
    url: '/admin/admins',
    method: 'GET',
    params,
    ...(options || {}),
  });
}
