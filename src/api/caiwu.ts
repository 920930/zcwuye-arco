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

// 商铺 - 列表
export const roomList = <T>(companyId: number) => http.get<T>(`/room?companyId=${companyId}`);
// 商铺 - 编辑或新增
export const roomPostOrPut = <T>(data: any) => {
  return data.id ? http.patch<T>(`/room/${data.id}`, data) : http.post<T>('/room', data);
};
// 商铺 - 删除
export const roomDel = <T>(id: number) => http.delete<T>(`/room/${id}`);
