import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { exportLeader, getLeader, queryLeader } from '@/services/user/leader';
import { Grid } from 'antd';
import React, { useMemo, useState } from 'react';

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
  const screens = Grid.useBreakpoint();
  const bioWidth = getBioWidth(screens);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = useMemo(() => {
    return leaderColumns(async (id) => {
      const response = await getLeader(id);
      return response.data ?? null;
    }, bioWidth);
  }, [bioWidth]);

  return (
    <ListPage<LeaderRecord, UserQuery>
      rowKey="id"
      headerTitle="领队列表"
      columns={columns}
      request={leaderRequest}
      options={false}
      search={{
        defaultCollapsed: false,
        span: 8,
      }}
      rowSelection={{
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      }}
      toolbarActions={batchActions({
        entityLabel: '领队',
        selectedCount: selectedRowKeys.length,
        exportRequest: exportLeader,
      })}
    />
  );
};

export default LeaderPage;
