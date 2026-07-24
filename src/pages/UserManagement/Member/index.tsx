import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { queryMemberPage } from '@/services/user/member';
import React, { useMemo, useState } from 'react';

import { batchActions, dateRange, type UserQuery } from '../shared';
import { memberColumns, type MemberRecord } from './memberConfig';

const memberRequest = async (params: UserQuery) => {
  try {
    const response = await queryMemberPage<MemberRecord>({
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

const MemberPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = useMemo(() => memberColumns(), []);

  return (
    <ListPage<MemberRecord, UserQuery>
      rowKey="id"
      headerTitle="会员列表"
      columns={columns}
      request={memberRequest}
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
        entityLabel: '会员',
        selectedCount: selectedRowKeys.length,
      })}
    />
  );
};

export default MemberPage;
