// 对外暴露的全局消息方法类型
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
// App 实例挂载前产生的消息任务会暂存到队列中
let pendingTasks: Array<(api: MessageApi) => void> = [];

// 注册 Ant Design App 实例，并执行初始化前积压的消息任务
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

// 业务层可直接调用的全局消息入口
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
