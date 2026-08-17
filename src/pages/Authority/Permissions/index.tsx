import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import { getMe } from '@/services/auth';
import {
  createPerm,
  deletePerm,
  editPerm,
  getPermModules,
  queryPerm,
} from '@/services/authority/permissions';
import type { PermModule } from '@/services/authority/permissions/types';
import { setUser } from '@/utils/auth';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import {
  permissionsColumns,
  type PermQueryParams,
  type PermRecord,
  type PermValues,
} from './permissionsConfig';

const PermissionsPage: React.FC = () => {
  const access = useAccess();
  const { setInitialState } = useModel('@@initialState');
  const canList = access.hasPerm('permission:list');
  const canLoadModules = access.hasPerm('permission:module:list');
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<PermRecord>();
  const [modules, setModules] = useState<PermModule[]>([]);
  const [moduleLoading, setModuleLoading] = useState(false);
  const permissionsRequest = React.useCallback(
    async (params: PermQueryParams) => {
      try {
        const [response, meResponse] = await Promise.all([
          queryPerm({
            page: params.current ?? 1,
            size: params.pageSize ?? PAGE_SIZE,
            perm_name: params.perm_name,
            module: params.module,
            status: params.status,
          }),
          getMe(),
        ]);
        const pageData = response.data;

        if (meResponse.data) {
          setUser(meResponse.data);
          await setInitialState(meResponse.data);
        }

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
    },
    [setInitialState],
  );
  const loadModules = React.useCallback(async () => {
    if (!canLoadModules) {
      setModules([]);
      return;
    }

    setModuleLoading(true);
    try {
      const response = await getPermModules();
      setModules(response.data ?? []);
    } catch {
      setModules([]);
    } finally {
      setModuleLoading(false);
    }
  }, [canLoadModules]);
  const moduleOptions = useMemo(
    () =>
      modules.map((item) => ({
        label: item.name,
        value: item.name,
      })),
    [modules],
  );
  const { confirmDelete } = useRowDelete<PermRecord>({
    entityLabel: 'API 权限',
    getName: (record) => record.perm_name,
    getDesc: (record) =>
      `${record.perm_name}（${record.perm_key}）删除后将无法恢复。`,
    request: async (record) => {
      await deletePerm(record.id);
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
  const columns = useMemo(
    () =>
      permissionsColumns({
        canEdit: access.hasPerm('permission:edit'),
        canDelete: access.hasPerm('permission:delete'),
        onEdit: (record) => {
          setEditRecord(record);
          setEditOpen(true);
        },
        onDelete: (record) => {
          confirmDelete(record);
        },
      }),
    [access, confirmDelete],
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

  const submitCreate = React.useCallback(async (values: PermValues) => {
    setCreating(true);

    try {
      const response = await createPerm(values);
      message.success(response.message || '新增 API 权限成功');
      setCreateOpen(false);
      actionRef.current?.reload();
    } catch {
      return;
    } finally {
      setCreating(false);
    }
  }, []);

  const submitEdit = React.useCallback(
    async (values: PermValues) => {
      if (!editRecord) {
        return;
      }

      setEditing(true);

      try {
        const response = await editPerm(editRecord.id, values);
        message.success(response.message || '编辑 API 权限成功');
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
      <ListPage<PermRecord, PermQueryParams>
        accessible={canList}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="API 权限列表"
        columns={columns}
        request={permissionsRequest}
        options={false}
        search={{
          defaultCollapsed: true,
          span: 8,
        }}
        toolbarActions={
          access.hasPerm('permission:create')
            ? [
                <Button
                  key="create"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCreateOpen(true);
                  }}
                >
                  新增权限
                </Button>,
              ]
            : []
        }
      />
      <CreateModal
        open={createOpen}
        saving={creating}
        moduleOptions={moduleOptions}
        moduleLoading={moduleLoading}
        onModuleOpen={canLoadModules ? loadModules : undefined}
        onCancel={closeCreate}
        onSubmit={(values) => {
          void submitCreate(values);
        }}
      />
      <EditModal
        open={editOpen}
        saving={editing}
        record={editRecord}
        moduleOptions={moduleOptions}
        moduleLoading={moduleLoading}
        onModuleOpen={canLoadModules ? loadModules : undefined}
        onCancel={closeEdit}
        onSubmit={(values) => {
          void submitEdit(values);
        }}
      />
    </>
  );
};

export default PermissionsPage;
