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
  return http.post<string>('/auth/login', data);
};

export async function logout() {
  return http.post<LoginRes>('/auth/logout');
}

export function getUserInfo() {
  return http.get<UserState>('/adminer/info');
}

export function getMenuList(companyId: number) {
  return http.get<RouteRecordNormalized[]>(`/menu?companyId=${companyId}`);
}
