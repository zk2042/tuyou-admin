import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import {
  batchDelMember,
  batchStatusMember,
  delMember,
  editMember,
  exportMember,
  getMember,
  queryMember,
} from '@/services/user/member';
import type { ActionType } from '@ant-design/pro-components';
import { Grid } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { batchActions, getBioWidth, type UserQuery } from '../shared';
import { memberColumns, type MemberRecord } from './memberConfig';

const memberRequest = async (params: UserQuery) => {
  try {
    const response = await queryMember({
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

const MemberPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const screens = Grid.useBreakpoint();
  const bioWidth = getBioWidth(screens);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<MemberRecord[]>([]);

  const columns = useMemo(() => {
    return memberColumns(
      async (id) => {
        const response = await getMember(id);
        return response.data ?? null;
      },
      editMember,
      delMember,
      () => {
        actionRef.current?.reload();
      },
      bioWidth,
    );
  }, [bioWidth]);

  return (
    <ListPage<MemberRecord, UserQuery>
      actionRef={actionRef}
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
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys as string[]);
          setSelectedRows(rows as MemberRecord[]);
        },
      }}
      toolbarActions={batchActions({
        entityLabel: '会员',
        selectedKeys: selectedRowKeys,
        selectedRows,
        statusRun: batchStatusMember,
        onStatused: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          actionRef.current?.reload();
        },
        delRun: batchDelMember,
        onDeleted: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          actionRef.current?.reload();
        },
        exportRequest: exportMember,
      })}
    />
  );
};

export default MemberPage;
