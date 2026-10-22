import { LOCAL_STORAGE_KEY, type ApiResponse } from '@/constants';
import { request, type RequestOptions } from '@umijs/max';

type RefreshRequestOptions = RequestOptions & {
  skipAuthToken?: boolean;
};

type TokenData = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
};

// 兼容不同接口常见的令牌字段命名
function getAccessValue(data: TokenData) {
  return data.accessToken || data.access_token || data.token || '';
}

function getRefreshValue(data: TokenData) {
  return data.refreshToken || data.refresh_token || '';
}

// 同时清理本地和会话存储，避免残留登录状态
function clearKey(key: string) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

// 登录信息统一持久化到本地存储
function setValue(key: string, value: string) {
  localStorage.setItem(key, value);
  sessionStorage.removeItem(key);
}

// 优先读取本地存储，并兼容旧的会话存储数据
export function getToken() {
  return (
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) ||
    sessionStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) ||
    ''
  );
}

// 读取刷新令牌
export function getRefreshToken() {
  return (
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_REFRESH_TOKEN) ||
    sessionStorage.getItem(LOCAL_STORAGE_KEY.USER_REFRESH_TOKEN) ||
    ''
  );
}

// 是否还有登录态（访问令牌或刷新令牌任一存在）
export function hasAuth() {
  return Boolean(getToken() || getRefreshToken());
}

// 读取并解析缓存的用户信息，异常数据会自动清理
export function getUser<T>() {
  const userValue =
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO) ||
    sessionStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO);

  if (!userValue) {
    return undefined;
  }

  try {
    return JSON.parse(userValue) as T;
  } catch {
    clearKey(LOCAL_STORAGE_KEY.USER_INFO);
    return undefined;
  }
}

// 保存接口返回的访问令牌与刷新令牌
export function setToken(data: TokenData) {
  const accessValue = getAccessValue(data);
  const refreshValue = getRefreshValue(data);

  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.USER_REFRESH_TOKEN);

  if (accessValue) {
    setValue(LOCAL_STORAGE_KEY.USER_TOKEN, accessValue);
  }
  if (refreshValue) {
    setValue(LOCAL_STORAGE_KEY.USER_REFRESH_TOKEN, refreshValue);
  }
}

export function setUser(data: unknown) {
  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
  setValue(LOCAL_STORAGE_KEY.USER_INFO, JSON.stringify(data));
}

// 清除当前登录凭证和用户缓存
export function clearAuth() {
  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.USER_REFRESH_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
}

// 刷新令牌请求去重：多个请求同时 401 时只发起一次刷新
let refreshTokenPromise: Promise<string | null> | null = null;

// 使用刷新令牌换取新的访问令牌，成功返回 access token
export function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return Promise.resolve(null);
  }

  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const promise = (async () => {
    try {
      const options: RefreshRequestOptions = {
        method: 'POST',
        data: { refresh_token: refreshToken },
        skipAuthToken: true,
        skipErrorHandler: true,
      };
      const response = await request<ApiResponse<TokenData>>(
        '/admin/refresh',
        options,
      );

      if (response?.code !== 0 || !response.data) {
        return null;
      }

      const accessToken = getAccessValue(response.data);
      if (!accessToken) {
        return null;
      }

      // 刷新令牌随访问令牌一起轮换；接口未返回时保留原刷新令牌
      setToken({
        ...response.data,
        refresh_token: getRefreshValue(response.data) || refreshToken,
      });
      return accessToken;
    } catch {
      return null;
    }
  })();

  refreshTokenPromise = promise;
  promise.finally(() => {
    if (refreshTokenPromise === promise) {
      refreshTokenPromise = null;
    }
  });

  return promise;
}
