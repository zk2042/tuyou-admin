import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  createPerm,
  deletePerm,
  editPerm,
  queryPerm,
} from '@/services/authority/permissions';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
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

const permissionsRequest = async (params: PermQueryParams) => {
  try {
    const response = await queryPerm({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      perm_name: params.perm_name,
      module: params.module,
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

const PermissionsPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<PermRecord>();
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
        onEdit: (record) => {
          setEditRecord(record);
          setEditOpen(true);
        },
        onDelete: (record) => {
          confirmDelete(record);
        },
      }),
    [confirmDelete],
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
        toolbarActions={[
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
        ]}
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
    </>
  );
};

export default PermissionsPage;
