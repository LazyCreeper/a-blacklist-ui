export interface NyaResponse {
  code: number;
  msg: string;
  time: string;
  data: any;
}

export interface BlacklistRes extends NyaResponse {
  data: {
    totalCount: number;
    totalPages: number;
    peoples: Blacklist[];
  };
}

export interface Blacklist {
  id: number;
  qq: string;
  email: string;
  reason: string;
  violateTime: any;
  updateAt?: any;
}

export interface TokenRes extends NyaResponse {
  data: {
    token: string;
  };
}

export interface UserInfoRes extends NyaResponse {
  data: UserInfo;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  status: number;
  regTime: string;
}

export interface UserListRes extends NyaResponse {
  data: {
    totalCount: number;
    totalPages: number;
    users: UserInfo[];
  };
}
