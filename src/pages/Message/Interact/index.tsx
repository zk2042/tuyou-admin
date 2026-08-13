import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import {
  deleteMessage,
  queryInteractMessage,
} from '@/services/message/interact';
import type { MessageItem } from '@/services/message/system/types';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import React, { useMemo, useRef } from 'react';

import { messageColumns, type MessageQuery } from '../messageConfig';

const interactMsgTypeEnum = {
  点赞: { text: '点赞' },
  关注: { text: '关注' },
  评论: { text: '评论' },
  收藏: { text: '收藏' },
};

const interactRequest = async (params: MessageQuery) => {
  try {
    const response = await queryInteractMessage({
      page: params.current ?? 1,
      size: params.pageSize ?? PAGE_SIZE,
      msg_type: params.msg_type,
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

const InteractPage: React.FC = () => {
  const { hasPerm } = useAccess();
  const canList = hasPerm('message:interact:list');
  const canDelete = hasPerm('message:interact:delete');
  const actionRef = useRef<ActionType>();
  const { deleting, confirmDelete } = useRowDelete<MessageItem>({
    entityLabel: '互动消息',
    getName: (record) => record.content,
    getDesc: (record) => `${record.content}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteMessage(record.id);
    },
    onSuccess: async () => {
      actionRef.current?.reload();
    },
  });

  const columns = useMemo(
    () =>
      messageColumns({
        msgTypeEnum: interactMsgTypeEnum,
        onDelete: canDelete ? confirmDelete : undefined,
        deleting,
      }),
    [canDelete, confirmDelete, deleting],
  );

  return (
    <ListPage
      accessible={canList}
      actionRef={actionRef}
      rowKey="id"
      headerTitle="互动消息列表"
      columns={columns}
      request={interactRequest}
      options={false}
      search={{
        defaultCollapsed: true,
        span: 8,
      }}
    />
  );
};

export default InteractPage;
