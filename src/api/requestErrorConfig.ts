import {
  API_RESPONSE_SUCCESS_CODE,
  type ApiResponse,
  getStatusCodeMessage,
  isModalStatusCode,
  isNeedLogin,
  isPermissionStatusCode,
  isWarningStatusCode,
} from '@/constants';
import { clearAuth } from '@/utils/auth';
import { message } from '@/utils/message';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';

const SUCCESS_CODE = API_RESPONSE_SUCCESS_CODE;

// 清理登录状态并携带当前地址跳转登录页
function redirectToLogin() {
  clearAuth();

  if (window.location.pathname === '/login') {
    return;
  }

  const { pathname, search } = window.location;
  const params = new URLSearchParams({
    redirect: `${pathname}${search}`,
  });
  window.location.href = `/login?${params.toString()}`;
}

// 关闭已有提示，避免连续错误消息堆叠
function showErrorMessage(content: string, duration = 3) {
  message.destroy();
  message.error(content, duration);
}

// 处理超时和断网等无 HTTP 响应的异常
function handleNetworkError(error: any): boolean {
  if (
    error?.code === 'ECONNABORTED' ||
    error?.message?.toLowerCase?.().includes('timeout')
  ) {
    showErrorMessage('网络超时');
    return true;
  } else if (error?.message === 'Network Error') {
    showErrorMessage('网络连接错误');
    return true;
  } else {
    return false;
  }
}

// 按 HTTP 状态码展示提示或跳转对应页面
function handleHttpStatusError(error: any): boolean {
  const status = error?.response?.status;

  if (!status || status < 400) {
    return false;
  } else if (status === 401) {
    showErrorMessage('登录已失效，请重新登录');
    setTimeout(redirectToLogin, 300);
    return true;
  } else if (status === 403) {
    showErrorMessage('暂无权限访问该资源');
    setTimeout(() => history.replace('/403'), 300);
    return true;
  } else if (status === 404) {
    showErrorMessage('您访问的内容不存在或已被删除');
    return true;
  } else if (status === 422) {
    showErrorMessage('您提交的信息有误，请检查后重试');
    return true;
  } else if (status === 500) {
    showErrorMessage('服务器异常，请稍后重试');
    return true;
  } else if (status === 502 || status === 503 || status === 504) {
    showErrorMessage('服务暂不可用，请稍后重试');
    return true;
  } else {
    showErrorMessage(`请求失败（HTTP ${status}）`);
    return true;
  }
}

function getBizErrorMessage(errorInfo: ApiResponse): string {
  return errorInfo.message || getStatusCodeMessage(errorInfo.code);
}

// 处理后端业务状态码抛出的 BizError
function handleBizError(error: any): boolean {
  if (error?.name !== 'BizError') {
    return false;
  } else if (!error.info || typeof error.info.code !== 'number') {
    return false;
  } else {
    const errorInfo: ApiResponse = error.info;
    const errorMessage = getBizErrorMessage(errorInfo);
    const { code } = errorInfo;

    if (isNeedLogin(code)) {
      showErrorMessage(errorMessage);
      setTimeout(redirectToLogin, 300);
      return true;
    } else if (isModalStatusCode(code)) {
      const { Modal } = require('antd');
      Modal.error({
        title: '重要提醒',
        content: errorMessage,
      });
      return true;
    } else if (isWarningStatusCode(code)) {
      message.destroy();
      message.warning(errorMessage);
      return true;
    } else if (isPermissionStatusCode(code)) {
      showErrorMessage(errorMessage);
      setTimeout(() => history.replace('/403'), 300);
      return true;
    } else {
      showErrorMessage(errorMessage);
      return true;
    }
  }
}

function handleUnknownError(error: any) {
  console.error('未捕获的错误:', error);
  showErrorMessage('请求失败，请重试');
}

// 请求异常统一入口，已识别的错误不再向下重复处理
export function handleRequestError(error: any, opts?: any) {
  if (opts?.skipErrorHandler) throw error;

  if (handleNetworkError(error)) {
    return;
  }

  if (handleHttpStatusError(error)) {
    return;
  }

  if (handleBizError(error)) {
    return;
  }

  handleUnknownError(error);
}

export const errorConfig: RequestConfig = {
  // Umi Max 内置的错误处理配置
  errorConfig: {
    // 错误抛出：判断业务是否成功
    errorThrower: (res) => {
      const { code, message: responseMessage, data } = res as ApiResponse;

      if (typeof code === 'number' && code !== SUCCESS_CODE) {
        const error: any = new Error(responseMessage);
        error.name = 'BizError';
        error.info = { code, message: responseMessage, data };
        throw error;
      }
    },

    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      handleRequestError(error, opts);
    },
  },
};
