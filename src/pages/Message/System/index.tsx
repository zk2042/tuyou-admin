import ListPage from '@/components/ListPage';
import { API_RESPONSE_SUCCESS_CODE, PAGE_SIZE } from '@/constants';
import { useRowDelete } from '@/hooks/table/useRowDelete';
import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  deleteMessage,
  querySystemMessage,
  sendSystemMessage,
} from '@/services/message/system';
import type { MessageItem, SendReq } from '@/services/message/system/types';
import { messageColumns, type MessageQuery } from '../messageConfig';
import SendModal, { type SendVals } from './components/SendModal';

const systemMsgTypeEnum = {
  系统: { text: '系统' },
  活动: { text: '活动' },
};

const systemRequest = async (params: MessageQuery) => {
  try {
    const response = await querySystemMessage({
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

const toReq = (vals: SendVals): SendReq => {
  const req: SendReq = {
    content: vals.content,
    receive_type: vals.receive_type,
  };

  if (vals.receive_type === 1 && vals.member_ids?.length) {
    req.member_ids = vals.member_ids;
  }

  return req;
};

const SystemPage: React.FC = () => {
  const { hasPerm } = useAccess();
  const canList = hasPerm('message:system:list');
  const canSend = hasPerm('message:system:send');
  const canDelete = hasPerm('message:system:delete');
  const actionRef = useRef<ActionType>();
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { deleting, confirmDelete } = useRowDelete<MessageItem>({
    entityLabel: '系统消息',
    getName: (record) => record.content,
    getDesc: (record) => `${record.content}（${record.id}）删除后将无法恢复。`,
    request: async (record) => {
      await deleteMessage(record.id);
    },
    onSuccess: async () => {
      actionRef.current?.reload();
    },
  });

  const openSend = useCallback(() => {
    setSendOpen(true);
  }, []);

  const closeSend = useCallback(() => {
    setSendOpen(false);
    setSending(false);
  }, []);

  const submitSend = useCallback(async (vals: SendVals) => {
    setSending(true);

    try {
      const response = await sendSystemMessage(toReq(vals));
      message.success(response.message || '发送成功');
      setSendOpen(false);
      actionRef.current?.reload();
    } catch {
      return;
    } finally {
      setSending(false);
    }
  }, []);

  const columns = useMemo(
    () =>
      messageColumns({
        msgTypeEnum: systemMsgTypeEnum,
        onDelete: canDelete ? confirmDelete : undefined,
        deleting,
      }),
    [canDelete, confirmDelete, deleting],
  );

  const toolbarActions = [
    canSend && (
      <Button
        key="send"
        type="primary"
        icon={<PlusOutlined />}
        onClick={openSend}
      >
        发送系统消息
      </Button>
    ),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <>
      <ListPage
        accessible={canList}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="系统消息列表"
        columns={columns}
        request={systemRequest}
        options={false}
        search={{
          defaultCollapsed: true,
          span: 8,
        }}
        toolbarActions={toolbarActions}
      />
      <SendModal
        open={sendOpen}
        saving={sending}
        onCancel={closeSend}
        onSubmit={submitSend}
      />
    </>
  );
};

export default SystemPage;
