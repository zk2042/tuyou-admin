export type CurrentInfo = {
  id: string;
  username: string;
  adminname: string;
  role: string;
  avatar: string;
  status: boolean;
};

export type PwdBody = {
  old_password: string;
  new_password: string;
};
