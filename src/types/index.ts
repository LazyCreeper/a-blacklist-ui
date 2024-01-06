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
  bilibili: string;
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
  username: string;
  uuid: string;
  status: number;
  role: string;
  email: string;
  regTime: string;
}
