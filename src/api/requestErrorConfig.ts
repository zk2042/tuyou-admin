import { LOCAL_STORAGE_KEY } from '@/constants';
import { message } from '@/utils/message';
import type { RequestConfig } from '@umijs/max';

const SUCCESS_CODE = 10000;
const LOGIN_EXPIRED_CODES = [30007, 30008];
const NO_PERMISSION_CODE = 30005;

interface ApiResponse<T = unknown> {
  code?: number;
  msg?: string;
  data?: T;
  success?: boolean;
}

function redirectToLogin() {
  localStorage.removeItem(LOCAL_STORAGE_KEY.USER_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEY.USER_INFO);

  if (window.location.pathname === '/login') {
    return;
  }

  const { pathname, search } = window.location;
  const params = new URLSearchParams({
    redirect: `${pathname}${search}`,
  });
  window.location.href = `/login?${params.toString()}`;
}

export const errorConfig: RequestConfig = {
  // Umi Max 内置的错误处理配置
  errorConfig: {
    // 错误抛出：判断业务是否成功
    errorThrower: (res) => {
      const { code, msg, data } = res as ApiResponse;

      if (typeof code === 'number' && code !== SUCCESS_CODE) {
        const error: any = new Error(msg);
        error.name = 'BizError';
        error.info = { code, msg, data };
        throw error;
      }
    },

    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      const status = error?.response?.status;

      if (status === 401) {
        message.error('登录已失效，请重新登录', 3);
        setTimeout(redirectToLogin, 300);
        return;
      }

      if (status === 403) {
        message.error('暂无权限访问该资源', 3);
        return;
      }

      if (status === 404) {
        message.error('您访问的内容不存在或已被删除', 3);
        return;
      }

      if (status === 422) {
        message.error('您提交的信息有误，请检查后重试', 3);
        return;
      }

      if (status === 500) {
        message.error('服务器异常，请稍后重试', 3);
        return;
      }

      if (status === 502 || status === 503 || status === 504) {
        message.error('服务暂不可用，请稍后重试', 3);
        return;
      }

      if (status && status >= 400) {
        message.error(`请求失败（HTTP ${status}）`, 3);
        return;
      }

      if (
        error?.code === 'ECONNABORTED' ||
        error?.message?.toLowerCase?.().includes('timeout')
      ) {
        message.error('网络超时', 3);
        return;
      }

      if (error.message === 'Network Error') {
        message.error('网络连接错误', 3);
        return;
      }

      // 业务错误（errorThrower 抛出的）
      if (error.name === 'BizError') {
        const errorInfo: ApiResponse | undefined = error.info;
        if (errorInfo) {
          const { code, msg } = errorInfo;

          if (LOGIN_EXPIRED_CODES.includes(code as number)) {
            message.error(msg || '登录已失效，请重新登录');
            setTimeout(redirectToLogin, 300);
            return;
          }

          if (code === NO_PERMISSION_CODE) {
            message.error(msg || '暂无权限执行当前操作');
            return;
          }

          // 默认：弹错误提示
          message.error(msg || '操作失败');
          return;
        }
      }

      // 兜底处理
      console.error('未捕获的错误:', error);
      message.error('请求失败，请重试');
    },
  },
};
