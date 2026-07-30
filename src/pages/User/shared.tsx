import type { ApiResponse } from '@/constants';
import { useExportExcel } from '@/hooks/table/useExportExcel';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import DetailModal from '@/pages/User/components/DetailModal';
import EditModal from '@/pages/User/components/EditModal';
import { message } from '@/utils/message';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  Grid,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  theme,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

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
  id: string;
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

export type BatchRow = Pick<UserRecord, 'id' | 'nickname' | 'status'>;

export type RoleText = '普通会员' | '领队';

export interface EditData {
  status?: boolean;
  role?: RoleText;
}

export type EditVals = {
  status: boolean;
  roleFlag: boolean;
};

type EditSrc = Pick<UserRecord, 'status' | 'role'>;

const statusOn = (status?: string) => status === '正常';

const roleOn = (role?: string) => role === '领队';

export const editVals = (data: EditSrc): EditVals => {
  return {
    status: statusOn(data.status),
    roleFlag: roleOn(data.role),
  };
};

export const editData = (
  data: EditVals,
  off: RoleText = '普通会员',
): EditData => {
  return {
    status: data.status,
    role: data.roleFlag ? '领队' : off,
  };
};

export type DetailRecord = UserRecord & {
  lead_count?: number;
};

export type DetailLoad = (
  id: string,
) => Promise<DetailRecord | null | undefined>;

export type EditSave = (
  id: string,
  data: EditData,
) => Promise<ApiResponse<DetailRecord>>;

export type DelRun = (id: string) => Promise<ApiResponse<null>>;
export type BatchDel = (ids: string[]) => Promise<ApiResponse<null>>;
export type BatchStatus = (
  ids: string[],
  status: boolean,
) => Promise<ApiResponse<null>>;

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

const cardStyle = {
  padding: 20,
  border: '1px solid #f0f0f0',
  borderRadius: 12,
  background: '#fafafa',
};

const switchTheme = {
  components: {
    Switch: {
      handleSize: 22,
      trackHeight: 30,
      innerMaxMargin: 30,
      innerMinMargin: 12,
      trackMinWidth: 68,
      trackPadding: 4,
    },
  },
} as const;

interface RowProps {
  entityLabel: string;
  loadDetail: DetailLoad;
  editSave?: EditSave;
  delRun?: DelRun;
  onEdited?: () => void;
  record: DetailRecord;
}

const RowActions = ({
  entityLabel,
  loadDetail,
  editSave,
  delRun,
  onEdited,
  record,
}: RowProps) => {
  const { token } = theme.useToken();
  const [detailData, setDetailData] = useState<DetailRecord>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editFetching, setEditFetching] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const { deleting, confirmDelete } = useRowDelete<DetailRecord>({
    entityLabel,
    getName: (current) => current.nickname,
    getDesc: (current) =>
      `${current.nickname}（${current.id}）删除后将无法恢复。`,
    request: async (current) => {
      await delRun?.(current.id);
    },
    onSuccess: () => onEdited?.(),
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

  const openEdit = async () => {
    setEditOpen(true);
    setEditFetching(true);

    try {
      const current = await loadDetail(record.id);
      setDetailData(current ?? record);
    } finally {
      setEditFetching(false);
    }
  };

  const submitEdit = async (values: EditVals) => {
    if (!editSave) {
      return;
    }

    setEditLoading(true);

    try {
      const response = await editSave(record.id, editData(values));

      if (response.data) {
        setDetailData(response.data);
      }

      message.success(
        response.message || `已更新${entityLabel} ${record.nickname}`,
      );
      setEditOpen(false);
      onEdited?.();
    } finally {
      setEditLoading(false);
    }
  };

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
          onClick={() => void openEdit()}
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
      <DetailModal
        entityLabel={entityLabel}
        record={currentDetail}
        open={detailOpen}
        loading={detailLoading && !detailData}
        onClose={() => {
          setDetailOpen(false);
          setDetailData(undefined);
        }}
      />
      <EditModal
        entityLabel={entityLabel}
        roleText="普通会员"
        record={currentDetail}
        values={editVals(currentDetail)}
        open={editOpen}
        loading={editFetching}
        saving={editLoading}
        onCancel={() => {
          setEditOpen(false);
        }}
        onSubmit={(values) => {
          void submitEdit(values);
        }}
      />
    </>
  );
};

export const tableActions = (
  entityLabel: string,
  loadDetail: DetailLoad,
  editSave: EditSave | undefined,
  delRun: DelRun | undefined,
  onEdited: (() => void) | undefined,
  record: DetailRecord,
) => {
  return (
    <RowActions
      entityLabel={entityLabel}
      loadDetail={loadDetail}
      editSave={editSave}
      delRun={delRun}
      onEdited={onEdited}
      record={record}
    />
  );
};

interface BatchOptions {
  entityLabel: string;
  selectedKeys: string[];
  selectedRows: BatchRow[];
  statusRun?: BatchStatus;
  onStatused?: () => void;
  delRun?: BatchDel;
  onDeleted?: () => void;
  exportRequest: () => Promise<Blob>;
}

