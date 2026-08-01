export interface ActivityQuery {
  page: number;
  size: number;
  title?: string;
  leader_name?: string;
  activity_type?: string;
  difficulty?: string;
  fee?: string;
  activity_status?: string;
  is_slide?: string;
  begin_time?: string;
  finish_time?: string;
}

export interface CreateReq {
  title: string;
  leader_name: string;
  cover_img: string;
  activity_type: string;
  address: string;
  start_time: string;
  end_time: string;
  max_people: number;
  price: number;
  difficulty: string;
  activity_content: string;
}

export interface EditReq {
  is_slide: boolean;
}

export interface BatchReq {
  ids: string[];
}

export interface LeaderItem {
  id: string;
  leader_name: string;
}

export interface ActivityItem {
  id: string;
  cover_img: string;
  title: string;
  leader_member_id: string;
  leader_name: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  price?: number | null;
  current_people: number;
  max_people: number;
  difficulty: string;
  is_slide: string;
  activity_status: string;
  is_del: string;
  delete_time?: string | null;
}

export interface ActDetail extends ActivityItem {
  activity_content: string;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
