import type {
  RoleCreate,
  RoleEdit,
  RoleItem,
} from '@/services/authority/role/types';
import {
  DeleteOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';

export interface RoleQueryParams {
  role_name?: string;
  status?: string;
  current?: number;
  pageSize?: number;
}

export type RoleRecord = RoleItem;
export type CreateValues = RoleCreate;
export type EditValues = RoleEdit;

export const STATUS_OPTIONS = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
];

interface ColumnOptions {
  canEdit: boolean;
  canAssign: boolean;
  canDelete: boolean;
  onEdit: (record: RoleRecord) => void;
  onAssign: (record: RoleRecord) => void;
  onDelete: (record: RoleRecord) => void;
}

const renderStatus = (status: string) => {
  return <Tag color={status === '启用' ? 'success' : 'error'}>{status}</Tag>;
};

const renderActions = (record: RoleRecord, options: ColumnOptions) => {
  return (
    <Space size={0}>
      {options.canEdit && (
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
      )}
      {options.canAssign && (
        <Button
          type="link"
          icon={<SafetyCertificateOutlined />}
          style={{ color: '#2e7d32', paddingInline: 4 }}
          onClick={() => {
            options.onAssign(record);
          }}
        >
          分配权限
        </Button>
      )}
      {options.canDelete && (
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
      )}
    </Space>
  );
};

export const roleColumns = (
  options: ColumnOptions,
): ProColumns<RoleRecord>[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '角色名称',
    dataIndex: 'role_name',
    width: 160,
    fieldProps: {
      placeholder: '请输入角色名称',
    },
  },
  {
    title: '角色标识',
    dataIndex: 'role_code',
    width: 180,
    hideInSearch: true,
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
    render: (_, record) => renderStatus(record.status),
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 300,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 180,
    hideInSearch: true,
  },
  {
    title: '最近更新时间',
    dataIndex: 'update_time',
    width: 180,
    hideInSearch: true,
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    width: 250,
    render: (_, record) => renderActions(record, options),
  },
];
