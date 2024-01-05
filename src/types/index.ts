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
  addTime: string;
}
