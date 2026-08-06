import type { ApiResponse } from '@/constants';
import { apiRequest, getDownload } from '@/lib/apiRequest';

import type { LeaderEdit, LeaderItem, LeaderQuery, PageData } from './types';

export async function queryLeader(
  params: LeaderQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<LeaderItem>>> {
  return apiRequest<PageData<LeaderItem>>({
    url: '/admin/leaders',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getLeader(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<LeaderItem>> {
  return apiRequest<LeaderItem>({
    url: `/admin/leaders/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function editLeader(
  id: string,
  data: LeaderEdit,
  options?: { [key: string]: any },
): Promise<ApiResponse<LeaderItem>> {
  return apiRequest<LeaderItem>({
    url: `/admin/leaders/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function delLeader(id: string, options?: { [key: string]: any }) {
  return apiRequest({
    url: `/admin/leaders/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDelLeader(
  ids: string[],
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/leaders/batch-delete',
    method: 'POST',
    data: { ids },
    ...(options || {}),
  });
}

export async function batchStatusLeader(
  ids: string[],
  status: boolean,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/leaders/batch-status',
    method: 'PUT',
    data: { ids, status },
    ...(options || {}),
  });
}

export const exportLeader = (data?: Partial<LeaderQuery>) =>
  getDownload('/admin/leaders/export', data || {});
