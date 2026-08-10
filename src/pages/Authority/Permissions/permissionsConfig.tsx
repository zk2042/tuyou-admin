import type {
  PermBody,
  PermItem,
} from '@/services/authority/permissions/types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';

export interface PermQueryParams {
  perm_name?: string;
  module?: string;
  status?: string;
  current?: number;
  pageSize?: number;
}

export type PermRecord = PermItem;
export type PermValues = PermBody;

export const STATUS_OPTIONS = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
];

export const MODULE_OPTIONS = [
  '个人中心',
  '用户管理',
  '活动管理',
  '内容管理',
  '评论管理',
  '权限管理',
].map((value) => ({ label: value, value }));

interface ColumnOptions {
  onEdit: (record: PermRecord) => void;
  onDelete: (record: PermRecord) => void;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'processing',
  POST: 'success',
  PUT: 'warning',
  PATCH: 'gold',
  DELETE: 'error',
};

const renderActions = (record: PermRecord, options: ColumnOptions) => (
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

export const permissionsColumns = (
  options: ColumnOptions,
): ProColumns<PermRecord>[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '权限名称',
    dataIndex: 'perm_name',
    width: 160,
    fieldProps: {
      placeholder: '请输入权限名称',
    },
  },
  {
    title: '模块',
    dataIndex: 'module',
    width: 140,
    fieldProps: {
      placeholder: '请输入模块',
    },
  },
  {
    title: '权限标识',
    dataIndex: 'perm_key',
    width: 220,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择状态',
      options: STATUS_OPTIONS,
    },
    render: (_, record) => (
      <Tag color={record.status === '启用' ? 'success' : 'error'}>
        {record.status}
      </Tag>
    ),
  },
  {
    title: '请求方法',
    dataIndex: 'request_method',
    width: 110,
    hideInSearch: true,
    render: (_, record) => {
      const method = record.request_method.toUpperCase();
      return <Tag color={METHOD_COLORS[method] ?? 'default'}>{method}</Tag>;
    },
  },
  {
    title: 'API 路径',
    dataIndex: 'api_path',
    width: 300,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    width: 150,
    render: (_, record) => renderActions(record, options),
  },
];
