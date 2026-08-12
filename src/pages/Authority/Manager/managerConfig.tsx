import type {
  ManagerCreate,
  ManagerEdit,
  ManagerItem,
} from '@/services/authority/manager/types';
import { DeleteOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Spin, Tag } from 'antd';

export interface ManagerQueryParams {
  username?: string;
  role?: string;
  status?: string;
  current?: number;
  pageSize?: number;
}

export type ManagerRecord = ManagerItem;
export type CreateValues = ManagerCreate;
export type EditValues = ManagerEdit;
export interface RoleProps {
  roleOptions: { label: string; value: string }[];
  roleLoading: boolean;
  onRoleOpen: (open: boolean) => void;
}
export const STATUS_OPTIONS = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
];

const renderStatus = (status: string) => {
  return <Tag color={status === '启用' ? 'success' : 'error'}>{status}</Tag>;
};

interface ColumnOptions extends RoleProps {
  canEdit: boolean;
  canResetPassword: boolean;
  canDelete: boolean;
  onEdit: (record: ManagerRecord) => void;
  onResetPassword: (record: ManagerRecord) => void;
  onDelete: (record: ManagerRecord) => void;
}

const renderActions = (record: ManagerRecord, options: ColumnOptions) => {
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
      {options.canResetPassword && (
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
      options: options.roleOptions,
      loading: options.roleLoading,
      showSearch: true,
      optionFilterProp: 'label',
      notFoundContent: options.roleLoading ? <Spin size="small" /> : '暂无角色',
      onOpenChange: options.onRoleOpen,
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
