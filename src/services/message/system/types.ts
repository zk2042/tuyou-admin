export interface MessageQuery {
  page: number;
  size: number;
  msg_type?: string;
  begin_time?: string;
  finish_time?: string;
}

export interface MessageItem {
  id: string;
  msg_type: string;
  content: string;
  receive_type: string;
  sender: string;
  send_time: string;
}

export interface SendReq {
  content: string;
  receive_type: number;
  member_ids?: number[];
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
