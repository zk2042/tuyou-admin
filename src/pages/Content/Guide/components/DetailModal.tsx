import Detail from '@/components/Detail';
import type { GuideDetail } from '@/services/content/guide/types';
import { EyeOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import { Image, Space, Tag, theme, Typography } from 'antd';
import type { CSSProperties } from 'react';

interface DetailProps {
  open: boolean;
  loading: boolean;
  record?: GuideDetail;
  onClose: () => void;
}

const tagColor = (text: string) => {
  switch (text) {
    case '正常':
    case '是':
      return 'success';
    case '已下架':
      return 'error';
    default:
      return 'default';
  }
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
  record: GuideDetail,
  token: ReturnType<typeof theme.useToken>['token'],
): DescriptionsProps['items'] => {
  return [
    {
      key: 'nickname',
      label: '发布人',
      children: record.nickname,
    },
    {
      key: 'category',
      label: '分类',
      children: record.category,
    },
    {
      key: 'difficulty',
      label: '难度',
      children: record.difficulty,
    },
    {
      key: 'tags',
      label: '标签',
      children: (
        <Space size={[4, 4]} wrap>
          {Array.isArray(record.tags) && record.tags.length
            ? record.tags.map((item) => (
                <Tag key={item} color="blue">
                  {item}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      key: 'publish_time',
      label: '发布时间',
      children: record.publish_time,
    },
    {
      key: 'distance',
      label: '距离',
      children: record.distance || '-',
    },
    {
      key: 'duration',
      label: '总时长',
      children: record.duration || '-',
    },
    {
      key: 'transport',
      label: '交通方式',
      children: record.transport || '-',
    },
    {
      key: 'view_count',
      label: '浏览量',
      children: record.view_count.toLocaleString('zh-CN'),
    },
    {
      key: 'like_count',
      label: '点赞',
      children: record.like_count.toLocaleString('zh-CN'),
    },
    {
      key: 'collect_count',
      label: '收藏',
      children: record.collect_count.toLocaleString('zh-CN'),
    },
    {
      key: 'comment_count',
      label: '评论',
      children: record.comment_count.toLocaleString('zh-CN'),
    },
    {
      key: 'heat',
      label: '热度',
      children: record.heat.toLocaleString('zh-CN'),
    },
    {
      key: 'is_slide',
      label: '是否为幻灯片',
      children: <Tag color={tagColor(record.is_slide)}>{record.is_slide}</Tag>,
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
    {
      key: 'cover_img',
      label: '封面',
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
      key: 'content',
      label: '攻略内容',
      children: (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
          {record.content || '-'}
        </div>
      ),
    },
  ];
};

const detailHeader = (
  record: GuideDetail,
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
          <Tag>{record.category}</Tag>
          <Tag>{record.difficulty}</Tag>
          <Tag color={tagColor(record.is_slide)}>{record.is_slide}</Tag>
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
      title="攻略详情"
      open={open}
      loading={loading}
      onClose={onClose}
      width={680}
      header={record ? detailHeader(record, token) : undefined}
      items={record ? detailItems(record, token) : []}
    />
  );
};

export default DetailModal;
