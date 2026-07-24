import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { queryLeaderPage } from '@/services/user/leader';
import React, { useMemo, useState } from 'react';

import { batchActions, dateRange, type UserQuery } from '../shared';
import { leaderColumns, type LeaderRecord } from './leaderConfig';

const leaderRequest = async (params: UserQuery) => {
  try {
    const response = await queryLeaderPage<LeaderRecord>({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      id: params.id,
      nickname: params.nickname,
      mobile: params.mobile,
      ...dateRange(params.registeredAt),
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = useMemo(() => leaderColumns(), []);

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
      })}
    />
  );
};

export default LeaderPage;
