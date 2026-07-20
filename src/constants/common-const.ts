// ========== 分页 ==========
export const PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [
  '5',
  '10',
  '15',
  '20',
  '30',
  '40',
  '50',
  '75',
  '100',
];

export const showTableTotal = (total: number | string) => `共 ${total}
  条`;

// ========== 时间格式 ==========
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  YEAR_MONTH: 'YYYY-MM',
  MONTH_DAY: 'MM-DD',
  HOUR_MINUTE: 'HH:mm',
} as const;
