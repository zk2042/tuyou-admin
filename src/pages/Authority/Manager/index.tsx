import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { queryManager } from '@/services/authority/manager';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';

import {
  managerColumns,
  type ManagerQueryParams,
  type ManagerRecord,
} from './managerConfig';

const managerRequest = async (params: ManagerQueryParams) => {
  try {
    const response = await queryManager({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      username: params.username,
      role: params.role,
      status: params.status,
    });
    const pageData = response.data;

    return {
      data: pageData?.list ?? [],
      success: response.code === API_RESPONSE_SUCCESS_CODE,
      total: pageData?.total ?? 0,
    };
  } catch {
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};

const ManagerPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  return (
    <ListPage<ManagerRecord, ManagerQueryParams>
      actionRef={actionRef}
      rowKey="id"
      headerTitle="管理员列表"
      columns={managerColumns}
      request={managerRequest}
      options={false}
      search={{
        defaultCollapsed: true,
        span: 8,
      }}
      toolbarActions={[
        <Button key="create" type="primary" icon={<PlusOutlined />}>
          新增管理员
        </Button>,
      ]}
    />
  );
};

export default ManagerPage;
