import http from '@/utils/http';
import { UserState } from '@/store/modules/user/types';
import { IMenu } from '@/store/modules/app/types';

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

export function getMenuList<T>(companyId?: number) {
  let url = '/menu';
  url += companyId ? `?companyId=${companyId}` : '';
  return http.get<T>(url);
}

export const getRoleList = <T>() => {
  return http.get<T>('/role');
};

export const getCompanyList = <T>() => http.get<T>('/company');

export const postOrPutMenu = <T>(data: IMenu) => {
  return data.id ? http.put<T>(`/menu/${data.id}`, data) : http.post<T>('/menu', data);
};
