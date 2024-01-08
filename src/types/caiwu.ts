import { UserState } from '@/store/modules/user/types';

export interface IContract {
  id: number;
  name: string;
  bianma: string;
  rooms: string[];
  oldRooms: string;
  phone: string;
  userId: string;
  price: number;
  area: number;
  startTime: string;
  endTime: string;
  yyzz: string[];
  user?: UserState;
}

export interface ICost {
  id: number;
  price: number;
  state: string;
  end: string;
  desc: string;
  costypeId: number;
}

export interface IConList {
  id: number;
  startTime: string;
  endTime: string;
  desc: string;
  imgs: string[];
  contractId: number;
  contract: IContract;
}