interface StatusBtnProps {
  entityLabel: string;
  selectedKeys: string[];
  selectedRows: BatchRow[];
  statusRun?: BatchStatus;
  onStatused?: () => void;
}

const BatchStatusButton = ({
  entityLabel,
  selectedKeys,
  selectedRows,
  statusRun,
  onStatused,
}: StatusBtnProps) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(true);
  const selectedCount = selectedKeys.length;
  const nextText = status ? '正常' : '禁用';

  useEffect(() => {
    if (!open) {
      return;
    }

    setStatus(selectedRows.every((row) => statusOn(row.status)));
  }, [open, selectedRows]);

  const batchStatus = async () => {
    if (!selectedCount) {
      message.warning(`请先选择要批量修改状态的${entityLabel}`);
      return;
    }

    if (!statusRun) {
      return;
    }

    setUpdating(true);

    try {
      const response = await statusRun(selectedKeys, status);

      setOpen(false);
      await onStatused?.();
      message.success(
        response.message ||
          `已将 ${selectedCount} 个${entityLabel}设为${nextText}`,
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Button
        disabled={!selectedCount}
        loading={updating}
        onClick={() => {
          if (!selectedCount) {
            message.warning(`请先选择要批量修改状态的${entityLabel}`);
            return;
          }

          setOpen(true);
        }}
      >
        批量修改状态
      </Button>
      <Modal
        title={`批量修改${entityLabel}状态`}
        open={open}
        destroyOnHidden
        confirmLoading={updating}
        okText="确认修改"
        cancelText="取消"
        width={620}
        onCancel={() => {
          if (!updating) {
            setOpen(false);
          }
        }}
        onOk={() => {
          void batchStatus();
        }}
      >
        <Divider style={{ margin: '0 0 24px' }} />
        <ConfigProvider theme={switchTheme}>
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <Switch
              checked={status}
              checkedChildren="正常"
              unCheckedChildren="禁用"
              disabled={updating}
              onChange={setStatus}
            />
            <Typography.Paragraph
              type="secondary"
              style={{ marginTop: 16, marginBottom: 0 }}
            >
              {`已选择 ${selectedCount} 个${entityLabel}，保存后状态将统一改为${nextText}。`}
            </Typography.Paragraph>
          </div>
        </ConfigProvider>
        <Table<BatchRow>
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={selectedRows}
          scroll={{ y: 320 }}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              width: 160,
            },
            {
              title: '昵称',
              dataIndex: 'nickname',
            },
          ]}
        />
      </Modal>
    </>
  );
};

interface DelBtnProps {
  entityLabel: string;
  selectedKeys: string[];
  selectedRows: BatchRow[];
  delRun?: BatchDel;
  onDeleted?: () => void;
}

const BatchDeleteButton = ({
  entityLabel,
  selectedKeys,
  selectedRows,
  delRun,
  onDeleted,
}: DelBtnProps) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const selectedCount = selectedKeys.length;

  const batchDelete = async () => {
    if (!selectedCount) {
      message.warning(`请先选择要批量删除的${entityLabel}`);
      return;
    }

    if (!delRun) {
      return;
    }

    setDeleting(true);

    try {
      const response = await delRun(selectedKeys);

      setOpen(false);
      await onDeleted?.();
      message.success(
        response.message || `已删除 ${selectedCount} 个${entityLabel}`,
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        danger
        disabled={!selectedCount}
        loading={deleting}
        onClick={() => {
          if (!selectedCount) {
            message.warning(`请先选择要批量删除的${entityLabel}`);
            return;
          }

          setOpen(true);
        }}
      >
        批量删除
      </Button>
      <Modal
        title={`批量删除${entityLabel}`}
        open={open}
        destroyOnHidden
        confirmLoading={deleting}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        width={560}
        onCancel={() => {
          if (!deleting) {
            setOpen(false);
          }
        }}
        onOk={() => {
          void batchDelete();
        }}
      >
        <Divider style={{ margin: '0 0 20px' }} />
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {`已选择 ${selectedCount} 个${entityLabel}，删除后将无法恢复。`}
        </Typography.Paragraph>
        <Table<BatchRow>
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={selectedRows}
          scroll={{ y: 320 }}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              width: 160,
            },
            {
              title: '昵称',
              dataIndex: 'nickname',
            },
          ]}
        />
      </Modal>
    </>
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
  selectedKeys,
  selectedRows,
  statusRun,
  onStatused,
  delRun,
  onDeleted,
  exportRequest,
}: BatchOptions) => {
  return [
    <BatchStatusButton
      key="batch-status"
      entityLabel={entityLabel}
      selectedKeys={selectedKeys}
      selectedRows={selectedRows}
      statusRun={statusRun}
      onStatused={onStatused}
    />,
    <BatchDeleteButton
      key="batch-delete"
      entityLabel={entityLabel}
      selectedKeys={selectedKeys}
      selectedRows={selectedRows}
      delRun={delRun}
      onDeleted={onDeleted}
    />,
    <ExportButton
      key="export"
      entityLabel={entityLabel}
      exportRequest={exportRequest}
    />,
  ];
};
