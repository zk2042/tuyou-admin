import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type {
  PageData,
  RoleCreate,
  RoleEdit,
  RoleItem,
  RolePermBody,
  RolePermData,
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

export async function deleteRole(id: string, options?: { [key: string]: any }) {
  return apiRequest({
    url: `/admin/roles/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function queryRoleMenus(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<{ menu_tree: RolePermData['menu_tree'] }>> {
  return apiRequest<{ menu_tree: RolePermData['menu_tree'] }>({
    url: `/admin/roles/${id}/menus`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryRolePermissions(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<{ permission_tree: RolePermData['permission_tree'] }>> {
  return apiRequest<{ permission_tree: RolePermData['permission_tree'] }>({
    url: `/admin/roles/${id}/permissions`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function saveRolePermissions(
  id: string,
  data: RolePermBody,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/roles/${id}/permissions`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
