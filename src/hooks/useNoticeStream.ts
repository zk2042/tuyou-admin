import { queryNoticeUnread } from '@/services/center';
import { openNoticeStream } from '@/services/center/stream';
import { useAppDispatch } from '@/store/hooks';
import { setUnreadCount } from '@/store/slices/noticeSlice';
import { hasAuth } from '@/utils/auth';
import { useEffect } from 'react';

const POLL_INTERVAL = 60000;

export function useNoticeStream(
  unreadEnabled: boolean,
  streamEnabled: boolean,
  onAuthError: () => void,
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!unreadEnabled || !hasAuth()) {
      dispatch(setUnreadCount(0));
      return;
    }

    const controller = new AbortController();
    let pollTimer: ReturnType<typeof setInterval> | undefined;

    const loadUnread = async () => {
      try {
        const response = await queryNoticeUnread();

        if (!controller.signal.aborted) {
          dispatch(setUnreadCount(response.data?.unread_count ?? 0));
        }
      } catch {
        return;
      }
    };

    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = undefined;
      }
    };

    const startPolling = () => {
      if (pollTimer || controller.signal.aborted) {
        return;
      }

      void loadUnread();
      pollTimer = setInterval(() => {
        void loadUnread();
      }, POLL_INTERVAL);
    };

    const connect = async () => {
      if (!streamEnabled) {
        startPolling();
        return;
      }

      await loadUnread();

      if (controller.signal.aborted) {
        return;
      }

      await openNoticeStream({
        signal: controller.signal,
        onOpen() {
          stopPolling();
        },
        onData(unreadCount) {
          dispatch(setUnreadCount(unreadCount));
        },
        onError() {
          startPolling();
        },
        onAuthError,
      });
    };

    void connect().catch(() => undefined);

    return () => {
      stopPolling();
      controller.abort();
    };
  }, [dispatch, onAuthError, streamEnabled, unreadEnabled]);
}
