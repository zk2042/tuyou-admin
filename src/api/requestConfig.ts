import { LOCAL_STORAGE_KEY } from '@/constants';
import type { RequestConfig, RequestOptions } from '@umijs/max';
import { errorConfig } from './requestErrorConfig';

const TOKEN_HEADER = 'Authorization';
const SUCCESS_CODE = 10000;

interface ResponseStructure {
  code: number;
  msg: string;
  data: any;
  success?: boolean;
}

// ========== 请求配置 ==========
export const requestConfig: RequestConfig = {
  baseURL: '/api',
  timeout: 30000,
  ...errorConfig,

  // ====== 请求拦截器 ======
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN);
      if (token) {
        config.headers = {
          ...config.headers,
          [TOKEN_HEADER]: `Bearer ${token}`,
        };
      }

      const method = (config.method || 'GET').toUpperCase();
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        config.headers = {
          ...config.headers,
          'Content-Type': 'application/json; charset=utf-8',
        };
      }

      return { ...config };
    },
  ],

  // ====== 响应拦截器 ======
  responseInterceptors: [
    (response) => {
      const contentType = response.headers?.['content-type'] || '';
      if (!contentType.includes('application/json')) {
        return response;
      }

      const { data } = response as unknown as { data: ResponseStructure };
      if (data && typeof data.code === 'number') {
        data.success = data.code === SUCCESS_CODE;
      }

      return response;
    },
  ],
};
