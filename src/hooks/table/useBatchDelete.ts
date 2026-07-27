import { message, Modal } from 'antd';
import { useCallback, useState } from 'react';

interface BatchOpts {
  entityLabel: string;
  getCount: () => number;
  request?: () => Promise<void> | void;
  onSuccess?: () => Promise<void> | void;
}

export const useBatchDelete = ({
  entityLabel,
  getCount,
  request,
  onSuccess,
}: BatchOpts) => {
  const [deleting, setDeleting] = useState(false);

  const batchDelete = useCallback(() => {
    const selectedCount = getCount();

    if (!selectedCount) {
      message.warning(`请先选择要批量删除的${entityLabel}`);
      return;
    }

    Modal.confirm({
      title: `确认批量删除这些${entityLabel}吗？`,
      content: `已选择 ${selectedCount} 个${entityLabel}，删除后将无法恢复。`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        danger: true,
        loading: deleting,
      },
      onOk: async () => {
        setDeleting(true);

        try {
          await request?.();
          await onSuccess?.();
          message.success(`已删除 ${selectedCount} 个${entityLabel}`);
        } finally {
          setDeleting(false);
        }
      },
    });
  }, [deleting, entityLabel, getCount, onSuccess, request]);

  return {
    deleting,
    batchDelete,
  };
};
