import type { CommentItem } from '@/services/comment/types';
import {
  DeleteOutlined,
  EyeOutlined,
  FireFilled,
  LikeFilled,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, Button, Space, Tag, theme, Tooltip, Typography } from 'antd';

export interface CommentQuery {
  current?: number;
  pageSize?: number;
  target_type?: string;
  nickname?: string;
  title?: string;
  level?: string;
  begin_time?: string;
  finish_time?: string;
  sort_field?: string;
  sort_order?: string;
}

const targetTypeEnum = {
  笔记: { text: '笔记' },
  攻略: { text: '攻略' },
};

const levelEnum = {
  一级: { text: '一级' },
  二级: { text: '二级' },
};

const tagColor = (text: string) => {
  switch (text) {
    case '正常':
      return 'success';
    case '已删除':
      return 'error';
    case '笔记':
      return 'blue';
    case '攻略':
      return 'purple';
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

const ellipsisText = (text?: string, width = 180) => {
  return (
    <Tooltip title={text}>
      <Typography.Text
        style={{ width, display: 'block' }}
        ellipsis={{ tooltip: false }}
      >
        {text || '-'}
      </Typography.Text>
    </Tooltip>
  );
};

const ReplyContent = ({
  record,
  width = 260,
}: {
  record: CommentItem;
  width?: number;
}) => {
  const { token } = theme.useToken();
  const isReply = record.level === '二级' && record.reply_to_nickname;
  const fullText = isReply
    ? `@${record.reply_to_nickname} ${record.content}`
    : record.content;

  return (
    <Tooltip title={fullText}>
      <div
        style={{
          width,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {isReply ? (
          <>
            <span
              style={{ color: token.colorPrimary }}
            >{`@${record.reply_to_nickname}`}</span>
            <span>{` ${record.content}`}</span>
          </>
        ) : (
          fullText || '-'
        )}
      </div>
    </Tooltip>
  );
};

const renderTarget = (record: CommentItem) => {
  return (
    <Space size={8}>
      <Tag color={tagColor(record.target_type)} style={{ marginInlineEnd: 0 }}>
        {record.target_type}
      </Tag>
      {ellipsisText(record.target_title, 170)}
    </Space>
  );
};

const renderUser = (record: CommentItem) => {
  return (
    <Space size={8}>
      <Avatar src={record.avatar} alt={record.nickname} />
      {ellipsisText(record.nickname, 120)}
    </Space>
  );
};

interface CommentActionsProps {
  record: CommentItem;
  onDetail: (record: CommentItem) => void;
  onDelete: (record: CommentItem) => void;
  deleting: boolean;
  canDetail: boolean;
  canDelete: boolean;
}

const CommentActions = ({
  record,
  onDetail,
  onDelete,
  deleting,
  canDetail,
  canDelete,
}: CommentActionsProps) => {
  const { token } = theme.useToken();

  return (
    <Space size={0}>
      {canDetail && (
        <Button
          type="link"
          icon={<EyeOutlined />}
          style={{ color: token.colorInfo, paddingInline: 4 }}
          onClick={() => onDetail(record)}
        >
          详情
        </Button>
      )}
      {canDelete && (
        <Button
          danger
          type="link"
          icon={<DeleteOutlined />}
          style={{ paddingInline: 4 }}
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
  onDetail: (record: CommentItem) => void;
  onDelete: (record: CommentItem) => void;
  deleting: boolean;
  canDetail: boolean;
  canDelete: boolean;
}

export const commentColumns = ({
  onDetail,
  onDelete,
  deleting,
  canDetail,
  canDelete,
}: ColsProps): ProColumns<CommentItem>[] => {
  const columns: ProColumns<CommentItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 90,
      hideInSearch: true,
    },
    {
      title: '所属作品',
      dataIndex: 'title',
      width: 250,
      fieldProps: {
        placeholder: '请输入作品标题',
      },
      render: (_, record) => renderTarget(record),
    },
    {
      title: '评论类型',
      dataIndex: 'target_type',
      valueType: 'select',
      valueEnum: targetTypeEnum,
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择评论类型',
      },
    },
    {
      title: '发布用户',
      dataIndex: 'nickname',
      width: 180,
      fieldProps: {
        placeholder: '请输入用户昵称',
      },
      render: (_, record) => renderUser(record),
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      width: 280,
      hideInSearch: true,
      render: (_, record) => <ReplyContent record={record} />,
    },
    {
      title: '发布时间',
      dataIndex: 'create_time',
      width: 170,
      hideInSearch: true,
    },
    {
      title: '点赞',
      dataIndex: 'like_count',
      width: 90,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <Space size={6}>
          <LikeFilled style={{ color: '#1677ff' }} />
          {record.like_count}
        </Space>
      ),
    },
    {
      title: '热度',
      dataIndex: 'heat',
      width: 90,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <Space size={6}>
          <FireFilled style={{ color: '#fa8c16' }} />
          {record.heat}
        </Space>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: levelEnum,
      width: 90,
      render: (_, record) => <Tag>{record.level}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={tagColor(record.status)}>{record.status}</Tag>
      ),
    },
    {
      title: '评论时间',
      dataIndex: 'comment_range',
      valueType: 'dateTimeRange',
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
      render: (_, record) => (
        <CommentActions
          record={record}
          onDetail={onDetail}
          onDelete={onDelete}
          deleting={deleting}
          canDetail={canDetail}
          canDelete={canDelete}
        />
      ),
    },
  ];

  return canDetail || canDelete
    ? columns
    : columns.filter((item) => item.key !== 'option');
};
