import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import { getMe } from '@/services/auth';
import {
  createRole,
  deleteRole,
  editRole,
  queryRole,
} from '@/services/authority/role';
import { setUser } from '@/utils/auth';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import AssignModal from './components/AssignModal';
import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import {
  roleColumns,
  type CreateValues,
  type EditValues,
  type RoleQueryParams,
  type RoleRecord,
} from './roleConfig';

const roleRequest = async (params: RoleQueryParams) => {
  try {
    const response = await queryRole({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      role_name: params.role_name,
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

const RolePage: React.FC = () => {
  const access = useAccess();
  const { initialState, setInitialState } = useModel('@@initialState');
  const canList = access.hasPerm('role:list');
  const canLoadMenus = access.hasPerm('role:menu:list');
  const canLoadPermissions = access.hasPerm('role:permission:list');
  const canSavePermissions = access.hasPerm('role:permission:assign');
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<RoleRecord>();
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRecord, setAssignRecord] = useState<RoleRecord>();
  const { confirmDelete } = useRowDelete<RoleRecord>({
    entityLabel: '角色',
    getName: (record) => record.role_name,
    getDesc: (record) =>
      `${record.role_name}（${record.role_code}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteRole(record.id);
    },
    onSuccess: async (record) => {
      if (editRecord?.id === record.id) {
        setEditOpen(false);
        setEditRecord(undefined);
        setEditing(false);
      }

      actionRef.current?.reload();
    },
  });
  const columns = useMemo(() => {
    return roleColumns({
      canEdit: access.hasPerm('role:edit'),
      canAssign: canLoadMenus && canLoadPermissions && canSavePermissions,
      canDelete: access.hasPerm('role:delete'),
      onEdit: (record) => {
        setEditRecord(record);
        setEditOpen(true);
      },
      onAssign: (record) => {
        setAssignRecord(record);
        setAssignOpen(true);
      },
      onDelete: (record) => {
        confirmDelete(record);
      },
    });
  }, [
    access,
    canLoadMenus,
    canLoadPermissions,
    canSavePermissions,
    confirmDelete,
  ]);

  const refreshAuth = React.useCallback(async () => {
    const response = await getMe();
    if (!response.data) {
      return;
    }

    const menuChanged =
      JSON.stringify(initialState?.menu_tree ?? []) !==
      JSON.stringify(response.data.menu_tree);
    setUser(response.data);
    await setInitialState(response.data);

    if (menuChanged) {
      window.location.replace('/');
    }
  }, [initialState?.menu_tree, setInitialState]);

  const closeCreate = React.useCallback(() => {
    setCreateOpen(false);
    setCreating(false);
  }, []);

  const closeEdit = React.useCallback(() => {
    setEditOpen(false);
    setEditing(false);
    setEditRecord(undefined);
  }, []);

  const submitCreate = React.useCallback(async (values: CreateValues) => {
    setCreating(true);

    try {
      const response = await createRole(values);
      message.success(response.message || '新增角色成功');
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
        const response = await editRole(editRecord.id, values);
        message.success(response.message || '编辑角色成功');
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

  return (
    <>
      <ListPage<RoleRecord, RoleQueryParams>
        accessible={canList}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="角色列表"
        columns={columns}
        request={roleRequest}
        options={false}
        search={{
          defaultCollapsed: true,
          span: 8,
        }}
        toolbarActions={
          access.hasPerm('role:create')
            ? [
                <Button
                  key="create"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCreateOpen(true);
                  }}
                >
                  新增角色
                </Button>,
              ]
            : []
        }
      />
      <CreateModal
        open={createOpen}
        saving={creating}
        onCancel={closeCreate}
        onSubmit={(values) => {
          void submitCreate(values);
        }}
      />
      <EditModal
        open={editOpen}
        saving={editing}
        record={editRecord}
        onCancel={closeEdit}
        onSubmit={(values) => {
          void submitEdit(values);
        }}
      />
      <AssignModal
        open={assignOpen}
        roleId={assignRecord?.id}
        roleName={assignRecord?.role_name}
        canLoadMenus={canLoadMenus}
        canLoadPermissions={canLoadPermissions}
        canSave={canSavePermissions}
        onCancel={() => {
          setAssignOpen(false);
          setAssignRecord(undefined);
        }}
        onSaved={() => {
          setAssignOpen(false);
          setAssignRecord(undefined);
          void refreshAuth();
        }}
      />
    </>
  );
};

export default RolePage;
