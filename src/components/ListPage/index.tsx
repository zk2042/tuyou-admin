import {
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  showTableTotal,
} from '@/constants/common-const';
import {
  PageContainer,
  ProTable,
  type PageContainerProps,
  type ProTableProps,
} from '@ant-design/pro-components';
import type { TablePaginationConfig } from 'antd';
import React from 'react';

type TableRequest<
  T,
  U extends Record<string, any>,
  ValueType = 'text',
> = NonNullable<ProTableProps<T, U, ValueType>['request']>;

type ToolBarRender<
  T,
  U extends Record<string, any>,
  ValueType = 'text',
> = NonNullable<ProTableProps<T, U, ValueType>['toolBarRender']>;

export interface ListProps<
  T extends Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
  ValueType = 'text',
> extends Omit<
    ProTableProps<T, U, ValueType>,
    'pagination' | 'request' | 'toolBarRender'
  > {
  pageTitle?: PageContainerProps['title'];
  pageContainerProps?: Omit<PageContainerProps, 'children' | 'title'>;
  request?: TableRequest<T, U, ValueType>;
  pagination?: false | TablePaginationConfig;
  toolbarActions?: React.ReactNode[];
  toolBarRender?: ToolBarRender<T, U, ValueType>;
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
  ValueType = 'text',
>({
  pageTitle,
  pageContainerProps,
  request,
  pagination,
  toolbarActions,
  toolBarRender,
  search,
  ...tableProps
}: ListProps<T, U, ValueType>) => {
  return (
    <PageContainer title={pageTitle} ghost {...pageContainerProps}>
      <ProTable<T, U, ValueType>
        search={
          search === false ? false : { ...defaultSearch, ...(search ?? {}) }
        }
        pagination={buildPagination(pagination)}
        request={request}
        toolBarRender={toolBarRender ?? (() => toolbarActions ?? [])}
        {...tableProps}
      />
    </PageContainer>
  );
};
export default ListPage;
