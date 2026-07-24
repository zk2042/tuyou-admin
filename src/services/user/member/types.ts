export interface UserParams {
  page: number;
  size: number;
  id?: string;
  nickname?: string;
  mobile?: string;
  registeredAtStart?: string;
  registeredAtEnd?: string;
}

export interface UserData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}
