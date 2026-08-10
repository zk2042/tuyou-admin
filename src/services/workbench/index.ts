import type { ApiResponse } from '@/constants';
import { apiRequest } from '@/lib/apiRequest';

import type { WorkbenchData } from './types';

export type { TrendItem, WorkbenchData } from './types';

export async function getWorkbench(options?: {
  [key: string]: any;
}): Promise<ApiResponse<WorkbenchData>> {
  return apiRequest<WorkbenchData>({
    url: '/admin/workbench',
    method: 'GET',
    ...(options || {}),
  });
}
