import type { RouteRecordNormalized } from 'vue-router';
import type { ICompany } from '../company/types';

export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  [key: string]: unknown;
}

export interface IMenu {
  id: number;
  name: string;
  company: number[];
  meta: {
    locale: string;
    icon?: string;
    order?: number;
    requiresAuth?: boolean;
    hideInMenu?: boolean;
    roles?: string[];
  };
  children?: IMenu[];
  parent?: IMenu;
}

export interface IRole {
  id: number;
  title: string;
  name: string;
}

export interface IAdminer {
  id: number;
  name: string;
  phone: string;
  password?: string;
  avatar: string;
  state: boolean;
  role: IRole;
  companies: ICompany[];
}

export type IUser = Pick<IAdminer, 'id' | 'name' | 'phone' | 'state' | 'companies'>;

export interface IOptions {
  label: string;
  value: number;
  children?: IOptions[];
}
