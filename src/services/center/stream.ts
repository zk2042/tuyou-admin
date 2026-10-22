import { getToken, refreshAccessToken } from '@/utils/auth';
import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';

const STREAM_URL = '/api/v1/admin/center/notifications/stream';
const RETRY_INTERVAL = 5000;
const MAX_RETRY_COUNT = 5;

class FatalError extends Error {}

type StreamOptions = {
  signal: AbortSignal;
  onOpen: () => void;
  onData: (unreadCount: number) => void;
  onError: () => void;
  onAuthError: () => void;
};

// 每次请求前检查 401：用刷新令牌换新访问令牌后重试一次
async function fetchWithTokenRefresh(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // 每次重连都读取本地最新的访问令牌，避免复用首次连接时的旧令牌
  const headers = new Headers(init?.headers);
  const currentToken = getToken();
  if (currentToken) {
    headers.set('Authorization', `Bearer ${currentToken}`);
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();
  if (!newAccessToken) {
    return response;
  }

  headers.set('Authorization', `Bearer ${newAccessToken}`);
  return fetch(input, { ...init, headers });
}

export async function openNoticeStream(options: StreamOptions) {
  const token = getToken() || (await refreshAccessToken());
  let retryCount = 0;

  if (!token) {
    return;
  }

  await fetchEventSource(STREAM_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fetch: fetchWithTokenRefresh,
    signal: options.signal,
    openWhenHidden: true,
    async onopen(response) {
      if (response.status === 401 || response.status === 403) {
        throw new FatalError('SSE authentication failed');
      }

      const contentType = response.headers.get('content-type');

      if (!response.ok || !contentType?.startsWith(EventStreamContentType)) {
        throw new Error('Invalid SSE response');
      }

      console.info('[Notice SSE] 连接成功');
      retryCount = 0;
      options.onOpen();
    },
    onmessage(message) {
      options.onOpen();

      if (!message.data) {
        return;
      }

      console.info('[Notice SSE] 收到消息', message.data);

      try {
        const data = JSON.parse(message.data) as { unread_count: number };

        if (Number.isInteger(data.unread_count) && data.unread_count >= 0) {
          options.onData(data.unread_count);
        }
      } catch {
        return;
      }
    },
    onclose() {
      options.onError();
      throw new Error('SSE connection closed');
    },
    onerror(error) {
      options.onError();

      if (error instanceof FatalError) {
        options.onAuthError();
        throw error;
      }

      if (retryCount >= MAX_RETRY_COUNT) {
        console.error(
          `[Notice SSE] 重连失败，已达到 ${MAX_RETRY_COUNT} 次上限`,
        );
        throw error;
      }

      retryCount += 1;
      console.log(
        `[Notice SSE] 连接失败，${
          RETRY_INTERVAL / 1000
        } 秒后进行第 ${retryCount} 次重连`,
      );
      return RETRY_INTERVAL;
    },
  });
}
