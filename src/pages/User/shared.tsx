import Detail from '@/components/Detail';
import { useBatchDelete } from '@/hooks/table/useBatchDelete';
import { useExportExcel } from '@/hooks/table/useExportExcel';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import {
  Avatar,
  Button,
  Grid,
  Image,
  message,
  Space,
  Spin,
  Tag,
  theme,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';

type DateValue = string | Dayjs;

export type RangeValue = [DateValue, DateValue];

export interface UserQuery {
  id?: string;
  nickname?: string;
  phone?: string;
  register_start?: string;
  register_end?: string;
  current?: number;
  pageSize?: number;
}

export interface UserRecord {
  id: string | number;
  avatar: string;
  cover?: string;
  cover_style?: string;
  nickname: string;
  phone: string;
  status: string;
  bio: string;
  role: string;
  register_time: string;
  last_login: string;
}

export type DetailRecord = UserRecord & {
  lead_count?: number;
};

export type DetailLoad = (
  id: string | number,
) => Promise<DetailRecord | null | undefined>;

const formatDateValue = (value: DateValue) => {
  if (typeof value === 'string') {
    return value;
  }

  return value.format('YYYY-MM-DD');
};

export const dateRange = (range?: RangeValue) => {
  if (!range || range.length !== 2) {
    return {};
  }

  const [start, end] = range;

  return {
    register_start: formatDateValue(start),
    register_end: formatDateValue(end),
  };
};

export const userAvatar = (
  _: unknown,
  record: Pick<UserRecord, 'avatar' | 'nickname'>,
) => {
  return <Avatar src={record.avatar} alt={record.nickname} />;
};

export const statusTag = (status: string) => {
  const color = status === '正常' ? 'success' : 'error';

  return <Tag color={color}>{status}</Tag>;
};

export const roleTag = (role: string) => {
  const color = role === '领队' ? 'warning' : 'processing';

  return <Tag color={color}>{role}</Tag>;
};

type ScreenMap = ReturnType<typeof Grid.useBreakpoint>;

export const getBioWidth = (screens: ScreenMap) => {
  if (screens.xxl) {
    return 280;
  }

  if (screens.xl) {
    return 220;
  }

  if (screens.lg) {
    return 200;
  }

  if (screens.md) {
    return 160;
  }

  return 130;
};

export const textEllipsis = (text?: ReactNode, width = 220) => {
  return (
    <Typography.Text
      ellipsis={{ tooltip: typeof text === 'string' ? text : undefined }}
      style={{ width, display: 'block' }}
    >
      {text || '-'}
    </Typography.Text>
  );
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
    ...(typeof record.lead_count === 'number'
      ? [
          {
            key: 'lead_count',
            label: '带队次数',
            children: `${record.lead_count}`,
          },
        ]
      : []),
    {
      key: 'bio',
      label: '个性签名',
      children: record.bio || '-',
    },
    {
      key: 'cover',
      label: '封面图',
      children: (
        <PreviewImage
          src={record.cover}
          alt={`${record.nickname}封面图`}
          width={160}
          height={100}
          bordered
          borderColor={token.colorBorder}
          fillColor={token.colorFillAlter}
          fallback={
            <Typography.Text type="secondary">暂无封面图</Typography.Text>
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

interface RowProps {
  entityLabel: string;
  loadDetail: DetailLoad;
  record: DetailRecord;
}

const RowActions = ({ entityLabel, loadDetail, record }: RowProps) => {
  const { token } = theme.useToken();
  const [detailData, setDetailData] = useState<DetailRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const { deleting, confirmDelete } = useRowDelete<DetailRecord>({
    entityLabel,
    getName: (current) => current.nickname,
    getDesc: (current) =>
      `${current.nickname}（${current.id}）删除后将无法恢复。`,
  });

  const openDetail = async () => {
    setDetailOpen(true);
    setDetailLoading(true);

    try {
      const current = await loadDetail(record.id);
      setDetailData(current ?? record);
    } finally {
      setDetailLoading(false);
    }
  };

  const currentDetail = detailData ?? record;

  return (
    <>
      <Space size={0}>
        <Button
          type="link"
          icon={<EyeOutlined />}
          style={{ color: token.colorInfo, paddingInline: 4 }}
          onClick={() => void openDetail()}
        >
          详情
        </Button>
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{ paddingInline: 4 }}
          onClick={() => {
            message.success(`进入${entityLabel} ${record.nickname} 的编辑流程`);
          }}
        >
          编辑
        </Button>
        <Button
          danger
          type="link"
          icon={<DeleteOutlined />}
          style={{ paddingInline: 4 }}
          loading={deleting}
          onClick={() => {
            confirmDelete(record);
          }}
        >
          删除
        </Button>
      </Space>
      <Detail
        title={`${entityLabel}详情`}
        open={detailOpen}
        loading={detailLoading}
        onClose={() => {
          setDetailOpen(false);
          setDetailData(undefined);
        }}
        width={580}
        header={
          detailLoading && !detailData ? (
            <div style={{ marginBottom: 24 }}>
              <Spin />
            </div>
          ) : (
            detailHeader(currentDetail, token)
          )
        }
        items={detailItems(currentDetail, token)}
      />
    </>
  );
};

export const tableActions = (
  entityLabel: string,
  loadDetail: DetailLoad,
  record: DetailRecord,
) => {
  return (
    <RowActions
      entityLabel={entityLabel}
      loadDetail={loadDetail}
      record={record}
    />
  );
};

interface BatchOptions {
  entityLabel: string;
  selectedCount: number;
  exportRequest: () => Promise<Blob>;
}

const batchMessage = (
  actionLabel: string,
  entityLabel: string,
  selectedCount: number,
) => {
  if (!selectedCount) {
    message.warning(`请先选择要${actionLabel}的${entityLabel}`);
    return;
  }

  message.success(
    `已触发 ${selectedCount} 个${entityLabel}的${actionLabel}操作`,
  );
};

interface DelBtnProps {
  entityLabel: string;
  selectedCount: number;
}

const BatchDeleteButton = ({ entityLabel, selectedCount }: DelBtnProps) => {
  const { deleting, batchDelete } = useBatchDelete({
    entityLabel,
    getCount: () => selectedCount,
  });

  return (
    <Button
      danger
      disabled={!selectedCount}
      loading={deleting}
      onClick={() => {
        batchDelete();
      }}
    >
      批量删除
    </Button>
  );
};

interface ExportProps {
  entityLabel: string;
  exportRequest: () => Promise<Blob>;
}

const ExportButton = ({ entityLabel, exportRequest }: ExportProps) => {
  const { exporting, runExport } = useExportExcel({
    request: exportRequest,
    successText: `${entityLabel}列表导出成功`,
  });

  return (
    <Button
      type="primary"
      icon={<ExportOutlined />}
      loading={exporting}
      onClick={() => {
        void runExport();
      }}
    >
      导出
    </Button>
  );
};

export const batchActions = ({
  entityLabel,
  selectedCount,
  exportRequest,
}: BatchOptions) => {
  return [
    <Button
      key="batch-status"
      disabled={!selectedCount}
      onClick={() => {
        batchMessage('批量修改状态', entityLabel, selectedCount);
      }}
    >
      批量修改状态
    </Button>,
    <BatchDeleteButton
      key="batch-delete"
      entityLabel={entityLabel}
      selectedCount={selectedCount}
    />,
    <ExportButton
      key="export"
      entityLabel={entityLabel}
      exportRequest={exportRequest}
    />,
  ];
};
