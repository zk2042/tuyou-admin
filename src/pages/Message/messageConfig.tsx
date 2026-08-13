import type { MessageItem } from '@/services/message/system/types';
import { DeleteOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, theme, Tooltip } from 'antd';

export interface MessageQuery {
  current?: number;
  pageSize?: number;
  msg_type?: string;
  begin_time?: string;
  finish_time?: string;
}

const tagColor = (text: string) => {
  switch (text) {
    case '点赞':
    case '关注':
      return 'magenta';
    case '评论':
      return 'blue';
    case '收藏':
      return 'gold';
    case '系统':
      return 'green';
    case '活动':
      return 'purple';
    case '全体':
      return 'success';
    case '指定会员':
      return 'processing';
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

const textEllipsis = (text?: string, width = 260) => {
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

interface MsgActionsProps {
  record: MessageItem;
  onDelete?: (record: MessageItem) => void;
  deleting: boolean;
}

const MsgActions = ({ record, onDelete, deleting }: MsgActionsProps) => {
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
  msgTypeEnum: Record<string, { text: string }>;
  onDelete?: (record: MessageItem) => void;
  deleting: boolean;
}

export const messageColumns = ({
  msgTypeEnum,
  onDelete,
  deleting,
}: ColsProps): ProColumns<MessageItem>[] => {
  const columns: ProColumns<MessageItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '消息类型',
      dataIndex: 'msg_type',
      valueType: 'select',
      width: 100,
      valueEnum: msgTypeEnum,
      render: (_, record) => (
        <Tag color={tagColor(record.msg_type)}>{record.msg_type}</Tag>
      ),
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      width: 320,
      hideInSearch: true,
      render: (_, record) => textEllipsis(record.content, 320),
    },
    {
      title: '接收对象',
      dataIndex: 'receive_type',
      width: 110,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={tagColor(record.receive_type)}>{record.receive_type}</Tag>
      ),
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      width: 130,
      hideInSearch: true,
      render: (_, record) => textEllipsis(record.sender, 130),
    },
    {
      title: '发送时间',
      dataIndex: 'send_time',
      width: 170,
      hideInSearch: true,
    },
    {
      title: '发送时间',
      dataIndex: 'send_range',
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <MsgActions record={record} onDelete={onDelete} deleting={deleting} />
      ),
    },
  ];

  return onDelete ? columns : columns.filter((item) => item.key !== 'option');
};
