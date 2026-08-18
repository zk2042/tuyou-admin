import type { ProColumns } from '@ant-design/pro-components';

import type {
  DelRun,
  DetailLoad,
  EditSave,
  RestoreRun,
  UserPermissions,
  UserRecord,
} from '../shared';
import {
  dateRange,
  hasRowActions,
  roleTag,
  statusTag,
  tableActions,
  textEllipsis,
  userAvatar,
} from '../shared';

export type MemberRecord = UserRecord;

export const memberColumns = (
  loadDetail: DetailLoad | undefined,
  editSave: EditSave | undefined,
  delRun: DelRun | undefined,
  restoreRun: RestoreRun | undefined,
  onEdited: (() => void) | undefined,
  bioWidth: number,
  permissions: UserPermissions,
): ProColumns<MemberRecord>[] => {
  const columns: ProColumns<MemberRecord>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fieldProps: {
        placeholder: '请输入 ID',
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      width: 60,
      render: userAvatar,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 90,
      fieldProps: {
        placeholder: '请输入昵称',
      },
      render: (_, record) => textEllipsis(record.nickname, 90),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
      fieldProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 70,
      hideInSearch: true,
      render: (_, record) => statusTag(record.status),
    },
    {
      title: '签名',
      dataIndex: 'bio',
      width: bioWidth,
      hideInSearch: true,
      render: (_, record) => textEllipsis(record.bio, bioWidth),
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 80,
      hideInSearch: true,
      render: (_, record) => roleTag(record.role),
    },
    {
      title: '注册时间',
      dataIndex: 'register_time',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '注册时间',
      dataIndex: 'register_range',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['请选择', '请选择'],
      },
      search: {
        transform: dateRange,
      },
    },
    {
      title: '最近登录',
      dataIndex: 'last_login',
      width: 140,
      hideInSearch: true,
    },
  ];

  if (hasRowActions(permissions)) {
    columns.push({
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 260,
      render: (_, record) =>
        tableActions(
          '会员',
          loadDetail,
          editSave,
          delRun,
          restoreRun,
          onEdited,
          record,
        ),
    });
  }

  return columns;
};
