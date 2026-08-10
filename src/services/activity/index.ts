import type { ApiResponse } from '@/constants';
import { apiRequest, postDownload } from '@/lib/apiRequest';

import type {
  ActDetail,
  ActivityItem,
  ActivityQuery,
  BatchReq,
  CreateReq,
  EditReq,
  LeaderItem,
  PageData,
} from './types';

export async function queryActivity(
  params: ActivityQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<ActivityItem>>> {
  return apiRequest<PageData<ActivityItem>>({
    url: '/admin/activities',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getActivity(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<ActDetail>> {
  return apiRequest<ActDetail>({
    url: `/admin/activities/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function createActivity(
  data: CreateReq,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/activities',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function getLeaderNames(options?: {
  [key: string]: any;
}): Promise<ApiResponse<LeaderItem[]>> {
  return apiRequest<LeaderItem[]>({
    url: '/admin/leadernames',
    method: 'GET',
    ...(options || {}),
  });
}

export async function editActivity(
  id: string,
  data: EditReq,
  options?: { [key: string]: any },
): Promise<ApiResponse<ActDetail>> {
  return apiRequest<ActDetail>({
    url: `/admin/activities/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteActivity(
  id: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/activities/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDeleteActivity(
  data: BatchReq,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/activities/batch-delete',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export const exportActivity = (data: BatchReq) =>
  postDownload('/admin/activities/export', data);
