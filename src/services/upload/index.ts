import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

interface ImgRes {
  urls: string[];
}

export async function uploadImages(
  files: File[],
  options?: { [key: string]: any },
): Promise<ApiResponse<ImgRes>> {
  const data = new FormData();
  files.forEach((file) => data.append('files', file));

  return apiRequest<ImgRes>({
    url: '/upload/images',
    method: 'POST',
    data,
    ...(options || {}),
  });
}
