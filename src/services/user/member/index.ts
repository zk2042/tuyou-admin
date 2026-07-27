import type { ApiResponse } from '@/constants';
import { apiRequest, postDownload } from '@/lib/apiRequest';

import type { MemberItem, MemberQuery, PageData } from './types';

export async function queryMember(
  params: MemberQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<MemberItem>>> {
  return apiRequest<PageData<MemberItem>>({
    url: '/v1/admin/users',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getMember(
  id: string | number,
  options?: { [key: string]: any },
): Promise<ApiResponse<MemberItem>> {
  return apiRequest<MemberItem>({
    url: `/v1/admin/users/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export const exportMember = (data?: Partial<MemberQuery>) =>
  postDownload('/v1/admin/users/export', data || {});
