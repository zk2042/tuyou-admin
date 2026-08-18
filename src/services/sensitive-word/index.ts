import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type {
  BatchReq,
  PageData,
  SensitiveWordCreate,
  SensitiveWordItem,
  SensitiveWordQuery,
} from './types';

export async function querySensitiveWord(
  params: SensitiveWordQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<SensitiveWordItem>>> {
  return apiRequest<PageData<SensitiveWordItem>>({
    url: '/admin/sensitive-words',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createSensitiveWord(
  data: SensitiveWordCreate,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/sensitive-words',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function deleteSensitiveWord(
  id: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/sensitive-words/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDeleteSensitiveWord(
  data: BatchReq,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/sensitive-words/batch-delete',
    method: 'POST',
    data,
    ...(options || {}),
  });
}
