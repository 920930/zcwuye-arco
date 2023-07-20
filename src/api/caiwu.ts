import http from '@/utils/http';
// 商户 - 列表
export const userList = <T>(str: string, page = 1, size = 10) => {
  const ret = new URLSearchParams(str);
  ret.append('page', `${page}`);
  ret.append('size', `${size}`);
  return http.get<T>(`user?${ret.toString()}`);
};
// 商户 - 编辑或新增
export const userPostOrPut = <T>(data: any) => {
  return data.id ? http.patch<T>(`/user/${data.id}`, data) : http.post<T>('/user', data);
};
