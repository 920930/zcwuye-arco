import http from '@/utils/http';
// 商户 - 列表
export const userList = <T>(page = 1, size = 10) => http.get<T>(`user?page=${page}&size=${size}`);
// 商户 - 编辑或新增
export const userPostOrPut = <T>(data: any) => {
  return data.id ? http.patch<T>(`/user/${data.id}`, data) : http.post<T>('/user', data);
};
