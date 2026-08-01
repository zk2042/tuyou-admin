import { LOCAL_STORAGE_KEY } from '@/constants';

type TokenData = {
  token?: string;
  accessToken?: string;
  access_token?: string;
};

function getAccessValue(data: TokenData) {
  return data.accessToken || data.access_token || data.token || '';
}

function clearKey(key: string) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

function setValue(key: string, value: string) {
  localStorage.setItem(key, value);
  sessionStorage.removeItem(key);
}

export function getToken() {
  return (
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) ||
    sessionStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) ||
    ''
  );
}

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

export function clearAuth() {
  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
}
