import { LOCAL_STORAGE_KEY } from '@/constants';
import type { RequestConfig, RequestOptions } from '@umijs/max';
import { errorConfig } from './requestErrorConfig';

const TOKEN_HEADER = 'Authorization';

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

      // 非 JSON 响应直接返回（如文件下载）
      if (!contentType.includes('application/json')) {
        return response;
      }

      return response;
    },
  ],
};
