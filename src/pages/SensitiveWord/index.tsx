import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  batchDeleteSensitiveWord,
  createSensitiveWord,
  deleteSensitiveWord,
  querySensitiveWord,
} from '@/services/sensitive-word';
import type { SensitiveWordItem } from '@/services/sensitive-word/types';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Divider, Modal, Table, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

import AddModal, { type CreateVals } from './components/AddModal';
import {
  sensitiveWordColumns,
  type SensitiveWordQuery,
} from './sensitiveWordConfig';

type BatchRow = Pick<SensitiveWordItem, 'id' | 'word'>;

const sensitiveWordRequest = async (params: SensitiveWordQuery) => {
  try {
    const response = await querySensitiveWord({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      keyword: params.keyword,
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

const SensitiveWordPage: React.FC = () => {
  const { hasPerm } = useAccess();
  const canList = hasPerm('sensitive-word:list');
  const canCreate = hasPerm('sensitive-word:create');
  const canDelete = hasPerm('sensitive-word:delete');
  const canBatchDelete = hasPerm('sensitive-word:batch-delete');
  const actionRef = useRef<ActionType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BatchRow[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDel, setBatchDel] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { deleting, confirmDelete } = useRowDelete<SensitiveWordItem>({
    entityLabel: '敏感词',
    getName: (record) => record.word,
    getDesc: (record) => `${record.word}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteSensitiveWord(record.id);
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
      const response = await createSensitiveWord({
        word: vals.word.trim(),
      });
      message.success(response.message || '新增敏感词成功');
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

  const submitBatchDelete = React.useCallback(async () => {
    if (!selectedKeys.length) {
      message.warning('请先选择要批量删除的敏感词');
      return;
    }

    setBatchDel(true);

    try {
      const response = await batchDeleteSensitiveWord({
        ids: selectedKeys as string[],
      });

      setBatchOpen(false);
      setSelectedKeys([]);
      setSelectedRows([]);
      actionRef.current?.reload();
      message.success(
        response.message || `已删除 ${selectedKeys.length} 个敏感词`,
      );
    } catch {
      return;
    } finally {
      setBatchDel(false);
    }
  }, [selectedKeys]);

  const columns = useMemo(
    () =>
      sensitiveWordColumns({
        onDelete: canDelete ? confirmDelete : undefined,
        deleting,
      }),
    [canDelete, confirmDelete, deleting],
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
            message.warning('请先选择要批量删除的敏感词');
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
        新增敏感词
      </Button>
    ),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <>
      <ListPage<SensitiveWordItem, SensitiveWordQuery>
        accessible={canList}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="敏感词列表"
        columns={columns}
        request={sensitiveWordRequest}
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
      <AddModal
        open={createOpen}
        saving={creating}
        onCancel={closeCreate}
        onSubmit={submitCreate}
      />
      <Modal
        title="批量删除敏感词"
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
          {`已选择 ${selectedKeys.length} 个敏感词，删除后将无法恢复。`}
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
              title: '敏感词',
              dataIndex: 'word',
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default SensitiveWordPage;
