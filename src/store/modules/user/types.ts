export type RoleType = '' | '*' | 'super' | 'admin' | 'user';
export interface UserState {
  id?: number;
  name?: string;
  avatar?: string;
  job?: string;
  jobName?: string;
  company: { id: number; name: string }[];
  companyId?: number;
  introduction?: string;
  phone?: string;
  role: RoleType;
}
