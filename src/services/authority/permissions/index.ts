import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type { PageData, PermBody, PermItem, PermQuery } from './types';

export async function queryPerm(
  params: PermQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<PermItem>>> {
  return apiRequest<PageData<PermItem>>({
    url: '/admin/api-permissions',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createPerm(
  data: PermBody,
  options?: { [key: string]: any },
): Promise<ApiResponse<PermItem>> {
  return apiRequest<PermItem>({
    url: '/admin/api-permissions',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function editPerm(
  id: string,
  data: PermBody,
  options?: { [key: string]: any },
): Promise<ApiResponse<PermItem>> {
  return apiRequest<PermItem>({
    url: `/admin/api-permissions/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deletePerm(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/api-permissions/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}
