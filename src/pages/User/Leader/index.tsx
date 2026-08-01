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
import { Grid } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { batchActions, getBioWidth, type UserQuery } from '../shared';
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
  const screens = Grid.useBreakpoint();
  const bioWidth = getBioWidth(screens);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<LeaderRecord[]>([]);

  const columns = useMemo(() => {
    return leaderColumns(
      async (id) => {
        const response = await getLeader(id);
        return response.data ?? null;
      },
      editLeader,
      delLeader,
      () => {
        actionRef.current?.reload();
      },
      bioWidth,
    );
  }, [bioWidth]);

  return (
    <ListPage<LeaderRecord, UserQuery>
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
      rowSelection={{
        selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as string[]);
          setSelectedRows(rows as LeaderRecord[]);
        },
      }}
      toolbarActions={batchActions({
        entityLabel: '领队',
        selectedKeys: selectedRowKeys,
        selectedRows,
        statusRun: batchStatusLeader,
        onStatused: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          actionRef.current?.reload();
        },
        delRun: batchDelLeader,
        onDeleted: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          actionRef.current?.reload();
        },
        exportRequest: exportLeader,
      })}
    />
  );
};

export default LeaderPage;
