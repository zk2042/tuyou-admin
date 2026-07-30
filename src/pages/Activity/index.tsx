import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useBatchExport } from '@/hooks/table/useBatchExport';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button, Divider, Modal, Table, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import {
  batchDeleteActivity,
  createActivity,
  deleteActivity,
  editActivity,
  exportActivity,
  getActivity,
  queryActivity,
} from '@/services/activity';
import type {
  ActDetail,
  ActivityItem as ActItem,
  CreateReq,
} from '@/services/activity/types';
import { uploadImage } from '@/services/upload';
import { activityColumns, type ActQuery } from './activityConfig';
import CreateModal, { type CreateVals } from './CreateModal';
import DetailModal from './DetailModal';
import EditModal, { type EditVals } from './EditModal';

const activityRequest = async (params: ActQuery) => {
  try {
    const response = await queryActivity({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      title: params.title,
      leader_name: params.leader_name,
      activity_type: params.activity_type,
      difficulty: params.difficulty,
      fee: params.fee,
      activity_status: params.activity_status,
      is_slide: params.is_slide,
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

const uploadCover = async (file: File) => {
  const response = await uploadImage(file);
  if (!response.data?.url) {
    throw new Error('上传图片失败');
  }

  return response.data.url;
};

const toReq = (vals: CreateVals): CreateReq => {
  const req: CreateReq = {
    title: vals.title.trim(),
    leader_name: vals.leader_name.trim(),
    cover_img: vals.cover_img.trim(),
    activity_type: vals.activity_type,
    address: vals.address.trim(),
    start_time: vals.start_time.format('YYYY-MM-DD HH:mm:ss'),
    end_time: vals.end_time.format('YYYY-MM-DD HH:mm:ss'),
    max_people: vals.max_people,
    price: vals.price,
    difficulty: vals.difficulty,
    activity_content: vals.activity_content.trim(),
  };

  return req;
};

type BatchRow = Pick<ActItem, 'id' | 'title'>;

const ActivityPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BatchRow[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDel, setBatchDel] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editFetching, setEditFetching] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editData, setEditData] = useState<ActDetail>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<ActDetail>();
  const { deleting, confirmDelete } = useRowDelete<ActItem>({
    entityLabel: '活动',
    getName: (record) => record.title,
    getDesc: (record) => `${record.title}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteActivity(record.id);
    },
    onSuccess: async () => {
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
    },
  });
  const {
    open: exportOpen,
    exporting,
    openExport,
    closeExport,
    submitExport,
  } = useBatchExport({
    entityLabel: '活动',
    getCount: () => selectedKeys.length,
    request: () => {
      return exportActivity({
        ids: selectedKeys as string[],
      });
    },
  });

  const openDetail = React.useCallback(async (record: ActItem) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(undefined);

    try {
      const response = await getActivity(record.id);
      if (!response.data) {
        setDetailOpen(false);
        return;
      }
      setDetailData(response.data);
    } catch {
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = React.useCallback(() => {
    setDetailOpen(false);
    setDetailLoading(false);
    setDetailData(undefined);
  }, []);

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
      const response = await createActivity(toReq(vals));
      message.success(response.message || '创建活动成功');
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

  const openEdit = React.useCallback(async (record: ActItem) => {
    setEditOpen(true);
    setEditFetching(true);
    setEditData(undefined);

    try {
      const response = await getActivity(record.id);
      if (!response.data) {
        setEditOpen(false);
        return;
      }

      setEditData(response.data);
    } catch {
      setEditOpen(false);
    } finally {
      setEditFetching(false);
    }
  }, []);

  const closeEdit = React.useCallback(() => {
    setEditOpen(false);
    setEditFetching(false);
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
        const response = await editActivity(editData.id, {
          is_slide: vals.is_slide,
        });

        if (!response.data) {
          return;
        }

        setEditData(response.data);
        message.success(`已更新活动 ${response.data.title}`);
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
      message.warning('请先选择要批量删除的活动');
      return;
    }

    setBatchDel(true);

    try {
      const response = await batchDeleteActivity({
        ids: selectedKeys as string[],
      });

      setBatchOpen(false);
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
      message.success(
        response.message || `已删除 ${selectedKeys.length} 个活动`,
      );
    } finally {
      setBatchDel(false);
    }
  }, [selectedKeys]);

  const columns = useMemo(
    () =>
      activityColumns({
        onDetail: openDetail,
        onEdit: openEdit,
        onDelete: confirmDelete,
        deleting,
      }),
    [confirmDelete, deleting, openDetail, openEdit],
  );

  return (
    <>
      <ListPage<ActItem, ActQuery>
        actionRef={actionRef}
        rowKey="id"
        headerTitle="活动列表"
        columns={columns}
        request={activityRequest}
        options={false}
        search={{
          defaultCollapsed: false,
          span: 8,
        }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys, rows) => {
            setSelectedKeys(keys);
            setSelectedRows(rows as BatchRow[]);
          },
        }}
        toolbarActions={[
          <Button
            key="export"
            disabled={selectedKeys.length === 0}
            loading={exporting}
            onClick={openExport}
          >
            批量导出
          </Button>,
          <Button
            key="delete"
            disabled={selectedKeys.length === 0}
            danger
            loading={batchDel}
            onClick={() => {
              if (!selectedKeys.length) {
                message.warning('请先选择要批量删除的活动');
                return;
              }

              setBatchOpen(true);
            }}
          >
            批量删除
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
          >
            创建活动
          </Button>,
        ]}
      />
      <CreateModal
        open={createOpen}
        saving={creating}
        onCancel={closeCreate}
        onSubmit={submitCreate}
        uploadRequest={uploadCover}
      />
      <DetailModal
        open={detailOpen}
        loading={detailLoading}
        record={detailData}
        onClose={closeDetail}
      />
      <EditModal
        open={editOpen}
        loading={editFetching}
        saving={editSaving}
        record={{
          title: editData?.title || '',
        }}
        values={{
          is_slide: editData?.is_slide === '是',
        }}
        onCancel={closeEdit}
        onSubmit={(vals) => {
          void submitEdit(vals);
        }}
      />
      <Modal
        title="批量导出活动"
        open={exportOpen}
        destroyOnHidden
        confirmLoading={exporting}
        okText="确认导出"
        cancelText="取消"
        width={560}
        onCancel={closeExport}
        onOk={() => {
          void submitExport();
        }}
      >
        <Divider style={{ margin: '0 0 20px' }} />
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {`已选择 ${selectedKeys.length} 个活动，确认后将导出所选活动数据。`}
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
              title: '活动名称',
              dataIndex: 'title',
            },
          ]}
        />
      </Modal>
      <Modal
        title="批量删除活动"
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
          {`已选择 ${selectedKeys.length} 个活动，删除后将无法恢复。`}
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
              title: '活动名称',
              dataIndex: 'title',
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default ActivityPage;
