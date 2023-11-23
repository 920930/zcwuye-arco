import http from '@/utils/http';
import { UserState } from '@/store/modules/user/types';
import { IMenu, IRole } from '@/store/modules/app/types';
import { ICompany } from '@/store/modules/company/types';

export interface LoginData {
  phone: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export const login = (data: LoginData) => {
  return http.post<string>('/auth/login', data, true);
};

export async function logout() {
  return http.post<LoginRes>('/auth/logout');
}

export function getUserInfo() {
  return http.get<UserState>('/adminer/info', true);
}

// 菜单 - 列表
export function getMenuList<T>(companyId?: number) {
  let url = '/menu';
  url += companyId ? `?companyId=${companyId}` : '';
  return http.get<T>(url);
}
// 菜单 - 编辑或新增
export const menuPostOrPut = <T>(data: IMenu) => {
  return data.id ? http.put<T>(`/menu/${data.id}`, data) : http.post<T>('/menu', data);
};

// 角色 - 列表
export const getRoleList = <T>() => {
  return http.get<T>('/role');
};
// 角色 - 编辑或新增
export const rolePostOrPut = <T>(data: IRole) => {
  return data.id ? http.put<T>(`/role/${data.id}`, data) : http.post<T>('/role', data);
};

// 公司 - 列表
export const getCompanyList = <T>() => http.get<T>('/company');
// 公司 - 编辑/新增
export const companyPutOrPost = <T>(data: ICompany) => {
  return data.id ? http.put<T>(`/company/${data.id}`, data) : http.post<T>('/company', data);
};

// 员工 - 列表
export const getAdminerList = <T>() => http.get<T>('/adminer');
// 员工 - 编辑/新增
export const adminerPutOrPost = <T>(data: ICompany) => {
  return data.id ? http.patch<T>(`/adminer/${data.id}`, data) : http.post<T>('/adminer', data);
};

// 权限 - 列表
export const getPermissionList = <T>() => {
  return http.get<T>('/permission');
};
// 权限 - 编辑或新增
export const PermissionPostOrPut = <T>(data: IRole) => {
  return data.id ? http.put<T>(`/permission/${data.id}`, data) : http.post<T>('/permission', data);
};
// 权限 - 删除
export const PermissionRemove = (id: number) => http.delete(`/permission/${id}`);
