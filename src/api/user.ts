import http from '@/utils/http';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  phone: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export const login = (data: LoginData) => {
  return http.post<LoginRes>('/user/login', data);
};

export async function logout() {
  return http.post<LoginRes>('/user/logout');
}

export function getUserInfo() {
  return http.post<UserState>('/user/info');
}

export function getMenuList(companyId: number) {
  return http.post<RouteRecordNormalized[]>(`/user/menu?companyId=${companyId}`);
}
