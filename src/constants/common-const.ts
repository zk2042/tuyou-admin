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

export function formatNoticeTime(value: string) {
  const time = new Date(value);

  if (Number.isNaN(time.getTime())) {
    return '-';
  }

  const diff = Date.now() - time.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '刚刚';
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`;
  }

  if (diff < 7 * day) {
    return `${Math.floor(diff / day)} 天前`;
  }

  const year = time.getFullYear();
  const month = `${time.getMonth() + 1}`.padStart(2, '0');
  const date = `${time.getDate()}`.padStart(2, '0');
  const hourText = `${time.getHours()}`.padStart(2, '0');
  const minuteText = `${time.getMinutes()}`.padStart(2, '0');

  return `${year}-${month}-${date} ${hourText}:${minuteText}`;
}

// ========== 导出状态码常量 ==========
export * from './status-code-const';
