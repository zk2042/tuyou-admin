import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  batchDeleteComment,
  deleteComment,
  getComment,
  queryComment,
} from '@/services/comment';
import type {
  CommentDetail,
  CommentItem,
  CommentQuery as ReqQuery,
} from '@/services/comment/types';
import { message } from '@/utils/message';
import type { ActionType, ProTableProps } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Divider, Modal, Table, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import { commentColumns, type CommentQuery } from './commentConfig';
import DetailModal from './components/DetailModal';

const orderMap = {
  ascend: '升序',
  descend: '降序',
} as const;

const sortMap = {
  like_count: 'likes',
  heat: 'heat',
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

const commentRequest: ProTableProps<
  CommentItem,
  CommentQuery
>['request'] = async (params, sorter) => {
  const query: ReqQuery = {
    page: params.current ?? 1,
    size: params.pageSize ?? PAGE_SIZE,
  };

  if (params.target_type) {
    query.target_type = params.target_type;
  }

  if (params.nickname) {
    query.nickname = params.nickname;
  }

  if (params.title) {
    query.title = params.title;
  }

  if (params.level) {
    query.level = params.level;
  }

  if (params.begin_time) {
    query.begin_time = params.begin_time;
  }

  if (params.finish_time) {
    query.finish_time = params.finish_time;
  }

  Object.assign(
    query,
    createSort(sorter as Record<string, 'ascend' | 'descend' | null>),
  );

  try {
    const response = await queryComment(query);
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

type BatchRow = Pick<CommentItem, 'id' | 'target_title' | 'content'>;

const previewContent = (record: BatchRow) => {
  return record.content.length > 32
    ? `${record.content.slice(0, 32)}...`
    : record.content;
};

const CommentPage: React.FC = () => {
  const { hasPerm } = useAccess();
  const canList = hasPerm('comment:list');
  const canDetail = hasPerm('comment:detail');
  const canDelete = hasPerm('comment:delete');
  const canBatchDelete = hasPerm('comment:batch-delete');
  const actionRef = useRef<ActionType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BatchRow[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<CommentDetail>();
  const { deleting, confirmDelete } = useRowDelete<CommentItem>({
    entityLabel: '评论',
    getName: (record) => record.id,
    getDesc: (record) => `评论 ${record.id} 删除后将无法恢复。`,
    request: async (record) => {
      await deleteComment(record.id);
    },
    onSuccess: async () => {
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
    },
  });

  const openDetail = React.useCallback(async (record: CommentItem) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(undefined);

    try {
      const response = await getComment(record.id);
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

  const submitBatchDelete = React.useCallback(async () => {
    if (!selectedKeys.length) {
      message.warning('请先选择要批量删除的评论');
      return;
    }

    setBatchDeleting(true);

    try {
      const response = await batchDeleteComment({
        ids: selectedKeys as string[],
      });

      setBatchOpen(false);
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
      message.success(
        response.message || `已删除 ${selectedKeys.length} 条评论`,
      );
    } finally {
      setBatchDeleting(false);
    }
  }, [selectedKeys]);

  const columns = useMemo(
    () =>
      commentColumns({
        onDetail: openDetail,
        onDelete: confirmDelete,
        deleting,
        canDetail,
        canDelete,
      }),
    [canDelete, canDetail, confirmDelete, deleting, openDetail],
  );

  return (
    <>
      <ListPage<CommentItem, CommentQuery>
        accessible={canList}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="评论列表"
        columns={columns}
        request={commentRequest}
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
        toolbarActions={
          canBatchDelete
            ? [
                <Button
                  key="delete"
                  disabled={selectedKeys.length === 0}
                  danger
                  loading={batchDeleting}
                  onClick={() => {
                    if (!selectedKeys.length) {
                      message.warning('请先选择要批量删除的评论');
                      return;
                    }

                    setBatchOpen(true);
                  }}
                >
                  批量删除
                </Button>,
              ]
            : []
        }
      />
      <DetailModal
        open={detailOpen}
        loading={detailLoading}
        record={detailData}
        onClose={closeDetail}
      />
      <Modal
        title="批量删除评论"
        open={batchOpen}
        destroyOnHidden
        confirmLoading={batchDeleting}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        width={700}
        onCancel={() => {
          if (!batchDeleting) {
            setBatchOpen(false);
          }
        }}
        onOk={() => {
          void submitBatchDelete();
        }}
      >
        <Divider style={{ margin: '0 0 20px' }} />
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {`已选择 ${selectedKeys.length} 条评论，删除后将无法恢复。`}
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
              width: 120,
            },
            {
              title: '所属作品',
              dataIndex: 'target_title',
              width: 220,
            },
            {
              title: '评论内容',
              dataIndex: 'content',
              render: (_, record) => previewContent(record),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default CommentPage;
