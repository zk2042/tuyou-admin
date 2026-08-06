import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useBatchExport } from '@/hooks/table/useBatchExport';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import { message } from '@/utils/message';
import type { ActionType, ProTableProps } from '@ant-design/pro-components';
import { Button, Divider, Modal, Table, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import {
  batchDeleteNote,
  deleteNote,
  editNote,
  exportNote,
  getNote,
  queryNote,
} from '@/services/content/note';
import type {
  EditReq,
  NoteDetail,
  NoteItem,
  NoteQuery as ReqQuery,
} from '@/services/content/note/types';
import DetailModal from './components/DetailModal';
import EditModal, { type EditVals } from './components/EditModal';
import { noteColumns, type NoteQuery } from './noteConfig';

const orderMap = {
  ascend: '升序',
  descend: '降序',
} as const;

const sortMap = {
  heat: '热度',
  view_count: '浏览量',
  like_count: '点赞量',
  comment_count: '评论量',
  collect_count: '收藏量',
} as const;

const createSort = (
  sorter: Record<string, 'ascend' | 'descend' | null>,
): Pick<ReqQuery, 'sort_field' | 'sort_order'> => {
  const entries = Object.entries(sorter);
  const current = entries.find(([, value]) => value);

  if (!current) {
    return {};
  }

  const [field, order] = current;
  const sortField = sortMap[field as keyof typeof sortMap];
  const sortOrder = orderMap[order as keyof typeof orderMap];

  if (!sortField || !sortOrder) {
    return {};
  }

  return {
    sort_field: sortField,
    sort_order: sortOrder,
  };
};

const noteRequest: ProTableProps<NoteItem, NoteQuery>['request'] = async (
  params,
  sorter,
) => {
  try {
    const response = await queryNote({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      title: params.title,
      category: params.category,
      is_slide: params.is_slide,
      begin_time: params.begin_time,
      finish_time: params.finish_time,
      ...createSort(sorter as Record<string, 'ascend' | 'descend' | null>),
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
    category: vals.category,
    is_slide: vals.is_slide ? '是' : '否',
    status: vals.status ? '正常' : '下架',
  };
};

type BatchRow = Pick<NoteItem, 'id' | 'title'>;

const NotePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BatchRow[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDel, setBatchDel] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<NoteDetail>();
  const [editOpen, setEditOpen] = useState(false);
  const [editFetching, setEditFetching] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editData, setEditData] = useState<NoteDetail>();
  const { deleting, confirmDelete } = useRowDelete<NoteItem>({
    entityLabel: '笔记',
    getName: (record) => record.title,
    getDesc: (record) => `${record.title}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteNote(record.id);
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
    entityLabel: '笔记',
    getCount: () => selectedKeys.length,
    request: () => {
      return exportNote({
        ids: selectedKeys as string[],
      });
    },
  });

  const openDetail = React.useCallback(async (record: NoteItem) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(undefined);

    try {
      const response = await getNote(record.id);
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

  const openEdit = React.useCallback(async (record: NoteItem) => {
    setEditOpen(true);
    setEditFetching(true);
    setEditData(undefined);

    try {
      const response = await getNote(record.id);
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
        const response = await editNote(editData.id, toReq(vals));
        if (!response.data) {
          return;
        }

        setEditData(response.data);
        message.success(
          response.message || `已更新笔记 ${response.data.title}`,
        );
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
      message.warning('请先选择要批量删除的笔记');
      return;
    }

    setBatchDel(true);

    try {
      const response = await batchDeleteNote({
        ids: selectedKeys as string[],
      });

      setBatchOpen(false);
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
      message.success(
        response.message || `已删除 ${selectedKeys.length} 篇笔记`,
      );
    } catch {
      return;
    } finally {
      setBatchDel(false);
    }
  }, [selectedKeys]);

  const columns = useMemo(
    () =>
      noteColumns({
        onDetail: openDetail,
        onEdit: openEdit,
        onDelete: confirmDelete,
        deleting,
      }),
    [confirmDelete, deleting, openDetail, openEdit],
  );

  return (
    <>
      <ListPage<NoteItem, NoteQuery>
        actionRef={actionRef}
        rowKey="id"
        headerTitle="笔记列表"
        columns={columns}
        request={noteRequest}
        options={false}
        search={{
          defaultCollapsed: true,
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
                message.warning('请先选择要批量删除的笔记');
                return;
              }

              setBatchOpen(true);
            }}
          >
            批量删除
          </Button>,
        ]}
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
          category: editData?.category || '',
          is_slide: editData?.is_slide === '是',
          status: editData?.status === '正常',
        }}
        onCancel={closeEdit}
        onSubmit={(vals) => {
          void submitEdit(vals);
        }}
      />
      <Modal
        title="批量导出笔记"
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
          {`已选择 ${selectedKeys.length} 篇笔记，确认后将导出所选数据。`}
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
              title: '笔记标题',
              dataIndex: 'title',
            },
          ]}
        />
      </Modal>
      <Modal
        title="批量删除笔记"
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
          {`已选择 ${selectedKeys.length} 篇笔记，删除后将无法恢复。`}
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
              title: '笔记标题',
              dataIndex: 'title',
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default NotePage;
