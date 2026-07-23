import {
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  showTableTotal,
} from '@/constants/common-const';
import {
  normalizeTableData,
  type NormalizeTableDataOptions,
} from '@/utils/table';
import {
  PageContainer,
  ProTable,
  type PageContainerProps,
  type ProTableProps,
} from '@ant-design/pro-components';
import type { TablePaginationConfig } from 'antd';
import React from 'react';

type TableRequest<T, U extends Record<string, any>> = NonNullable<
  ProTableProps<T, U>['request']
>;

type ToolBarRender<T> = NonNullable<ProTableProps<T, any>['toolBarRender']>;

export interface ListPageProps<
  T extends Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
> extends Omit<
    ProTableProps<T, U>,
    'pagination' | 'request' | 'toolBarRender'
  > {
  pageTitle?: PageContainerProps['title'];
  pageContainerProps?: Omit<PageContainerProps, 'children' | 'title'>;
  request?: TableRequest<T, U>;
  fetchData?: (
    params: U & { current?: number; pageSize?: number },
    sorter: Parameters<TableRequest<T, U>>[1],
    filter: Parameters<TableRequest<T, U>>[2],
  ) => Promise<any>;
  requestOptions?: NormalizeTableDataOptions<T>;
  pagination?: false | TablePaginationConfig;
  toolbarActions?: React.ReactNode[];
  toolBarRender?: ToolBarRender<T>;
}

const defaultSearch = {
  labelWidth: 120,
};

const buildPagination = (
  pagination?: false | TablePaginationConfig,
): false | TablePaginationConfig => {
  if (pagination === false) {
    return false;
  }

  return {
    defaultPageSize: PAGE_SIZE,
    showSizeChanger: true,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showTotal: showTableTotal,
    ...(pagination ?? {}),
  };
};

const ListPage = <
  T extends Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
>({
  pageTitle,
  pageContainerProps,
  request,
  fetchData,
  requestOptions,
  pagination,
  toolbarActions,
  toolBarRender,
  search,
  ...tableProps
}: ListPageProps<T, U>) => {
  const mergedRequest: TableRequest<T, U> | undefined =
    request ??
    (fetchData
      ? async (params, sorter, filter) => {
          const response = await fetchData(params, sorter, filter);
          return normalizeTableData<T>(response, requestOptions);
        }
      : undefined);

  return (
    <PageContainer title={pageTitle} ghost {...pageContainerProps}>
      <ProTable<T, U>
        search={
          search === false ? false : { ...defaultSearch, ...(search ?? {}) }
        }
        pagination={buildPagination(pagination)}
        request={mergedRequest}
        toolBarRender={toolBarRender ?? (() => toolbarActions ?? [])}
        {...tableProps}
      />
    </PageContainer>
  );
};

export type {
  NormalizeTableDataOptions,
  TableRequestData,
} from '@/utils/table';
export default ListPage;
