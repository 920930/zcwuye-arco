import http from '@/utils/http';
// 商户 - 列表
export const userList = <T>() => http.get<T>(`user`);
// 商户 - 编辑或新增
export const userPostOrPut = <T>(data: any) => {
  return data.id ? http.patch<T>(`/user/${data.id}`, data) : http.post<T>('/user', data);
};
