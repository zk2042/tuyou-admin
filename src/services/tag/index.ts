import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type {
  BatchReq,
  CreateReq,
  EditReq,
  PageData,
  TagItem,
  TagQuery,
} from './types';

export async function queryTag(
  params: TagQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<TagItem>>> {
  return apiRequest<PageData<TagItem>>({
    url: '/admin/tags',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createTag(
  data: CreateReq,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/tags',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function editTag(
  id: string,
  data: EditReq,
  options?: { [key: string]: any },
): Promise<ApiResponse<TagItem>> {
  return apiRequest<TagItem>({
    url: `/admin/tags/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteTag(id: string, options?: { [key: string]: any }) {
  return apiRequest({
    url: `/admin/tags/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDeleteTag(
  data: BatchReq,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/tags/batch-delete',
    method: 'POST',
    data,
    ...(options || {}),
  });
}
