import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  createMenu,
  deleteMenu,
  editMenu,
  queryMenu,
} from '@/services/authority/menu';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import {
  menuColumns,
  type MenuQueryParams,
  type MenuRecord,
  type MenuValues,
} from './menuConfig';

const menuRequest = async (params: MenuQueryParams) => {
  try {
    const response = await queryMenu({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      menu_name: params.menu_name,
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

const MenuPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<MenuRecord>();
  const { confirmDelete } = useRowDelete<MenuRecord>({
    entityLabel: '菜单',
    getName: (record) => record.menu_name,
    getDesc: (record) => `${record.menu_name} 删除后将无法恢复。`,
    request: async (record) => {
      await deleteMenu(record.id);
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
      menuColumns({
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

  const submitCreate = React.useCallback(async (values: MenuValues) => {
    setCreating(true);

    try {
      const response = await createMenu(values);
      message.success(response.message || '新增菜单成功');
      setCreateOpen(false);
      actionRef.current?.reload();
    } catch {
      return;
    } finally {
      setCreating(false);
    }
  }, []);

  const submitEdit = React.useCallback(
    async (values: MenuValues) => {
      if (!editRecord) {
        return;
      }

      setEditing(true);

      try {
        const response = await editMenu(editRecord.id, values);
        message.success(response.message || '编辑菜单成功');
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
      <ListPage<MenuRecord, MenuQueryParams>
        actionRef={actionRef}
        rowKey="id"
        headerTitle="菜单列表"
        columns={columns}
        request={menuRequest}
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
            新增菜单
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

export default MenuPage;
