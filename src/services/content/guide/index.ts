import type { ApiResponse } from '@/constants';
import { apiRequest, postDownload } from '@/lib/apiRequest';

import type {
  BatchReq,
  GuideDetail,
  GuideEditReq,
  GuideItem,
  GuideQuery,
  PageData,
} from './types';

export async function queryGuide(
  params: GuideQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<GuideItem>>> {
  return apiRequest<PageData<GuideItem>>({
    url: '/admin/guides',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getGuide(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<GuideDetail>> {
  return apiRequest<GuideDetail>({
    url: `/admin/guides/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function editGuide(
  id: string,
  data: GuideEditReq,
  options?: { [key: string]: any },
): Promise<ApiResponse<GuideDetail>> {
  return apiRequest<GuideDetail>({
    url: `/admin/guides/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteGuide(
  id: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/guides/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDeleteGuide(
  data: BatchReq,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/guides/batch-delete',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export const exportGuide = (data: BatchReq) =>
  postDownload('/admin/guides/export', data);
