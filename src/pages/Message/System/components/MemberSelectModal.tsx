import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { queryMember } from '@/services/user/member';
// import type { MemberItem } from '@/services/user/member/types';
import {
  memberColumns,
  type MemberRecord,
} from '@/pages/User/Member/memberConfig';
import { type UserQuery, type UserRecord } from '@/pages/User/shared';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Grid, Modal } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getBioWidth } from '@/pages/User/shared';

export type SelectedMember = Pick<
  UserRecord,
  'id' | 'nickname' | 'avatar' | 'phone'
>;

interface MemberSelectModalProps {
  open: boolean;
  loading?: boolean;
  value?: SelectedMember[];
  onCancel: () => void;
  onConfirm: (selected: SelectedMember[]) => void;
}

//+ 请求函数：返回 MemberRecord（与 ProTable 泛型一致）
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
      data: (pageData?.list ?? []) as MemberRecord[],
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

const MemberSelectModal = ({
  open,
  loading,
  value = [],
  onCancel,
  onConfirm,
}: MemberSelectModalProps) => {
  const actionRef = useRef<ActionType>();
  const screens = Grid.useBreakpoint();
  const bioWidth = getBioWidth(screens);

  //+ 本地选中的行 key（id），用于回显和跨页保持选择
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  //+ 本地选中的行完整数据，用于确认时回传
  const [selectedRows, setSelectedRows] = useState<MemberRecord[]>([]);

  //+ 弹窗打开时，将外部传入的 value 同步到本地选中状态
  useEffect(() => {
    if (!open) {
      return;
    }

    const keys = value.map((item) => String(item.id));
    setSelectedRowKeys(keys);
    //+ 注意：外部 value 可能缺少完整字段，这里只同步 key；
    //+ 如果用户打开弹窗后立即确认，使用 value 作为兜底
    setSelectedRows(value as MemberRecord[]);
  }, [open, value]);

  //+ 选择列（只在选择弹窗里用精简列，去掉编辑/删除等操作按钮）
  const columns: ProColumns<MemberRecord>[] = useMemo(() => {
    const allCols = memberColumns(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      bioWidth,
      {
        list: true,
        detail: false,
        edit: false,
        delete: false,
        restore: false,
        batchStatus: false,
        batchDelete: false,
        export: false,
      },
    );

    //+ 移除「操作」列，只保留展示字段
    return allCols.filter((col) => col.key !== 'option');
  }, [bioWidth]);

  const handleConfirm = () => {
    //+ 优先使用本地 selectedRows；如果为空（打开后立即确认），使用外部 value
    const rows =
      selectedRows.length > 0 ? selectedRows : (value as MemberRecord[]);

    const result: SelectedMember[] = rows.map((row) => ({
      id: row.id,
      nickname: row.nickname,
      avatar: row.avatar,
      phone: row.phone,
    }));

    onConfirm(result);
  };

  return (
    <Modal
      title="选择会员"
      open={open}
      width={960}
      destroyOnHidden
      confirmLoading={loading}
      okText="确认选择"
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleConfirm}
      styles={{ body: { paddingTop: 12 } }}
    >
      <ProTable<MemberRecord, UserQuery>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={memberRequest}
        search={{
          defaultCollapsed: false,
          span: 8,
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showSizeChanger: true,
        }}
        rowSelection={{
          selectedRowKeys,
          preserveSelectedRowKeys: true,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys as string[]);
            setSelectedRows(rows as MemberRecord[]);
          },
        }}
        tableStyle={{ marginBlockStart: 12 }}
        tableExtraRender={() =>
          selectedRowKeys.length > 0 ? (
            <span>已选择 {selectedRowKeys.length} 个会员</span>
          ) : null
        }
      />
    </Modal>
  );
};

export default MemberSelectModal;
