import { message as antdMessage } from 'antd';

type MessageApi = Pick<
  typeof antdMessage,
  'success' | 'error' | 'info' | 'warning' | 'loading' | 'destroy'
>;
type AppInstance = {
  message?: MessageApi;
} | null;

let appInstance: AppInstance = null;

export const setAppInstance = (instance: AppInstance) => {
  appInstance = instance;
};

function getMessageInstance(): MessageApi {
  return appInstance?.message ?? antdMessage;
}

export const message = {
  success: (content: string, duration?: number) =>
    getMessageInstance().success(content, duration),
  error: (content: string, duration?: number) =>
    getMessageInstance().error(content, duration),
  info: (content: string, duration?: number) =>
    getMessageInstance().info(content, duration),
  warning: (content: string, duration?: number) =>
    getMessageInstance().warning(content, duration),
  loading: (content: string, duration?: number) =>
    getMessageInstance().loading(content, duration),
  destroy: () => getMessageInstance().destroy(),
};
