import { message } from '@/utils/message';
import { App, Divider } from 'antd';
import { createElement, Fragment, useCallback, useState } from 'react';

interface DelOpts<T> {
  entityLabel: string;
  getName: (record: T) => string;
  getDesc?: (record: T) => string;
  request?: (record: T) => Promise<void> | void;
  onSuccess?: (record: T) => Promise<void> | void;
}

export const useRowDelete = <T>({
  entityLabel,
  getName,
  getDesc,
  request,
  onSuccess,
}: DelOpts<T>) => {
  const { modal } = App.useApp();
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = useCallback(
    (record: T) => {
      const itemName = getName(record);
      const description = getDesc?.(record);

      modal.confirm({
        title: `确认删除该${entityLabel}吗？`,
        closable: true,
        content: createElement(Fragment, null, [
          createElement(Divider, {
            key: 'divider',
            style: { margin: '0 0 20px' },
          }),
          description || `${itemName} 删除后将无法恢复。`,
        ]),
        okText: '确认',
        cancelText: '取消',
        okButtonProps: {
          danger: true,
          loading: deleting,
        },
        onOk: async () => {
          setDeleting(true);

          try {
            await request?.(record);
            await onSuccess?.(record);
            message.success(`已删除${entityLabel} ${itemName}`);
          } catch {
            return;
          } finally {
            setDeleting(false);
          }
        },
      });
    },
    [deleting, entityLabel, getDesc, getName, modal, onSuccess, request],
  );

  return {
    deleting,
    confirmDelete,
  };
};
