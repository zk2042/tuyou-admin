import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type {
  BatchReq,
  CommentDetail,
  CommentItem,
  CommentQuery,
  PageData,
} from './types';

export async function queryComment(
  params: CommentQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<CommentItem>>> {
  return apiRequest<PageData<CommentItem>>({
    url: '/admin/comments',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getComment(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<CommentDetail>> {
  return apiRequest<CommentDetail>({
    url: `/admin/comments/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteComment(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/comments/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDeleteComment(
  data: BatchReq,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: '/admin/comments/batch-delete',
    method: 'POST',
    data,
    ...(options || {}),
  });
}
