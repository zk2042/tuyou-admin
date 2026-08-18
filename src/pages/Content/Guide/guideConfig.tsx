import type { GuideItem } from '@/services/content/guide/types';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Image, Space, Tag, theme, Tooltip } from 'antd';
import React from 'react';

export interface GuideQuery {
  current?: number;
  pageSize?: number;
  title?: string;
  category?: string;
  difficulty?: string;
  is_slide?: string;
  sort_field?: string;
  sort_order?: string;
  begin_time?: string;
  finish_time?: string;
}

const categoryEnum = {
  徒步: { text: '徒步' },
  露营: { text: '露营' },
  骑行: { text: '骑行' },
  登山: { text: '登山' },
  跑步: { text: '跑步' },
  攀岩: { text: '攀岩' },
  溯溪: { text: '溯溪' },
};

const difficultyEnum = {
  入门: { text: '入门' },
  中等: { text: '中等' },
  中高等: { text: '中高等' },
  高等: { text: '高等' },
};

const slideEnum = {
  是: { text: '是' },
  否: { text: '否' },
};

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

interface GuideCoverProps {
  src: string;
  alt: string;
}

const GuideCover = ({ src, alt }: GuideCoverProps) => {
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

const TagList = ({ tags }: { tags: string[] | null }) => {
  if (!Array.isArray(tags) || !tags.length) {
    return '-';
  }

  return (
    <Space size={[4, 4]} wrap>
      {tags.map((item) => (
        <Tag key={item} color="blue">
          {item}
        </Tag>
      ))}
    </Space>
  );
};

interface GuideActionsProps {
  record: GuideItem;
  onDetail: (record: GuideItem) => void;
  onEdit: (record: GuideItem) => void;
  onDelete: (record: GuideItem) => void;
  deleting: boolean;
  canDetail: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const GuideActions = ({
  record,
  onDetail,
  onEdit,
  onDelete,
  deleting,
  canDetail,
  canEdit,
  canDelete,
}: GuideActionsProps) => {
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
      {canEdit && (
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{ paddingInline: 4 }}
          onClick={() => onEdit(record)}
        >
          编辑
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
  onDetail: (record: GuideItem) => void;
  onEdit: (record: GuideItem) => void;
  onDelete: (record: GuideItem) => void;
  deleting: boolean;
  canDetail: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const guideColumns = ({
  onDetail,
  onEdit,
  onDelete,
  deleting,
  canDetail,
  canEdit,
  canDelete,
}: ColsProps): ProColumns<GuideItem>[] => {
  const columns: ProColumns<GuideItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '封面',
      dataIndex: 'cover_img',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <GuideCover src={record.cover_img} alt={record.title} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 170,
      fieldProps: {
        placeholder: '请输入攻略标题',
      },
      render: (_, record) => textEllipsis(record.title, 170),
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'select',
      width: 80,
      valueEnum: categoryEnum,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <TagList tags={record.tags} />,
    },
    {
      title: '发布人',
      dataIndex: 'nickname',
      width: 110,
      hideInSearch: true,
      render: (_, record) => textEllipsis(record.nickname, 110),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      valueType: 'select',
      width: 90,
      valueEnum: difficultyEnum,
    },
    {
      title: '发布时间',
      dataIndex: 'publish_time',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '浏览量',
      dataIndex: 'view_count',
      width: 90,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '点赞',
      dataIndex: 'like_count',
      width: 80,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '收藏',
      dataIndex: 'collect_count',
      width: 80,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '评论',
      dataIndex: 'comment_count',
      width: 80,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '热度',
      dataIndex: 'heat',
      width: 80,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '是否为幻灯片',
      dataIndex: 'is_slide',
      valueType: 'select',
      valueEnum: slideEnum,
      width: 110,
      render: (_, record) => (
        <Tag color={tagColor(record.is_slide)}>{record.is_slide}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 90,
      render: (_, record) => (
        <Tag color={tagColor(record.status)}>{record.status}</Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publish_range',
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
      width: 220,
      render: (_, record) => (
        <GuideActions
          record={record}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
          canDetail={canDetail}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ),
    },
  ];

  return canDetail || canEdit || canDelete
    ? columns
    : columns.filter((item) => item.key !== 'option');
};
