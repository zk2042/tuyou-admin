import type { SensitiveWordItem } from '@/services/sensitive-word/types';
import { DeleteOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, theme, Tooltip } from 'antd';

export interface SensitiveWordQuery {
  current?: number;
  pageSize?: number;
  keyword?: string;
}

const textEllipsis = (text?: string, width = 360) => {
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

interface SensitiveActionsProps {
  record: SensitiveWordItem;
  onDelete?: (record: SensitiveWordItem) => void;
  deleting: boolean;
}

const SensitiveActions = ({
  record,
  onDelete,
  deleting,
}: SensitiveActionsProps) => {
  const { token } = theme.useToken();

  return (
    <Space size={0}>
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
  onDelete?: (record: SensitiveWordItem) => void;
  deleting: boolean;
}

export const sensitiveWordColumns = ({
  onDelete,
  deleting,
}: ColsProps): ProColumns<SensitiveWordItem>[] => {
  const columns: ProColumns<SensitiveWordItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '敏感词',
      dataIndex: 'keyword',
      width: 360,
      fieldProps: {
        placeholder: '请输入敏感词搜索',
      },
      search: {
        transform: (value) => ({ keyword: value }),
      },
      render: (_, record) => textEllipsis(record.word, 360),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <SensitiveActions
          record={record}
          onDelete={onDelete}
          deleting={deleting}
        />
      ),
    },
  ];

  return onDelete ? columns : columns.filter((item) => item.key !== 'option');
};
