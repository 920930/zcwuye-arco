export type RoleType = '' | '*' | 'super' | 'admin' | 'user';

export interface ICompany {
  id?: number;
  name?: string;
  fname?: string;
  bm?: string;
  dong?: number;
  qu?: number;
  qutype?: number[];
  qulen?: number;
  state?: boolean;
}

export interface UserState {
  id?: number;
  name?: string;
  avatar?: string;
  card?: string;
  job?: string;
  jobName?: string;
  companies: ICompany[];
  company?: ICompany;
  introduction?: string;
  phone?: string;
  role: RoleType;
}
