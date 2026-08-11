import { LOCAL_STORAGE_KEY } from '@/constants';

type TokenData = {
  token?: string;
  accessToken?: string;
  access_token?: string;
};

// 兼容不同接口常见的令牌字段命名
function getAccessValue(data: TokenData) {
  return data.accessToken || data.access_token || data.token || '';
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

// 保存接口返回的访问令牌
export function setToken(data: TokenData) {
  const accessValue = getAccessValue(data);

  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);

  if (accessValue) {
    setValue(LOCAL_STORAGE_KEY.USER_TOKEN, accessValue);
  }
}

export function setUser(data: unknown) {
  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
  setValue(LOCAL_STORAGE_KEY.USER_INFO, JSON.stringify(data));
}

// 清除当前登录凭证和用户缓存
export function clearAuth() {
  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
}
