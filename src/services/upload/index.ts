import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

interface ImgRes {
  url: string;
}

export async function uploadImage(
  file: File,
  options?: { [key: string]: any },
): Promise<ApiResponse<ImgRes>> {
  const data = new FormData();
  data.append('file', file);

  return apiRequest<ImgRes>({
    url: '/v1/admin/upload/image',
    method: 'POST',
    data,
    ...(options || {}),
  });
}
