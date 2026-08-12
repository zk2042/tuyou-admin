import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import {
  batchDelLeader,
  batchStatusLeader,
  delLeader,
  editLeader,
  exportLeader,
  getLeader,
  queryLeader,
} from '@/services/user/leader';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Grid } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import {
  batchActions,
  getBioWidth,
  getUserPermissions,
  hasBatchActions,
  type UserQuery,
} from '../shared';
import { leaderColumns, type LeaderRecord } from './leaderConfig';

const leaderRequest = async (params: UserQuery) => {
  try {
    const response = await queryLeader({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      id: params.id,
      nickname: params.nickname,
      phone: params.phone,
      register_start: params.register_start,
      register_end: params.register_end,
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

const LeaderPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { hasPerm } = useAccess();
  const screens = Grid.useBreakpoint();
  const bioWidth = getBioWidth(screens);
  const permissions = getUserPermissions(hasPerm, 'leader');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<LeaderRecord[]>([]);

  const columns = useMemo(() => {
    return leaderColumns(
      permissions.detail
        ? async (id) => {
            const response = await getLeader(id);
            return response.data ?? null;
          }
        : undefined,
      permissions.edit ? editLeader : undefined,
      permissions.delete ? delLeader : undefined,
      () => {
        actionRef.current?.reload();
      },
      bioWidth,
      permissions,
    );
  }, [bioWidth, permissions]);

  return (
    <ListPage<LeaderRecord, UserQuery>
      accessible={permissions.list}
      actionRef={actionRef}
      rowKey="id"
      headerTitle="领队列表"
      columns={columns}
      request={leaderRequest}
      options={false}
      search={{
        defaultCollapsed: true,
        span: 8,
      }}
      rowSelection={
        hasBatchActions(permissions)
          ? {
              selectedRowKeys,
              onChange: (keys, rows) => {
                setSelectedRowKeys(keys as string[]);
                setSelectedRows(rows as LeaderRecord[]);
              },
            }
          : undefined
      }
      toolbarActions={batchActions({
        entityLabel: '领队',
        selectedKeys: selectedRowKeys,
        selectedRows,
        statusRun: permissions.batchStatus ? batchStatusLeader : undefined,
        onStatused: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          actionRef.current?.reload();
        },
        delRun: permissions.batchDelete ? batchDelLeader : undefined,
        onDeleted: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          actionRef.current?.reload();
        },
        exportRequest: permissions.export ? exportLeader : undefined,
      })}
    />
  );
};

export default LeaderPage;
