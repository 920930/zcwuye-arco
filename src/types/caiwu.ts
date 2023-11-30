import { UserState } from '@/store/modules/user/types';

export interface IContract {
  id: number;
  name: string;
  bianma: string;
  rooms: string[];
  oldRooms: string;
  phone: string;
  userId: string;
  startTime: string;
  endTime: string;
  yyzz: string[];
  user?: UserState;
}
