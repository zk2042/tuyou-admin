export interface TrendItem {
  date: string;
  count: number;
}

export interface WorkbenchData {
  member_total: number;
  activity_total: number;
  publish_total: number;
  comment_total: number;
  register_trend: TrendItem[];
}
