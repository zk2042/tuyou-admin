import Detail from '@/components/Detail';
import { EyeOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import { Avatar, Image, Space, Spin, Tag, theme, Typography } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

import { MEMBER_STATUS } from '../shared';

type DetailRecord = {
  id: string;
  avatar: string;
  bg_img?: string;
  nickname: string;
  phone: string;
  follow_count?: number;
  favorite_count?: number;
  publish_count?: number;
  fans_count?: number;
  status: number;
  bio: string;
  role: string;
  register_time: string;
  last_login: string;
  leading_count?: number;
};

interface PreviewProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  shape?: 'circle' | 'default';
  bordered?: boolean;
  fallback: ReactNode;
  borderColor: string;
  fillColor: string;
}

interface DetailProps {
  entityLabel: string;
  record: DetailRecord;
  open: boolean;
  loading: boolean;
  onClose: () => void;
}

const statusTag = (status: number) => {
  const color =
    status === MEMBER_STATUS.NORMAL
      ? 'success'
      : status === MEMBER_STATUS.DISABLED
      ? 'error'
      : 'default';
  const text =
    status === MEMBER_STATUS.NORMAL
      ? '正常'
      : status === MEMBER_STATUS.CANCELLED
      ? '已注销'
      : '禁用';

  return <Tag color={color}>{text}</Tag>;
};

const roleTag = (role: string) => {
  const color = role === '领队' ? 'warning' : 'processing';

  return <Tag color={color}>{role}</Tag>;
};

const countText = (value?: number) => {
  return typeof value === 'number' ? `${value}` : '-';
};

const PreviewImage = ({
  src,
  alt,
  width,
  height,
  shape = 'default',
  bordered = false,
  fallback,
  borderColor,
  fillColor,
}: PreviewProps) => {
  const radius = shape === 'circle' ? '50%' : 12;
  const wrapperStyle: CSSProperties = {
    width,
    height,
    overflow: 'hidden',
    borderRadius: radius,
    background: fillColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: bordered ? `1px dashed ${borderColor}` : undefined,
  };

  if (!src) {
    return <div style={wrapperStyle}>{fallback}</div>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      wrapperStyle={wrapperStyle}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: radius,
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
  record: DetailRecord,
  token: ReturnType<typeof theme.useToken>['token'],
): DescriptionsProps['items'] => {
  return [
    {
      key: 'phone',
      label: '手机号',
      children: record.phone,
    },
    {
      key: 'status',
      label: '状态',
      children: statusTag(record.status),
    },
    {
      key: 'role',
      label: '角色',
      children: roleTag(record.role),
    },
    {
      key: 'follow_count',
      label: '关注数',
      children: countText(record.follow_count),
    },
    {
      key: 'favorite_count',
      label: '收藏数',
      children: countText(record.favorite_count),
    },
    {
      key: 'publish_count',
      label: '发布数',
      children: countText(record.publish_count),
    },
    {
      key: 'fans_count',
      label: '粉丝数',
      children: countText(record.fans_count),
    },
    ...(typeof record.leading_count === 'number'
      ? [
          {
            key: 'leading_count',
            label: '带队次数',
            children: `${record.leading_count}`,
          },
        ]
      : []),
    {
      key: 'bio',
      label: '个性签名',
      children: record.bio || '-',
    },
    {
      key: 'bg_img',
      label: '背景图',
      children: (
        <PreviewImage
          src={record.bg_img}
          alt={`${record.nickname}背景图`}
          width={160}
          height={100}
          bordered
          borderColor={token.colorBorder}
          fillColor={token.colorFillAlter}
          fallback={
            <Typography.Text type="secondary">暂无背景图</Typography.Text>
          }
        />
      ),
    },
    {
      key: 'register_time',
      label: '注册时间',
      children: record.register_time,
    },
    {
      key: 'last_login',
      label: '最近登录',
      children: record.last_login,
    },
  ];
};

const detailHeader = (
  record: DetailRecord,
  token: ReturnType<typeof theme.useToken>['token'],
) => {
  return (
    <Space size={16} align="start" style={{ marginBottom: 24 }}>
      <PreviewImage
        src={record.avatar}
        alt={record.nickname}
        width={72}
        height={72}
        shape="circle"
        borderColor={token.colorBorder}
        fillColor={token.colorFillAlter}
        fallback={
          <Avatar size={72} style={{ backgroundColor: token.colorFill }}>
            {record.nickname.slice(0, 1)}
          </Avatar>
        }
      />
      <Space direction="vertical" size={4}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {record.nickname}
        </Typography.Title>
        <Typography.Text type="secondary">ID：{record.id}</Typography.Text>
        <Space size={8} wrap>
          {statusTag(record.status)}
          {roleTag(record.role)}
        </Space>
      </Space>
    </Space>
  );
};

const DetailModal = ({
  entityLabel,
  record,
  open,
  loading,
  onClose,
}: DetailProps) => {
  const { token } = theme.useToken();

  return (
    <Detail
      title={`${entityLabel}详情`}
      open={open}
      loading={loading}
      onClose={onClose}
      width={580}
      header={
        loading ? (
          <div style={{ marginBottom: 24 }}>
            <Spin />
          </div>
        ) : (
          detailHeader(record, token)
        )
      }
      items={detailItems(record, token)}
    />
  );
};

export default DetailModal;
