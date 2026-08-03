import type { ApiResponse } from '@/constants';
import { apiRequest, postDownload } from '@/lib/apiRequest';

import type {
  BatchReq,
  EditReq,
  NoteDetail,
  NoteItem,
  NoteQuery,
  PageData,
} from './types';

export async function queryNote(
  params: NoteQuery,
  options?: { [key: string]: any },
): Promise<ApiResponse<PageData<NoteItem>>> {
  return apiRequest<PageData<NoteItem>>({
    url: '/admin/notes',
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getNote(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<NoteDetail>> {
  return apiRequest<NoteDetail>({
    url: `/admin/notes/${id}`,
    method: 'GET',
    ...(options || {}),
  });
}

export async function editNote(
  id: string,
  data: EditReq,
  options?: { [key: string]: any },
): Promise<ApiResponse<NoteDetail>> {
  return apiRequest<NoteDetail>({
    url: `/admin/notes/${id}`,
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteNote(
  id: string,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: `/admin/notes/${id}`,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function batchDeleteNote(
  data: BatchReq,
  options?: { [key: string]: any },
): Promise<ApiResponse<null>> {
  return apiRequest<null>({
    url: '/admin/notes/batch-delete',
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export const exportNote = (data: BatchReq) =>
  postDownload('/admin/notes/export', data);
