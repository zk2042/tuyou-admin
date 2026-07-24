import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Avatar, Button, message, Modal, Space, Tag, theme } from 'antd';
import type { Dayjs } from 'dayjs';

type DateValue = string | Dayjs;

export type RangeValue = [DateValue, DateValue];

export type UserStatus = 'enabled' | 'disabled';

export interface UserQuery {
  id?: string;
  nickname?: string;
  mobile?: string;
  registeredAt?: RangeValue;
  current?: number;
  pageSize?: number;
}

export interface UserRecord {
  id: string;
  avatar: string;
  nickname: string;
  mobile: string;
  status: UserStatus;
  signature: string;
  role: string;
  registeredAt: string;
  lastLogin: string;
}

const statusMap: Record<
  UserStatus,
  { color: 'success' | 'error'; text: string }
> = {
  enabled: {
    color: 'success',
    text: '正常',
  },
  disabled: {
    color: 'error',
    text: '禁用',
  },
};

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
    registeredAtStart: formatDateValue(start),
    registeredAtEnd: formatDateValue(end),
  };
};

export const userAvatar = (
  _: unknown,
  record: Pick<UserRecord, 'avatar' | 'nickname'>,
) => {
  return <Avatar src={record.avatar} alt={record.nickname} />;
};

export const statusTag = (status: UserStatus) => {
  const current = statusMap[status];

  return <Tag color={current.color}>{current.text}</Tag>;
};

export const roleTag = (role: string) => {
  const color = role === '领队' ? 'warning' : 'processing';

  return <Tag color={color}>{role}</Tag>;
};

interface RowActionsProps {
  entityLabel: string;
  record: Pick<UserRecord, 'id' | 'nickname'>;
}

const RowActions = ({ entityLabel, record }: RowActionsProps) => {
  const { token } = theme.useToken();

  return (
    <Space size={0}>
      <Button
        type="link"
        icon={<EyeOutlined />}
        style={{ color: token.colorInfo, paddingInline: 8 }}
        onClick={() => {
          message.info(
            `查看${entityLabel} ${record.nickname}（${record.id}）详情`,
          );
        }}
      >
        详情
      </Button>
      <Button
        type="link"
        icon={<EditOutlined />}
        style={{ paddingInline: 8 }}
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
        style={{ paddingInline: 8 }}
        onClick={() => {
          Modal.confirm({
            title: `确认删除该${entityLabel}吗？`,
            content: `${record.nickname}（${record.id}）删除后将无法恢复。`,
            okText: '确认',
            cancelText: '取消',
            okButtonProps: {
              danger: true,
            },
            onOk: () => {
              message.success(`已删除${entityLabel} ${record.nickname}`);
            },
          });
        }}
      >
        删除
      </Button>
    </Space>
  );
};

export const tableActions = (
  entityLabel: string,
  record: Pick<UserRecord, 'id' | 'nickname'>,
) => {
  return <RowActions entityLabel={entityLabel} record={record} />;
};

interface BatchOptions {
  entityLabel: string;
  selectedCount: number;
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

const exportMessage = (entityLabel: string) => {
  message.success(`已触发${entityLabel}列表导出，请稍后查看导出结果`);
};

export const batchActions = ({ entityLabel, selectedCount }: BatchOptions) => {
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
    <Button
      key="batch-delete"
      danger
      disabled={!selectedCount}
      onClick={() => {
        batchMessage('批量删除', entityLabel, selectedCount);
      }}
    >
      批量删除
    </Button>,
    <Button
      key="export"
      type="primary"
      icon={<ExportOutlined />}
      onClick={() => {
        exportMessage(entityLabel);
      }}
    >
      导出
    </Button>,
  ];
};
