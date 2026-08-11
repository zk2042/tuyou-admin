/*
 * 统一 API 请求封装
 * 提供统一 request 请求方法及下载方法
 *
 * 统一遵循后端约定的响应结构：
 * {
 *   code: 0,
 *   message: '成功',
 *   data: {}
 * }
 */
import { handleRequestError } from '@/api/requestErrorConfig';
import { API_RESPONSE_SUCCESS_CODE, type ApiResponse } from '@/constants';
import { message } from '@/utils/message';
import { request, type RequestOptions } from '@umijs/max';

export interface PageResult<T> {
  current: number;
  pageSize: number;
  total: number;
  records: T[];
  list: T[];
  pageNum: number; // 当前页码
  pages: number; // 总页数
}

type RequestMethod = NonNullable<RequestOptions['method']>;

interface RequestExecutorOptions extends RequestOptions {
  url: string;
  method?: RequestMethod;
  skipAuthToken?: boolean;
}

const MOCK_BASE_URL = '/__mock/api/v1';

// 开发环境下仅对可恢复的接口异常启用 Mock 兜底
function canFallbackToMock(error: any, method: RequestMethod) {
  if (error?.name === 'BizError') {
    return false;
  }

  const status = error?.response?.status;

  if (status === 404 || status === 501) {
    return true;
  }

  if (method.toUpperCase() !== 'GET') {
    return false;
  }

  return (
    error?.code === 'ECONNABORTED' ||
    error?.message === 'Network Error' ||
    error?.message?.toLowerCase?.().includes('timeout') ||
    [502, 503, 504].includes(status)
  );
}

// 将非成功业务状态转换为统一的 BizError
function throwBizError<T>(response: ApiResponse<T>) {
  if (
    typeof response?.code === 'number' &&
    response.code !== API_RESPONSE_SUCCESS_CODE
  ) {
    const error: any = new Error(response.message || '请求失败');
    error.name = 'BizError';
    error.info = {
      code: response.code,
      message: response.message,
      data: response.data,
    };
    throw error;
  }

  return response;
}

// 执行请求并将异常交给统一错误处理器
async function requestWithAuth<T>(
  url: string,
  options: Omit<RequestExecutorOptions, 'url'>,
  sender: (
    path: string,
    config: Omit<RequestExecutorOptions, 'url'>,
  ) => Promise<T>,
  onError?: (error: any, opts?: any) => void,
) {
  try {
    return await sender(url, options);
  } catch (error) {
    if (onError) {
      onError(error, options);
    } else {
      handleRequestError(error, options);
    }
    return Promise.reject(error);
  }
}

/**
 * 统一请求入口
 * 通过 options.method 区分 GET / POST / PUT / DELETE 等请求方式
 * 始终返回完整响应数据：{ code, message, data }
 */
export async function apiRequest<T = unknown>(
  options: RequestExecutorOptions,
): Promise<ApiResponse<T>> {
  const { url, method = 'GET', ...restOptions } = options;
  return requestWithAuth<ApiResponse<T>>(
    url,
    {
      method,
      ...restOptions,
    },
    async (path, requestOptions) => {
      try {
        const response = await request<ApiResponse<T>>(path, {
          ...requestOptions,
          skipErrorHandler: true,
        });

        return throwBizError(response);
      } catch (error) {
        if (
          process.env.NODE_ENV !== 'development' ||
          !canFallbackToMock(error, method)
        ) {
          throw error;
        }

        // 开发环境接口不可用时，请求对应的本地 Mock 地址
        const response = await request<ApiResponse<T>>(path, {
          ...requestOptions,
          baseURL: MOCK_BASE_URL,
          skipErrorHandler: true,
        });

        console.warn(`[Mock Fallback] ${method.toUpperCase()} /api/v1${path}`);
        return throwBizError(response);
      }
    },
  );
}

// ================================= 下载 =================================

/**
 * 处理下载错误
 * @param error 错误对象
 */
function handleDownloadError(error: any) {
  if (error instanceof Blob) {
    const fileReader = new FileReader();
    fileReader.readAsText(error);
    fileReader.onload = () => {
      const result = fileReader.result;

      if (typeof result === 'string') {
        try {
          const jsonResponse = JSON.parse(result) as Partial<ApiResponse>;
          message.destroy();
          message.error(jsonResponse.message || '下载失败');
        } catch (error) {
          console.error('JSON解析失败', error);
          message.destroy();
          message.error('下载失败，文件格式错误');
        }
      } else {
        console.error('文件内容不是有效的字符串，无法解析为JSON');
        message.destroy();
        message.error('下载失败，文件内容异常');
      }
    };
  } else {
    message.destroy();
    message.error('网络发生错误', 3);
  }
}

/**
 * 处理下载数据
 * @param response 响应对象
 */
function handleDownloadData(response: any) {
  if (!response) {
    return;
  }

  const contentType =
    response.headers['content-type'] || response.headers['Content-Type'];

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: contentType }),
  );
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;

  const str =
    response.headers['content-disposition'] ||
    response.headers['Content-Disposition'];
  let filename = '';

  if (str) {
    const dispositionParts = str.split(';');
    for (const part of dispositionParts) {
      if (part.includes('fileName=') || part.includes('filename=')) {
        filename = part.split('=')[1].trim();
        break;
      }
    }
  }

  if (filename) {
    filename = filename.replace(/"/g, '');
    link.setAttribute('download', decodeURIComponent(filename));
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * post方式下载文件
 * @param url 请求地址
 * @param data 请求数据
 * @returns Promise<Blob> 返回文件数据
 */
export const postDownload = (url: string, data: object) =>
  requestWithAuth<any>(
    url,
    {
      method: 'post',
      data,
      responseType: 'blob',
      getResponse: true,
    },
    (path, options) =>
      request(path, {
        ...options,
        skipErrorHandler: true,
      }),
    handleDownloadError,
  ).then((response) => {
    handleDownloadData(response);
    return response.data;
  });

/**
 * get方式下载文件
 * @param url 请求地址
 * @param params 请求参数
 * @returns Promise<Blob> 返回文件数据
 */
export const getDownload = (url: string, params?: object): Promise<Blob> =>
  requestWithAuth<any>(
    url,
    {
      method: 'get',
      params,
      responseType: 'blob',
      getResponse: true,
    },
    (path, options) =>
      request(path, {
        ...options,
        skipErrorHandler: true,
      }),
    handleDownloadError,
  ).then((response) => {
    handleDownloadData(response);
    return response.data;
  });
