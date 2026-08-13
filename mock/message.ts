import type { MessageItem } from '@/services/message/system/types';

interface PageQuery {
  page?: string;
  size?: string;
  msg_type?: string;
  begin_time?: string;
  finish_time?: string;
}

interface SendBody {
  content?: string;
  receive_type?: number;
  member_ids?: number[];
}

// 互动消息：点赞 / 关注 / 评论 / 收藏
const interactList: MessageItem[] = [
  {
    id: '12',
    msg_type: '点赞',
    content: '「小明」赞了你的内容《春日徒步》',
    receive_type: '指定会员',
    sender: '小明',
    send_time: '2026-08-13 09:30:00',
  },
  {
    id: '11',
    msg_type: '关注',
    content: '「小红」关注了你',
    receive_type: '指定会员',
    sender: '小红',
    send_time: '2026-08-13 09:00:00',
  },
  {
    id: '10',
    msg_type: '评论',
    content: '「小刚」评论了你的内容《春日徒步》',
    receive_type: '指定会员',
    sender: '小刚',
    send_time: '2026-08-12 20:00:00',
  },
  {
    id: '9',
    msg_type: '收藏',
    content: '「小丽」收藏了你的内容《春日徒步》',
    receive_type: '指定会员',
    sender: '小丽',
    send_time: '2026-08-12 15:00:00',
  },
  {
    id: '8',
    msg_type: '点赞',
    content: '「阿强」赞了你的内容《海边露营》',
    receive_type: '指定会员',
    sender: '阿强',
    send_time: '2026-08-11 14:20:00',
  },
  {
    id: '7',
    msg_type: '评论',
    content: '「老王」评论了你的内容《骑行青海湖》',
    receive_type: '指定会员',
    sender: '老王',
    send_time: '2026-08-10 10:15:00',
  },
];

// 系统消息：系统 / 活动
const systemList: MessageItem[] = [
  {
    id: '6',
    msg_type: '系统',
    content: '本周六有户外分享会，欢迎参加',
    receive_type: '全体',
    sender: '管理员小张',
    send_time: '2026-08-13 10:00:00',
  },
  {
    id: '5',
    msg_type: '活动',
    content: '你已成功报名活动《春日徒步》',
    receive_type: '指定会员',
    sender: '系统',
    send_time: '2026-08-12 08:00:00',
  },
  {
    id: '4',
    msg_type: '系统',
    content: '平台将于今晚 23:00 进行例行维护，预计 30 分钟',
    receive_type: '全体',
    sender: '管理员小张',
    send_time: '2026-08-11 18:00:00',
  },
  {
    id: '3',
    msg_type: '活动',
    content: '你报名的活动《海边露营》即将开始，请提前到达集合点',
    receive_type: '指定会员',
    sender: '系统',
    send_time: '2026-08-10 19:30:00',
  },
];

// const includesText = (source: string, keyword?: string) => {
//   if (!keyword) {
//     return true;
//   }
//   return source.toLowerCase().includes(keyword.trim().toLowerCase());
// };

const matchSelect = (source: string, current?: string) => {
  if (!current) {
    return true;
  }
  return source === current;
};

const matchDate = (value: string, start?: string, end?: string) => {
  if (start && value < start) {
    return false;
  }
  if (end && value > end) {
    return false;
  }
  return true;
};

const normalizeBody = <T>(body?: T | string): T => {
  if (!body) {
    return {} as T;
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T;
    } catch {
      return {} as T;
    }
  }
  return body;
};

const pageResult = (source: MessageItem[], query: PageQuery) => {
  const page = Number(query.page || 1);
  const size = Number(query.size || 10);

  const filtered = source.filter((item) => {
    return (
      matchSelect(item.msg_type, query.msg_type) &&
      matchDate(item.send_time, query.begin_time, query.finish_time)
    );
  });

  const start = (page - 1) * size;
  const list = filtered.slice(start, start + size);

  return {
    code: 0,
    message: '成功',
    data: {
      list,
      total: filtered.length,
      page,
      size,
      total_page: Math.ceil(filtered.length / size) || 1,
    },
  };
};

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const deleteFromList = (source: MessageItem[], id: string) => {
  const index = source.findIndex((item) => item.id === String(id));
  if (index < 0) {
    return {
      code: 404,
      message: '消息不存在',
      data: null,
    };
  }

  source.splice(index, 1);
  return {
    code: 0,
    message: '删除成功',
    data: null,
  };
};

const sendSystemHandler = (req: any, res: any) => {
  const body = normalizeBody<SendBody>(req.body);

  if (!body.content?.trim()) {
    res.status(400).json({
      code: 400,
      message: '消息正文不能为空',
      data: null,
    });
    return;
  }

  if (typeof body.receive_type !== 'number') {
    res.status(400).json({
      code: 400,
      message: '请选择接收对象',
      data: null,
    });
    return;
  }

  // receive_type: 0 全体，1 指定会员
  if (
    body.receive_type === 1 &&
    (!body.member_ids || !body.member_ids.length)
  ) {
    res.status(400).json({
      code: 400,
      message: '指定会员时请选择会员',
      data: null,
    });
    return;
  }

  const newMsg: MessageItem = {
    id: String(Date.now()),
    msg_type: '系统',
    content: body.content.trim(),
    receive_type: body.receive_type === 0 ? '全体' : '指定会员',
    sender: '管理员小张',
    send_time: now(),
  };

  systemList.unshift(newMsg);

  res.json({
    code: 0,
    message: '发送成功',
    data: null,
  });
};

export default {
  // 互动消息列表
  'GET /__mock/api/v1/admin/messages/interactions': (req: any, res: any) => {
    res.json(pageResult(interactList, req.query || {}));
  },
  // 系统消息列表
  'GET /__mock/api/v1/admin/messages/system': (req: any, res: any) => {
    res.json(pageResult(systemList, req.query || {}));
  },
  // 发送系统消息
  'POST /__mock/api/v1/admin/messages/system': (req: any, res: any) => {
    sendSystemHandler(req, res);
  },
  // 删除消息（互动 / 系统通用）
  'DELETE /__mock/api/v1/admin/messages/:id': (req: any, res: any) => {
    const id = String(req.params.id);
    const interactResult = deleteFromList(interactList, id);
    if (interactResult.code === 0) {
      res.json(interactResult);
      return;
    }

    const systemResult = deleteFromList(systemList, id);
    if (systemResult.code === 0) {
      res.json(systemResult);
      return;
    }

    res.status(404).json({
      code: 404,
      message: '消息不存在',
      data: null,
    });
  },
};
