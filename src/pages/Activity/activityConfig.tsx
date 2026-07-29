import type { ActivityItem as ActItem } from '@/services/activity/types';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Image, Space, Tag, theme, Tooltip } from 'antd';
import React from 'react';

export interface ActQuery {
  current?: number;
  pageSize?: number;
  title?: string;
  leader_name?: string;
  activity_type?: string;
  difficulty?: string;
  fee?: string;
  activity_status?: string;
  is_slide?: string;
  begin_time?: string;
  finish_time?: string;
}

const levelEnum = {
  全部: { text: '全部' },
  入门: { text: '入门' },
  中等: { text: '中等' },
  中高等: { text: '中高等' },
  高等: { text: '高等' },
};

const actStatusEnum = {
  全部: { text: '全部' },
  报名中: { text: '报名中' },
  进行中: { text: '进行中' },
  已结束: { text: '已结束' },
};

const categoryEnum = {
  全部: { text: '全部' },
  徒步: { text: '徒步' },
  登山: { text: '登山' },
  骑行: { text: '骑行' },
  露营: { text: '露营' },
  跑步: { text: '跑步' },
  攀岩: { text: '攀岩' },
  溯溪: { text: '溯溪' },
};

const feeEnum = {
  全部: { text: '全部' },
  免费: { text: '免费' },
  收费: { text: '收费' },
};

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

interface ActActionsProps {
  record: ActItem;
  onDetail: (record: ActItem) => void;
  onEdit: (record: ActItem) => void;
  onDelete: (record: ActItem) => void;
  deleting: boolean;
}

interface ActCoverProps {
  src: string;
  alt: string;
}

const ActCover = ({ src, alt }: ActCoverProps) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      width={60}
      height={40}
      preview={{
        mask: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
            }}
          >
            <EyeOutlined />
            预览
          </div>
        ),
      }}
      wrapperStyle={{
        display: 'inline-block',
        overflow: 'hidden',
        border: '1px dashed #d9d9d9',
        borderRadius: 8,
        padding: 2,
      }}
      style={{
        display: 'block',
        objectFit: 'cover',
        borderRadius: 6,
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    />
  );
};

const ActActions = ({
  record,
  onDetail,
  onEdit,
  onDelete,
  deleting,
}: ActActionsProps) => {
  const { token } = theme.useToken();

  return (
    <Space size={0}>
      <Button
        type="link"
        icon={<EyeOutlined />}
        style={{ color: token.colorInfo, paddingInline: 4 }}
        onClick={() => onDetail(record)}
      >
        详情
      </Button>
      <Button
        type="link"
        icon={<EditOutlined />}
        style={{ paddingInline: 4 }}
        disabled={record.is_del === '已删除'}
        onClick={() => onEdit(record)}
      >
        编辑
      </Button>
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
    </Space>
  );
};

interface ColsProps {
  onDetail: (record: ActItem) => void;
  onEdit: (record: ActItem) => void;
  onDelete: (record: ActItem) => void;
  deleting: boolean;
}

export const activityColumns = ({
  onDetail,
  onEdit,
  onDelete,
  deleting,
}: ColsProps): ProColumns<ActItem>[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '活动封面',
      dataIndex: 'cover_img',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <ActCover src={record.cover_img} alt={record.title} />
      ),
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      width: 130,
      fieldProps: {
        placeholder: '请输入活动名称',
      },
      render: (_, record) => textEllipsis(record.title, 130),
    },
    {
      title: '发起人',
      dataIndex: 'leader_name',
      width: 100,
      fieldProps: {
        placeholder: '请输入发起人',
      },
      render: (_, record) => textEllipsis(record.leader_name, 100),
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status',
      valueType: 'select',
      initialValue: '全部',
      valueEnum: actStatusEnum,
      width: 70,
      render: (_, record) => (
        <Tag color={tagColor(record.activity_status)}>
          {record.activity_status}
        </Tag>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      valueType: 'select',
      width: 70,
      initialValue: '全部',
      valueEnum: levelEnum,
    },
    {
      title: '类型',
      dataIndex: 'activity_type',
      valueType: 'select',
      initialValue: '全部',
      width: 80,
      valueEnum: categoryEnum,
    },
    {
      title: '开始日期',
      dataIndex: 'start_time',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '结束日期',
      dataIndex: 'end_time',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '费用',
      dataIndex: 'price',
      width: 80,
      hideInSearch: true,
      render: (_, record) =>
        typeof record.price === 'number'
          ? `¥${record.price.toLocaleString('zh-CN')}`
          : '-',
    },
    {
      title: '费用类型',
      dataIndex: 'fee',
      valueType: 'select',
      hideInTable: true,
      initialValue: '全部',
      valueEnum: feeEnum,
    },
    {
      title: '是否为幻灯片',
      dataIndex: 'is_slide',
      valueType: 'select',
      initialValue: '全部',
      valueEnum: {
        全部: { text: '全部' },
        是: { text: '是' },
        否: { text: '否' },
      },
      width: 100,
      render: (_, record) => (
        <Tag color={tagColor(record.is_slide)}>{record.is_slide}</Tag>
      ),
    },
    {
      title: '已报名/上限',
      dataIndex: 'current_people',
      width: 90,
      hideInSearch: true,
      render: (_, record) => `${record.current_people}/${record.max_people}`,
    },
    {
      title: '状态',
      dataIndex: 'is_del',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={tagColor(record.is_del)}>{record.is_del}</Tag>
      ),
    },
    {
      title: '开始日期',
      dataIndex: 'create_range',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['请选择', '请选择'],
      },
      search: {
        transform: createRange,
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 220,
      render: (_, record) => (
        <ActActions
          record={record}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
        />
      ),
    },
  ];
};
