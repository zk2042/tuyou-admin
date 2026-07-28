type MessageApi = {
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  loading: (content: string, duration?: number) => void;
  destroy: () => void;
};
type AppInstance = {
  message?: MessageApi;
} | null;

let appInstance: AppInstance = null;
let pendingTasks: Array<(api: MessageApi) => void> = [];

export const setAppInstance = (instance: AppInstance) => {
  appInstance = instance;

  if (!instance?.message || !pendingTasks.length) {
    return;
  }

  pendingTasks.forEach((task) => task(instance.message as MessageApi));
  pendingTasks = [];
};

function runMessage(task: (api: MessageApi) => void) {
  const current = appInstance?.message;

  if (current) {
    task(current as MessageApi);
    return;
  }

  pendingTasks.push(task);
}

export const message = {
  success: (content: string, duration?: number) =>
    runMessage((api) => {
      api.success(content, duration);
    }),
  error: (content: string, duration?: number) =>
    runMessage((api) => {
      api.error(content, duration);
    }),
  info: (content: string, duration?: number) =>
    runMessage((api) => {
      api.info(content, duration);
    }),
  warning: (content: string, duration?: number) =>
    runMessage((api) => {
      api.warning(content, duration);
    }),
  loading: (content: string, duration?: number) =>
    runMessage((api) => {
      api.loading(content, duration);
    }),
  destroy: () =>
    runMessage((api) => {
      api.destroy();
    }),
};
