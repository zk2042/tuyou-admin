import type { ProColumns } from '@ant-design/pro-components';

import type { DelRun, DetailLoad, EditSave, UserRecord } from '../shared';
import {
  dateRange,
  roleTag,
  statusTag,
  tableActions,
  textEllipsis,
  userAvatar,
} from '../shared';

export interface LeaderRecord extends UserRecord {
  leading_count: number;
}

export const leaderColumns = (
  loadDetail: DetailLoad,
  editSave: EditSave | undefined,
  delRun: DelRun | undefined,
  onEdited: (() => void) | undefined,
  bioWidth: number,
): ProColumns<LeaderRecord>[] => {
  return [
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
      width: 110,
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
      title: '带队次数',
      dataIndex: 'leading_count',
      width: 80,
      hideInSearch: true,
    },

    {
      title: '角色',
      dataIndex: 'role',
      width: 70,
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
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 220,
      render: (_, record) =>
        tableActions('领队', loadDetail, editSave, delRun, onEdited, record),
    },
  ];
};
