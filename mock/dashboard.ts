import type { WorkbenchData } from '@/services/workbench/types';

const data: WorkbenchData = {
  member_total: 12846,
  activity_total: 386,
  publish_total: 2458,
  comment_total: 18726,
  register_trend: [
    { date: '08-01', count: 126 },
    { date: '08-02', count: 98 },
    { date: '08-03', count: 152 },
    { date: '08-04', count: 137 },
    { date: '08-05', count: 186 },
    { date: '08-06', count: 168 },
    { date: '08-07', count: 214 },
  ],
};

export default {
  'GET /api/v1/admin/workbench': {
    code: 0,
    message: '获取工作台数据成功',
    data,
  },
};
