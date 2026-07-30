import { message } from '@/utils/message';
import { useCallback, useState } from 'react';

interface ExportOpts {
  request: () => Promise<Blob>;
  successText?: string;
}

export const useExportExcel = ({ request, successText }: ExportOpts) => {
  const [exporting, setExporting] = useState(false);

  const runExport = useCallback(async () => {
    setExporting(true);

    try {
      await request();
      message.success(successText || '导出成功');
    } finally {
      setExporting(false);
    }
  }, [request, successText]);

  return {
    exporting,
    runExport,
  };
};
