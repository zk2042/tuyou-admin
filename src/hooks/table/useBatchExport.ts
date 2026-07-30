import { message } from '@/utils/message';
import { useCallback, useState } from 'react';

interface ExportOpts {
  entityLabel: string;
  getCount: () => number;
  request?: () => Promise<Blob | void>;
  onSuccess?: () => Promise<void> | void;
}

export const useBatchExport = ({
  entityLabel,
  getCount,
  request,
  onSuccess,
}: ExportOpts) => {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const openExport = useCallback(() => {
    const selectedCount = getCount();

    if (!selectedCount) {
      message.warning(`请先选择要批量导出的${entityLabel}`);
      return;
    }

    setOpen(true);
  }, [entityLabel, getCount]);

  const closeExport = useCallback(() => {
    if (!exporting) {
      setOpen(false);
    }
  }, [exporting]);

  const submitExport = useCallback(async () => {
    const selectedCount = getCount();

    if (!selectedCount) {
      message.warning(`请先选择要批量导出的${entityLabel}`);
      return;
    }

    setExporting(true);

    try {
      await request?.();
      setOpen(false);
      await onSuccess?.();
      message.success(`已导出 ${selectedCount} 个${entityLabel}`);
    } finally {
      setExporting(false);
    }
  }, [entityLabel, getCount, onSuccess, request]);

  return {
    open,
    exporting,
    openExport,
    closeExport,
    submitExport,
  };
};
