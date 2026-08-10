import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type {
  ManagerCreate,
  ManagerEdit,
  ManagerItem,
  ManagerQuery,
  ManagerResetPassword,
  PageData,
  RoleName,
} from './types';

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

export async function createManager(
  data: ManagerCreate,
  options?: { [key: string]: any },
): Promise<ApiResponse<ManagerItem>> {
  return apiRequest<ManagerItem>({
    url: '/admin/admins',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function getRoleNames(options?: {
  [key: string]: any;
}): Promise<ApiResponse<RoleName[]>> {
  return apiRequest<RoleName[]>({
    url: '/admin/admins/role',
    method: 'GET',
    ...(options || {}),
  });
}

export async function editManager(
  id: string,
  data: ManagerEdit,
  options?: { [key: string]: any },
): Promise<ApiResponse<ManagerItem>> {
  return apiRequest<ManagerItem>({
    url: `/admin/admins/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteManager(
  id: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/admins/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function resetManagerPassword(
  id: string,
  data: ManagerResetPassword,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/admins/${id}/reset-password`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
