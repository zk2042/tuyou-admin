import Detail from '@/components/Detail';
import type { ActDetail } from '@/services/activity/types';
import { EyeOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import { Image, Space, Tag, theme, Typography } from 'antd';
import type { CSSProperties } from 'react';

interface DetailProps {
  open: boolean;
  loading: boolean;
  record?: ActDetail;
  onClose: () => void;
}

const tagColor = (text: string) => {
  switch (text) {
    case '报名中':
    case '正常':
    case '是':
      return 'success';
    case '进行中':
      return 'processing';
    case '已删除':
      return 'error';
    default:
      return 'default';
  }
};

const priceText = (price?: number | null) => {
  return typeof price === 'number' ? `¥${price.toLocaleString('zh-CN')}` : '-';
};

const Cover = ({
  src,
  alt,
  borderColor,
  fillColor,
}: {
  src: string;
  alt: string;
  borderColor: string;
  fillColor: string;
}) => {
  const style: CSSProperties = {
    width: 160,
    height: 100,
    overflow: 'hidden',
    borderRadius: 12,
    background: fillColor,
    border: `1px dashed ${borderColor}`,
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={100}
      wrapperStyle={style}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      preview={{
        movable: true,
        mask: (
          <Space size={6}>
            <EyeOutlined />
            <span>预览</span>
          </Space>
        ),
      }}
    />
  );
};

const detailItems = (
  record: ActDetail,
  token: ReturnType<typeof theme.useToken>['token'],
): DescriptionsProps['items'] => {
  return [
    {
      key: 'leader_name',
      label: '发起人',
      children: record.leader_name,
    },
    {
      key: 'leader_member_id',
      label: '领队ID',
      children: record.leader_member_id,
    },
    {
      key: 'activity_status',
      label: '活动状态',
      children: (
        <Tag color={tagColor(record.activity_status)}>
          {record.activity_status}
        </Tag>
      ),
    },
    {
      key: 'difficulty',
      label: '难度',
      children: record.difficulty,
    },
    {
      key: 'activity_type',
      label: '类型',
      children: record.activity_type,
    },
    {
      key: 'start_time',
      label: '开始日期',
      children: record.start_time,
    },
    {
      key: 'end_time',
      label: '结束日期',
      children: record.end_time,
    },
    {
      key: 'price',
      label: '费用',
      children: priceText(record.price),
    },
    {
      key: 'people',
      label: '已报名/上限',
      children: `${record.current_people}/${record.max_people}`,
    },

    {
      key: 'is_slide',
      label: '是否为幻灯片',
      children: <Tag color={tagColor(record.is_slide)}>{record.is_slide}</Tag>,
    },

    {
      key: 'is_del',
      label: '状态',
      children: <Tag color={tagColor(record.status)}>{record.status}</Tag>,
    },
    {
      key: 'delete_time',
      label: '删除时间',
      children: record.delete_time || '-',
    },
    {
      key: 'cover_img',
      label: '活动封面',
      children: (
        <Cover
          src={record.cover_img}
          alt={record.title}
          borderColor={token.colorBorder}
          fillColor={token.colorFillAlter}
        />
      ),
    },
    {
      key: 'activity_content',
      label: '活动介绍',
      children: (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
          {record.activity_content || '-'}
        </div>
      ),
    },
  ];
};

const detailHeader = (
  record: ActDetail,
  token: ReturnType<typeof theme.useToken>['token'],
) => {
  return (
    <Space size={16} align="start" style={{ marginBottom: 24 }}>
      <Cover
        src={record.cover_img}
        alt={record.title}
        borderColor={token.colorBorder}
        fillColor={token.colorFillAlter}
      />
      <Space direction="vertical" size={4}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {record.title}
        </Typography.Title>
        <Typography.Text type="secondary">ID：{record.id}</Typography.Text>
        <Space size={8} wrap>
          <Tag color={tagColor(record.activity_status)}>
            {record.activity_status}
          </Tag>
          <Tag color={tagColor(record.status)}>{record.status}</Tag>
        </Space>
      </Space>
    </Space>
  );
};

const DetailModal = ({ open, loading, record, onClose }: DetailProps) => {
  const { token } = theme.useToken();

  return (
    <Detail
      title="活动详情"
      open={open}
      loading={loading}
      onClose={onClose}
      width={640}
      header={record ? detailHeader(record, token) : undefined}
      items={record ? detailItems(record, token) : []}
    />
  );
};

export default DetailModal;
