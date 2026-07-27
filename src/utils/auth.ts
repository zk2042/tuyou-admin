import { LOCAL_STORAGE_KEY } from '@/constants';

type TokenData = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
};

function getAccessValue(data: TokenData) {
  return data.accessToken || data.access_token || data.token || '';
}

function getRefreshValue(data: TokenData) {
  return data.refreshToken || data.refresh_token || '';
}

function getStore(remember: boolean) {
  return remember ? localStorage : sessionStorage;
}

function clearKey(key: string) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

function setValue(key: string, value: string, remember: boolean) {
  const store = getStore(remember);
  const other = remember ? sessionStorage : localStorage;

  store.setItem(key, value);
  other.removeItem(key);
}

export function getToken() {
  return (
    sessionStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) ||
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_TOKEN) ||
    ''
  );
}

export function getRefresh() {
  return (
    localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ||
    sessionStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ||
    ''
  );
}

export function getRemember() {
  return Boolean(localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN));
}

export function setToken(data: TokenData, remember: boolean) {
  const accessValue = getAccessValue(data);
  const refreshValue = getRefreshValue(data);

  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

  if (accessValue) {
    setValue(LOCAL_STORAGE_KEY.USER_TOKEN, accessValue, remember);
  }

  if (refreshValue) {
    setValue(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshValue, remember);
  }
}

export function updateToken(data: TokenData) {
  const accessValue = getAccessValue(data);
  const refreshValue = getRefreshValue(data);
  const remember = getRemember();

  if (accessValue) {
    setValue(LOCAL_STORAGE_KEY.USER_TOKEN, accessValue, remember);
  }

  if (refreshValue) {
    setValue(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshValue, remember);
  }
}

export function setUser(data: unknown) {
  const remember = getRemember();

  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
  setValue(LOCAL_STORAGE_KEY.USER_INFO, JSON.stringify(data), remember);
}

export function clearAuth() {
  clearKey(LOCAL_STORAGE_KEY.USER_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
  clearKey(LOCAL_STORAGE_KEY.USER_INFO);
}
