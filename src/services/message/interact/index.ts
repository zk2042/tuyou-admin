import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type { MessageItem, MessageQuery, PageData } from './types';

export type { MessageItem, MessageQuery, PageData } from './types';

export async function queryInteractMessage(
  params: MessageQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<MessageItem>>> {
  return apiRequest<PageData<MessageItem>>({
    url: '/admin/messages/interactions',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function deleteMessage(
  id: string,
  options?: { [key: string]: any },
) {
  return apiRequest({
    url: `/admin/messages/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}
