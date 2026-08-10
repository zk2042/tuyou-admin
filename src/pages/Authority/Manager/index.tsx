import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  createManager,
  deleteManager,
  editManager,
  getRoleNames,
  queryManager,
  resetManagerPassword,
} from '@/services/authority/manager';
import type {
  ManagerResetPassword,
  RoleName,
} from '@/services/authority/manager/types';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import {
  managerColumns,
  type CreateValues,
  type EditValues,
  type ManagerQueryParams,
  type ManagerRecord,
} from './managerConfig';

const managerRequest = async (params: ManagerQueryParams) => {
  try {
    const response = await queryManager({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      username: params.username,
      role: params.role,
      status: params.status,
    });
    const pageData = response.data;

    return {
      data: pageData?.list ?? [],
      success: response.code === API_RESPONSE_SUCCESS_CODE,
      total: pageData?.total ?? 0,
    };
  } catch {
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};

const ManagerPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<ManagerRecord>();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetRecord, setResetRecord] = useState<ManagerRecord>();
  const [roles, setRoles] = useState<RoleName[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const roleLoaded = useRef(false);
  const roleFetching = useRef(false);
  const { confirmDelete } = useRowDelete<ManagerRecord>({
    entityLabel: '管理员',
    getName: (record) => record.username,
    getDesc: (record) => `${record.username}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteManager(record.id);
    },
    onSuccess: async (record) => {
      if (editRecord?.id === record.id) {
        setEditOpen(false);
        setEditRecord(undefined);
        setEditing(false);
      }

      if (resetRecord?.id === record.id) {
        setResetOpen(false);
        setResetRecord(undefined);
        setResetting(false);
      }

      actionRef.current?.reload();
    },
  });

  const loadRoles = React.useCallback(async () => {
    if (roleFetching.current || roleLoaded.current) {
      return;
    }

    roleFetching.current = true;
    setRoleLoading(true);
    try {
      const response = await getRoleNames();
      setRoles(response.data ?? []);
      roleLoaded.current = true;
    } catch {
      message.error('获取角色名称失败');
    } finally {
      roleFetching.current = false;
      setRoleLoading(false);
    }
  }, []);

  const roleOptions = useMemo(
    () =>
      roles.map((item) => ({
        label: item.role_name,
        value: item.role_name,
      })),
    [roles],
  );

  const onRoleOpen = React.useCallback(
    (open: boolean) => {
      if (open) {
        void loadRoles();
      }
    },
    [loadRoles],
  );

  const columns = useMemo(
    () =>
      managerColumns({
        roleOptions,
        roleLoading,
        onRoleOpen,
        onEdit: (record) => {
          setEditRecord(record);
          setEditOpen(true);
        },
        onResetPassword: (record) => {
          setResetRecord(record);
          setResetOpen(true);
        },
        onDelete: (record) => {
          confirmDelete(record);
        },
      }),
    [confirmDelete, onRoleOpen, roleLoading, roleOptions],
  );

  const closeCreate = React.useCallback(() => {
    setCreateOpen(false);
    setCreating(false);
  }, []);

  const closeEdit = React.useCallback(() => {
    setEditOpen(false);
    setEditing(false);
    setEditRecord(undefined);
  }, []);

  const closeReset = React.useCallback(() => {
    setResetOpen(false);
    setResetting(false);
    setResetRecord(undefined);
  }, []);

  const submitCreate = React.useCallback(async (values: CreateValues) => {
    setCreating(true);

    try {
      const response = await createManager(values);
      message.success(response.message || '新增管理员成功');
      setCreateOpen(false);
      actionRef.current?.reload();
    } catch {
      return;
    } finally {
      setCreating(false);
    }
  }, []);

  const submitEdit = React.useCallback(
    async (values: EditValues) => {
      if (!editRecord) {
        return;
      }

      setEditing(true);

      try {
        const response = await editManager(editRecord.id, values);
        message.success(response.message || '编辑管理员成功');
        setEditOpen(false);
        setEditRecord(undefined);
        actionRef.current?.reload();
      } catch {
        return;
      } finally {
        setEditing(false);
      }
    },
    [editRecord],
  );

  const submitResetPassword = React.useCallback(
    async (values: ManagerResetPassword) => {
      if (!resetRecord) {
        return;
      }

      setResetting(true);

      try {
        const response = await resetManagerPassword(resetRecord.id, values);
        message.success(response.message || '重置密码成功');
        setResetOpen(false);
        setResetRecord(undefined);
      } catch {
        return;
      } finally {
        setResetting(false);
      }
    },
    [resetRecord],
  );

  return (
    <>
      <ListPage<ManagerRecord, ManagerQueryParams>
        actionRef={actionRef}
        rowKey="id"
        headerTitle="管理员列表"
        columns={columns}
        request={managerRequest}
        options={false}
        search={{
          defaultCollapsed: true,
          span: 8,
        }}
        toolbarActions={[
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCreateOpen(true);
            }}
          >
            新增管理员
          </Button>,
        ]}
      />
      <CreateModal
        open={createOpen}
        saving={creating}
        roleOptions={roleOptions}
        roleLoading={roleLoading}
        onRoleOpen={onRoleOpen}
        onCancel={closeCreate}
        onSubmit={(values) => {
          void submitCreate(values);
        }}
      />
      <EditModal
        open={editOpen}
        saving={editing}
        roleOptions={roleOptions}
        roleLoading={roleLoading}
        onRoleOpen={onRoleOpen}
        record={editRecord}
        values={{
          username: editRecord?.username || '',
          adminname: editRecord?.adminname || '',
          role: editRecord?.role || '',
          status: editRecord?.status ?? '启用',
        }}
        onCancel={closeEdit}
        onSubmit={(values) => {
          void submitEdit(values);
        }}
      />
      <ResetPasswordModal
        open={resetOpen}
        saving={resetting}
        username={resetRecord?.username}
        onCancel={closeReset}
        onSubmit={(values) => {
          void submitResetPassword(values);
        }}
      />
    </>
  );
};

export default ManagerPage;
