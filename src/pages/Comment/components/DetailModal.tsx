import Detail from '@/components/Detail';
import type { CommentDetail } from '@/services/comment/types';
import type { DescriptionsProps } from 'antd';
import { Avatar, Space, Tag, theme, Typography } from 'antd';

interface DetailProps {
  open: boolean;
  loading: boolean;
  record?: CommentDetail;
  onClose: () => void;
}

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

const commentText = (record: CommentDetail, mentionColor: string) => {
  if (record.level === '二级' && record.reply_to_nickname) {
    return (
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
        <span
          style={{ color: mentionColor }}
        >{`@${record.reply_to_nickname}`}</span>
        <span>{` ${record.content}`}</span>
      </div>
    );
  }

  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
      {record.content || '-'}
    </div>
  );
};

const detailItems = (
  record: CommentDetail,
  mentionColor: string,
): DescriptionsProps['items'] => {
  return [
    {
      key: 'nickname',
      label: '评论用户',
      children: (
        <Space size={10}>
          <Avatar size={40} src={record.avatar} alt={record.nickname}>
            {record.nickname.slice(0, 1)}
          </Avatar>
          <span>{record.nickname}</span>
        </Space>
      ),
    },
    {
      key: 'content',
      label: '评论内容',
      children: commentText(record, mentionColor),
    },
    {
      key: 'level',
      label: '评论层级',
      children: <Tag>{record.level}</Tag>,
    },
    {
      key: 'reply_to_nickname',
      label: '回复对象',
      children: record.reply_to_nickname || '-',
    },
    {
      key: 'like_count',
      label: '点赞数',
      children: record.like_count.toLocaleString('zh-CN'),
    },
    {
      key: 'heat',
      label: '热度',
      children: record.heat.toLocaleString('zh-CN'),
    },
    {
      key: 'create_time',
      label: '发布时间',
      children: record.create_time,
    },
    {
      key: 'status',
      label: '状态',
      children: <Tag color={tagColor(record.status)}>{record.status}</Tag>,
    },
    {
      key: 'delete_time',
      label: '删除时间',
      children: record.delete_time || '-',
    },
  ];
};

const detailHeader = (record: CommentDetail) => {
  return (
    <Space direction="vertical" size={4} style={{ marginBottom: 24 }}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        {record.target_title}
      </Typography.Title>
      <Typography.Text type="secondary">ID：{record.id}</Typography.Text>
      <Space size={8} wrap>
        <Tag color={tagColor(record.target_type)}>{record.target_type}</Tag>
        <Tag>{record.level}</Tag>
        <Tag color={tagColor(record.status)}>{record.status}</Tag>
      </Space>
    </Space>
  );
};

const DetailModal = ({ open, loading, record, onClose }: DetailProps) => {
  const { token } = theme.useToken();

  return (
    <Detail
      title="评论详情"
      open={open}
      loading={loading}
      onClose={onClose}
      width={640}
      header={record ? detailHeader(record) : undefined}
      items={record ? detailItems(record, token.colorPrimary) : []}
    />
  );
};

export default DetailModal;
