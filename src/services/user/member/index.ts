import type { ApiResponse } from '@/constants';
import { apiRequest, getDownload } from '@/lib/apiRequest';

import type { MemberEdit, MemberItem, MemberQuery, PageData } from './types';

export async function queryMember(
  params: MemberQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<MemberItem>>> {
  return apiRequest<PageData<MemberItem>>({
    url: '/admin/members',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getMember(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<MemberItem>> {
  return apiRequest<MemberItem>({
    url: `/admin/members/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function editMember(
  id: string,
  data: MemberEdit,
  options?: { [key: string]: any },
): Promise<ApiResponse<MemberItem>> {
  return apiRequest<MemberItem>({
    url: `/admin/members/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function delMember(id: string, options?: { [key: string]: any }) {
  return apiRequest({
    url: `/admin/members/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function restoreMember(
  id: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/members/${id}/restore`,
    method: 'POST',
    ...(options || {}),
  });
}

export async function batchDelMember(
  ids: string[],
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/members/batch-delete',
    method: 'POST',
    data: { ids },
    ...(options || {}),
  });
}

export async function batchStatusMember(
  ids: string[],
  status: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: '/admin/members/batch-status',
    method: 'PUT',
    data: { ids, status },
    ...(options || {}),
  });
}

export const exportMember = (data?: Partial<MemberQuery>) =>
  getDownload('/admin/members/export', data || {});
