import type {
  ManagerCreate,
  ManagerEdit,
  ManagerItem,
} from '@/services/authority/manager/types';
import { DeleteOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';

export interface ManagerQueryParams {
  username?: string;
  role?: string;
  status?: boolean;
  current?: number;
  pageSize?: number;
}

export type ManagerRecord = ManagerItem;
export type CreateValues = ManagerCreate;
export type EditValues = ManagerEdit;
export const ROLE_OPTIONS = [
  { label: '内容管理员', value: '内容管理员' },
  { label: '运营专员', value: '运营专员' },
  { label: '用户管理员', value: '用户管理员' },
  { label: '活动管理员', value: '活动管理员' },
];

export const STATUS_OPTIONS = [
  { label: '启用', value: true },
  { label: '禁用', value: false },
];

const renderStatus = (status: boolean) => {
  return (
    <Tag color={status ? 'success' : 'error'}>{status ? '启用' : '禁用'}</Tag>
  );
};

interface ColumnOptions {
  onEdit: (record: ManagerRecord) => void;
  onResetPassword: (record: ManagerRecord) => void;
  onDelete: (record: ManagerRecord) => void;
}

const renderActions = (record: ManagerRecord, options: ColumnOptions) => {
  return (
    <Space size={0}>
      <Button
        type="link"
        icon={<EditOutlined />}
        style={{ paddingInline: 4 }}
        onClick={() => {
          options.onEdit(record);
        }}
      >
        编辑
      </Button>
      <Button
        type="link"
        icon={<KeyOutlined />}
        style={{ color: '#faad14', paddingInline: 4 }}
        onClick={() => {
          options.onResetPassword(record);
        }}
      >
        重置密码
      </Button>
      <Button
        danger
        type="link"
        icon={<DeleteOutlined />}
        style={{ paddingInline: 4 }}
        onClick={() => {
          options.onDelete(record);
        }}
      >
        删除
      </Button>
    </Space>
  );
};

export const managerColumns = (
  options: ColumnOptions,
): ProColumns<ManagerRecord>[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '账号',
    dataIndex: 'username',
    width: 160,
    fieldProps: {
      placeholder: '请输入账号',
    },
  },
  {
    title: '真实姓名',
    dataIndex: 'adminname',
    width: 140,
    hideInSearch: true,
  },
  {
    title: '所属角色',
    dataIndex: 'role',
    width: 140,
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择所属角色',
      options: ROLE_OPTIONS,
    },
  },
  {
    title: '账号状态',
    dataIndex: 'status',
    width: 120,
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择账号状态',
      options: STATUS_OPTIONS,
    },
    render: (_, record) => renderStatus(record.status),
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 180,
    hideInSearch: true,
  },
  {
    title: '最近登录时间',
    dataIndex: 'last_login',
    width: 180,
    hideInSearch: true,
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    width: 220,
    render: (_, record) => renderActions(record, options),
  },
];
