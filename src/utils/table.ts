import { getNestedValue } from './dict';

export interface TableRequestData<T> {
  data: T[];
  total: number;
  success: boolean;
  current?: number;
  pageSize?: number;
}

export interface NormalizeTableDataOptions<T> {
  dataField?: string;
  listField?: string;
  totalField?: string;
  successField?: string;
  currentField?: string;
  pageSizeField?: string;
  defaultSuccess?: boolean;
  transform?: (response: any) => Partial<TableRequestData<T>>;
}

const getValueByPath = (source: any, path?: string) => {
  if (!path) {
    return source;
  }

  return getNestedValue(source, path);
};

export const normalizeTableData = <T>(
  response: any,
  options: NormalizeTableDataOptions<T> = {},
): TableRequestData<T> => {
  const {
    dataField = 'data',
    listField = 'list',
    totalField = 'total',
    successField = 'success',
    currentField = 'current',
    pageSizeField = 'pageSize',
    defaultSuccess = true,
    transform,
  } = options;

  const payload = getValueByPath(response, dataField) ?? response;
  const transformed = transform?.(response) ?? {};

  const rawList = Array.isArray(payload)
    ? payload
    : getValueByPath(payload, listField) ?? [];
  const data = Array.isArray(transformed.data)
    ? transformed.data
    : Array.isArray(rawList)
    ? rawList
    : [];
  const total =
    transformed.total ??
    getValueByPath(payload, totalField) ??
    (Array.isArray(data) ? data.length : 0);
  const success =
    transformed.success ??
    getValueByPath(response, successField) ??
    getValueByPath(payload, successField) ??
    defaultSuccess;
  const current =
    transformed.current ?? getValueByPath(payload, currentField) ?? undefined;
  const pageSize =
    transformed.pageSize ?? getValueByPath(payload, pageSizeField) ?? undefined;

  return {
    data,
    total,
    success,
    current,
    pageSize,
  };
};
