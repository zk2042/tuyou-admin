import type { TagItem } from '@/services/tag/types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, theme, Tooltip } from 'antd';

export interface TagQuery {
  current?: number;
  pageSize?: number;
  tag_name?: string;
  status?: string;
  begin_time?: string;
  finish_time?: string;
}

const statusEnum = {
  启用: { text: '启用' },
  禁用: { text: '禁用' },
};

const tagColor = (text: string) => {
  switch (text) {
    case '启用':
    case '是':
      return 'success';
    case '禁用':
      return 'error';
    case '否':
      return 'default';
    default:
      return 'default';
  }
};

const createRange = (value?: [string, string]) => {
  if (!value) {
    return {};
  }

  return {
    begin_time: value[0],
    finish_time: value[1],
  };
};

const textEllipsis = (text?: string, width = 120) => {
  return (
    <Tooltip title={text}>
      <div
        style={{
          width,
          display: 'block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {text || '-'}
      </div>
    </Tooltip>
  );
};

interface TagActionsProps {
  record: TagItem;
  onEdit?: (record: TagItem) => void;
  onDelete?: (record: TagItem) => void;
  deleting: boolean;
}

const TagActions = ({
  record,
  onEdit,
  onDelete,
  deleting,
}: TagActionsProps) => {
  const { token } = theme.useToken();

  return (
    <Space size={0}>
      {onEdit && (
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{ paddingInline: 4 }}
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
      )}
      {onDelete && (
        <Button
          danger
          type="link"
          icon={<DeleteOutlined />}
          style={{ color: token.colorError, paddingInline: 4 }}
          loading={deleting}
          onClick={() => onDelete(record)}
        >
          删除
        </Button>
      )}
    </Space>
  );
};

interface ColsProps {
  onEdit?: (record: TagItem) => void;
  onDelete?: (record: TagItem) => void;
  deleting: boolean;
}

export const tagColumns = ({
  onEdit,
  onDelete,
  deleting,
}: ColsProps): ProColumns<TagItem>[] => {
  const columns: ProColumns<TagItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '标签名称',
      dataIndex: 'tag_name',
      width: 160,
      fieldProps: {
        placeholder: '请输入标签名称',
      },
      render: (_, record) => textEllipsis(record.tag_name, 160),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 100,
      valueEnum: statusEnum,
      render: (_, record) => (
        <Tag color={tagColor(record.status)}>{record.status}</Tag>
      ),
    },
    {
      title: '是否热门',
      dataIndex: 'is_hot',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={tagColor(record.is_hot)}>{record.is_hot}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 170,
      hideInSearch: true,
    },
    {
      title: '删除时间',
      dataIndex: 'delete_time',
      width: 170,
      hideInSearch: true,
      render: (_, record) => record.delete_time || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'create_range',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['开始时间', '结束时间'],
      },
      search: {
        transform: createRange,
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <TagActions
          record={record}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
        />
      ),
    },
  ];

  return onEdit || onDelete
    ? columns
    : columns.filter((item) => item.key !== 'option');
};
