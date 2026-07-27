import type { ApiResponse } from '@/constants';
import { apiRequest, postDownload } from '@/lib/apiRequest';

import type { LeaderItem, LeaderQuery, PageData } from './types';

export async function queryLeader(
  params: LeaderQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<LeaderItem>>> {
  return apiRequest<PageData<LeaderItem>>({
    url: '/v1/admin/leaders',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getLeader(
  id: string | number,
  options?: { [key: string]: any },
): Promise<ApiResponse<LeaderItem>> {
  return apiRequest<LeaderItem>({
    url: `/v1/admin/leaders/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export const exportLeader = (data?: Partial<LeaderQuery>) =>
  postDownload('/v1/admin/leaders/export', data || {});
