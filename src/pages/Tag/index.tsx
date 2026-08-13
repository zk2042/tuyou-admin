import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Divider, Modal, Table, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import {
  batchDeleteTag,
  createTag,
  deleteTag,
  editTag,
  queryTag,
} from '@/services/tag';
import type { EditReq, TagItem } from '@/services/tag/types';
import CreateModal, { type CreateVals } from './Components/CreateModal';
import EditModal, { type EditVals } from './Components/EditModal';
import { tagColumns, type TagQuery } from './tagConfig';

const tagRequest = async (params: TagQuery) => {
  try {
    const response = await queryTag({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      tag_name: params.tag_name,
      status: params.status,
      begin_time: params.begin_time,
      finish_time: params.finish_time,
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

const toReq = (vals: EditVals): EditReq => {
  return {
    status: vals.status ? '启用' : '禁用',
    is_hot: vals.is_hot ? '是' : '否',
  };
};

type BatchRow = Pick<TagItem, 'id' | 'tag_name'>;

const TagPage: React.FC = () => {
  const { hasPerm } = useAccess();
  const canList = hasPerm('tag:list');
  const canCreate = hasPerm('tag:create');
  const canEdit = hasPerm('tag:edit');
  const canDelete = hasPerm('tag:delete');
  const canBatchDelete = hasPerm('tag:batch-delete');
  const actionRef = useRef<ActionType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BatchRow[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDel, setBatchDel] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editData, setEditData] = useState<TagItem>();
  const { deleting, confirmDelete } = useRowDelete<TagItem>({
    entityLabel: '标签',
    getName: (record) => record.tag_name,
    getDesc: (record) => `${record.tag_name}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteTag(record.id);
    },
    onSuccess: async () => {
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
    },
  });

  const openCreate = React.useCallback(() => {
    setCreateOpen(true);
  }, []);

  const closeCreate = React.useCallback(() => {
    setCreateOpen(false);
    setCreating(false);
  }, []);

  const submitCreate = React.useCallback(async (vals: CreateVals) => {
    setCreating(true);

    try {
      const response = await createTag({
        tag_name: vals.tag_name.trim(),
        status: vals.status,
      });
      message.success(response.message || '创建标签成功');
      setCreateOpen(false);
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
    } catch {
      return;
    } finally {
      setCreating(false);
    }
  }, []);

  const openEdit = React.useCallback((record: TagItem) => {
    setEditData(record);
    setEditOpen(true);
  }, []);

  const closeEdit = React.useCallback(() => {
    setEditOpen(false);
    setEditSaving(false);
    setEditData(undefined);
  }, []);

  const submitEdit = React.useCallback(
    async (vals: EditVals) => {
      if (!editData) {
        return;
      }

      setEditSaving(true);

      try {
        const response = await editTag(editData.id, toReq(vals));
        if (!response.data) {
          return;
        }

        message.success(response.message || `已更新标签 ${editData.tag_name}`);
        setEditOpen(false);
        actionRef.current?.reload();
      } catch {
        return;
      } finally {
        setEditSaving(false);
      }
    },
    [editData],
  );

  const submitBatchDelete = React.useCallback(async () => {
    if (!selectedKeys.length) {
      message.warning('请先选择要批量删除的标签');
      return;
    }

    setBatchDel(true);

    try {
      const response = await batchDeleteTag({
        ids: selectedKeys as string[],
      });

      setBatchOpen(false);
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
      message.success(
        response.message || `已删除 ${selectedKeys.length} 个标签`,
      );
    } catch {
      return;
    } finally {
      setBatchDel(false);
    }
  }, [selectedKeys]);

  const columns = useMemo(
    () =>
      tagColumns({
        onEdit: canEdit ? openEdit : undefined,
        onDelete: canDelete ? confirmDelete : undefined,
        deleting,
      }),
    [canDelete, canEdit, confirmDelete, deleting, openEdit],
  );

  const toolbarActions = [
    canBatchDelete && (
      <Button
        key="delete"
        disabled={selectedKeys.length === 0}
        danger
        loading={batchDel}
        onClick={() => {
          if (!selectedKeys.length) {
            message.warning('请先选择要批量删除的标签');
            return;
          }

          setBatchOpen(true);
        }}
      >
        批量删除
      </Button>
    ),
    canCreate && (
      <Button
        key="create"
        type="primary"
        icon={<PlusOutlined />}
        onClick={openCreate}
      >
        新增标签
      </Button>
    ),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <>
      <ListPage<TagItem, TagQuery>
        accessible={canList}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="标签列表"
        columns={columns}
        request={tagRequest}
        options={false}
        search={{
          defaultCollapsed: true,
          span: 8,
        }}
        rowSelection={
          canBatchDelete
            ? {
                selectedRowKeys: selectedKeys,
                onChange: (keys, rows) => {
                  setSelectedKeys(keys);
                  setSelectedRows(rows as BatchRow[]);
                },
              }
            : undefined
        }
        toolbarActions={toolbarActions}
      />
      <CreateModal
        open={createOpen}
        saving={creating}
        onCancel={closeCreate}
        onSubmit={submitCreate}
      />
      <EditModal
        open={editOpen}
        saving={editSaving}
        record={{
          tag_name: editData?.tag_name || '',
        }}
        values={{
          status: editData?.status === '启用',
          is_hot: editData?.is_hot === '是',
        }}
        onCancel={closeEdit}
        onSubmit={(vals) => {
          void submitEdit(vals);
        }}
      />
      <Modal
        title="批量删除标签"
        open={batchOpen}
        destroyOnHidden
        confirmLoading={batchDel}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        width={560}
        onCancel={() => {
          if (!batchDel) {
            setBatchOpen(false);
          }
        }}
        onOk={() => {
          void submitBatchDelete();
        }}
      >
        <Divider style={{ margin: '0 0 20px' }} />
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {`已选择 ${selectedKeys.length} 个标签，删除后将无法恢复。`}
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
              title: '标签名称',
              dataIndex: 'tag_name',
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default TagPage;
