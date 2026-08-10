import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type { MenuBody, MenuItem, MenuQuery, PageData } from './types';

export async function queryMenu(
  params: MenuQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<MenuItem>>> {
  return apiRequest<PageData<MenuItem>>({
    url: '/admin/menus',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createMenu(
  data: MenuBody,
  options?: { [key: string]: any },
): Promise<ApiResponse<MenuItem>> {
  return apiRequest<MenuItem>({
    url: '/admin/menus',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function editMenu(
  id: string,
  data: MenuBody,
  options?: { [key: string]: any },
): Promise<ApiResponse<MenuItem>> {
  return apiRequest<MenuItem>({
    url: `/admin/menus/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteMenu(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/menus/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}
