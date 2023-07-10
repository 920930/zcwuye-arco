import type { RouteRecordNormalized } from 'vue-router';

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

export interface ICompany {
  id: number;
  name: string;
  dong: string;
  qu: string;
  qutype: number;
  state: boolean;
}

export interface IOptions {
  label: string;
  value: number;
  children?: IOptions[];
}
