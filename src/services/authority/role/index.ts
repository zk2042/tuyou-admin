import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type {
  PageData,
  RoleCreate,
  RoleEdit,
  RoleItem,
  RoleQuery,
} from './types';

export async function queryRole(
  params: RoleQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<RoleItem>>> {
  return apiRequest<PageData<RoleItem>>({
    url: '/admin/roles',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createRole(
  data: RoleCreate,
  options?: { [key: string]: any },
): Promise<ApiResponse<RoleItem>> {
  return apiRequest<RoleItem>({
    url: '/admin/roles',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function editRole(
  id: string,
  data: RoleEdit,
  options?: { [key: string]: any },
): Promise<ApiResponse<RoleItem>> {
  return apiRequest<RoleItem>({
    url: `/admin/roles/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteRole(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/roles/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}
