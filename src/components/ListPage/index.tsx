import {
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  showTableTotal,
} from '@/constants/common-const';
import Forbidden from '@/pages/Exception/403';
import {
  PageContainer,
  ProTable,
  type PageContainerProps,
  type ProColumns,
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
  accessible?: boolean;
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

// 合并项目统一分页配置和页面自定义配置
const buildPagination = (
  pagination?: false | TablePaginationConfig,
): false | TablePaginationConfig => {
  if (pagination === false) {
    return false;
  }

  return {
    defaultPageSize: PAGE_SIZE,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showTotal: showTableTotal,
    ...(pagination ?? {}),
  };
};

const isActionColumn = <T extends Record<string, any>, ValueType = 'text'>(
  column: ProColumns<T, ValueType>,
) => {
  return column.valueType === 'option' || column.key === 'option';
};

// 操作列默认固定在表格右侧
const buildColumns = <T extends Record<string, any>, ValueType = 'text'>(
  columns?: ProTableProps<T, Record<string, any>, ValueType>['columns'],
) => {
  if (!columns) {
    return columns;
  }

  return columns.map((column) => {
    if (!column || !isActionColumn(column) || column.fixed) {
      return column;
    }

    return {
      ...column,
      fixed: 'right' as const,
    };
  });
};

// 默认开启横向滚动，避免列较多时挤压内容
const buildScroll = (
  scroll?: ProTableProps<Record<string, any>, Record<string, any>>['scroll'],
) => {
  if (!scroll) {
    return { x: 'max-content' as const };
  }

  return {
    x: 'max-content' as const,
    ...scroll,
  };
};

// 统一封装列表页容器、搜索、分页和工具栏配置
const ListPage = <
  T extends Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
  ValueType = 'text',
>({
  accessible = true,
  pageTitle,
  pageContainerProps,
  request,
  pagination,
  toolbarActions,
  toolBarRender,
  search,
  columns,
  scroll,
  ...tableProps
}: ListProps<T, U, ValueType>) => {
  const tableColumns = React.useMemo(() => {
    return buildColumns<T, ValueType>(columns);
  }, [columns]);

  if (!accessible) {
    return <Forbidden />;
  }

  return (
    <PageContainer
      title={pageTitle}
      ghost
      breadcrumbRender={false}
      {...pageContainerProps}
    >
      <ProTable<T, U, ValueType>
        columns={tableColumns}
        search={
          search === false ? false : { ...defaultSearch, ...(search ?? {}) }
        }
        pagination={buildPagination(pagination)}
        request={request}
        scroll={buildScroll(scroll)}
        toolBarRender={toolBarRender ?? (() => toolbarActions ?? [])}
        {...tableProps}
      />
    </PageContainer>
  );
};
export default ListPage;
