import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  createMenu,
  deleteMenu,
  editMenu,
  getParentMenus,
  queryMenu,
} from '@/services/authority/menu';
import type { ParentMenu } from '@/services/authority/menu/types';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import {
  menuColumns,
  type MenuQueryParams,
  type MenuRecord,
  type MenuValues,
} from './menuConfig';

const normalizeTree = (list: MenuRecord[]): MenuRecord[] => {
  return list.map((item) => {
    if (!item.children?.length) {
      return {
        id: item.id,
        menu_name: item.menu_name,
        parent_id: item.parent_id,
        parent_name: item.parent_name,
        menu_type: item.menu_type,
        menu_type_name: item.menu_type_name,
        route_path: item.route_path,
        component: item.component,
        icon: item.icon,
        hide_in_menu: item.hide_in_menu,
        sort: item.sort,
        status: item.status,
        create_time: item.create_time,
      };
    }

    return {
      ...item,
      children: normalizeTree(item.children),
    };
  });
};

const MenuPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<MenuRecord>();
  const [parentMenus, setParentMenus] = useState<ParentMenu[]>([]);
  const [parentLoading, setParentLoading] = useState(false);
  const loadParents = useCallback(async () => {
    setParentLoading(true);
    try {
      const response = await getParentMenus();
      setParentMenus(response.data ?? []);
    } catch {
      setParentMenus([]);
    } finally {
      setParentLoading(false);
    }
  }, []);
  const menuRequest = useCallback(async (params: MenuQueryParams) => {
    try {
      const response = await queryMenu({
        menu_name: params.menu_name,
        status: params.status,
      });
      const data = normalizeTree(response.data ?? []);

      return {
        data,
        success: response.code === API_RESPONSE_SUCCESS_CODE,
        total: data.length,
      };
    } catch {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  }, []);
  const parentOptions = useMemo(() => {
    return parentMenus.map((item) => ({
      label: item.menu_name,
      value: item.menu_name,
    }));
  }, [parentMenus]);

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
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
          rowExpandable: (record) => Boolean(record.children?.length),
        }}
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
        parentOptions={parentOptions}
        parentLoading={parentLoading}
        onParentOpen={loadParents}
        onCancel={closeCreate}
        onSubmit={(values) => {
          void submitCreate(values);
        }}
      />
      <EditModal
        open={editOpen}
        saving={editing}
        record={editRecord}
        parentOptions={parentOptions.filter(
          (option) => option.value !== editRecord?.menu_name,
        )}
        parentLoading={parentLoading}
        onParentOpen={loadParents}
        onCancel={closeEdit}
        onSubmit={(values) => {
          void submitEdit(values);
        }}
      />
    </>
  );
};

export default MenuPage;
