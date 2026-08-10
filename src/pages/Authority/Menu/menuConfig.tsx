import type { MenuBody, MenuItem } from '@/services/authority/menu/types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';

export interface MenuQueryParams {
  menu_name?: string;
  status?: string;
  current?: number;
  pageSize?: number;
}

export type MenuRecord = MenuItem;
export type MenuValues = MenuBody;

export const STATUS_OPTIONS = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
];

const renderStatus = (status: string) => {
  return <Tag color={status === '启用' ? 'success' : 'error'}>{status}</Tag>;
};

interface ColumnOptions {
  onEdit: (record: MenuRecord) => void;
  onDelete: (record: MenuRecord) => void;
}

const renderActions = (record: MenuRecord, options: ColumnOptions) => {
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

export const menuColumns = (
  options: ColumnOptions,
): ProColumns<MenuRecord>[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '菜单名称',
    dataIndex: 'menu_name',
    width: 140,
    fieldProps: {
      placeholder: '请输入菜单名称',
    },
  },
  {
    title: '父级菜单',
    dataIndex: 'parent_name',
    width: 140,
    hideInSearch: true,
    render: (_, record) => record.parent_name || '-',
  },
  {
    title: '类型',
    dataIndex: 'menu_type',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '路由路径',
    dataIndex: 'route_path',
    width: 180,
    hideInSearch: true,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80,
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
    width: 140,
    render: (_, record) => renderActions(record, options),
  },
];
