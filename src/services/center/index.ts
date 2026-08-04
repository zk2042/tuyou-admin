import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';
import type { CurrentInfo } from '@/services/auth';

import type {
  AvatarBody,
  CountData,
  NameBody,
  NoticeData,
  NoticeQuery,
} from './types';

export type {
  AvatarBody,
  CountData,
  NameBody,
  NoticeData,
  NoticeItem,
  NoticeQuery,
} from './types';

export async function updateName(
  data: NameBody,
  options?: {
    [key: string]: any;
  },
): Promise<ApiResponse<CurrentInfo>> {
  return apiRequest<CurrentInfo>({
    url: '/admin/center/profile',
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function updateAvatar(
  data: AvatarBody,
  options?: {
    [key: string]: any;
  },
): Promise<ApiResponse<CurrentInfo>> {
  return apiRequest<CurrentInfo>({
    url: '/admin/center/avatar',
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function queryNotice(
  params: NoticeQuery,
  options?: {
    [key: string]: any;
  },
): Promise<ApiResponse<NoticeData>> {
  return apiRequest<NoticeData>({
    url: '/admin/center/notifications',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function readAllNotice(options?: {
  [key: string]: any;
}): Promise<ApiResponse<NoticeData>> {
  return apiRequest<NoticeData>({
    url: '/admin/center/notifications/read-all',
    method: 'PUT',
    ...(options || {}),
  });
}

export async function readNotice(
  id: number,
  options?: {
    [key: string]: any;
  },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/center/notifications/${id}/read`,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteNotice(
  id: number,
  options?: {
    [key: string]: any;
  },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/center/notifications/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function clearNotice(options?: {
  [key: string]: any;
}): Promise<ApiResponse<NoticeData>> {
  return apiRequest<NoticeData>({
    url: '/admin/center/notifications',
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function queryNoticeUnread(options?: {
  [key: string]: any;
}): Promise<ApiResponse<CountData>> {
  return apiRequest<CountData>({
    url: '/admin/center/notifications/unread',
    method: 'GET',
    ...(options || {}),
  });
}
