import type { ProColumns } from '@ant-design/pro-components';

import type { UserRecord } from '../shared';
import { roleTag, statusTag, tableActions, userAvatar } from '../shared';

export interface LeaderRecord extends UserRecord {
  leadCount: number;
}

export const leaderColumns = (): ProColumns<LeaderRecord>[] => {
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
      width: 70,
      render: userAvatar,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120,
      fieldProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
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
      dataIndex: 'signature',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '带队次数',
      dataIndex: 'leadCount',
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
      dataIndex: 'registeredAt',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAtRange',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['年/月/日', '年/月/日'],
      },
      search: {
        transform: (value) => ({
          registeredAt: value,
        }),
      },
    },
    {
      title: '最近登录',
      dataIndex: 'lastLogin',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 220,
      render: (_, record) => tableActions('领队', record),
    },
  ];
};
