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
// 商户 - 搜索
export const userSearch = <T>(str: string) => http.get<T>(`/user/search?val=${str}`);
// ====================
// ====================
// 商铺 - 列表
export const roomList = <T>(companyId: number) => http.get<T>(`/room?companyId=${companyId}`);
// 商铺 - 编辑或新增
export const roomPostOrPut = <T>(data: any) => {
  return data.id ? http.patch<T>(`/room/${data.id}`, data) : http.post<T>('/room', data);
};
// 商铺 - 内页
export const roomShow = <T>(id: number, cid = 0) => http.get<T>(`/room/${id}?cid=${cid}`);
// 商铺 - 删除
export const roomDel = <T>(id: number) => http.delete<T>(`/room/${id}`);
// ====================
// ====================
// 合同 - 列表
export const contractList = <T>(str = '') => http.get<T>(`/contract?${str}`);
// 合同 - 单个
export const contractOne = <T>(id: number) => http.get<T>(`/contract/${id}`);
// 合同 - 编辑或新增
export const contractPostOrPut = <T>(data: FormData) => {
  const id = data.get('id');
  return id !== '0' ? http.patch<T>(`/contract/${id}`, data, { headers: { 'content-type': 'multipart/form-data' } }) : http.post<T>('/contract', data, { headers: { 'content-type': 'multipart/form-data' } });
};
// 合同 - 删除
export const contractDel = <T>(id: number) => http.delete<T>(`/contract/${id}`);
// ====================
// ====================
// 图片删除
export const delImg = (id: number, img?: string) => http.delete(`/contract/img?id=${id}&img=${img}`);

// 合同下级分类 续签合同
export const conLists = <T>(cid: number, page = 1, size = 20) => http.get<T>(`/conlist?contractId=${cid}&page=${page}&size=${size}`);
export const conListPostOrPut = <T>(data: any) => {
  return data.id ? http.patch<T>(`/conlist/${data.id}`, data) : http.post<T>('/conlist', data);
};
export const conListDel = (id: number) => http.delete(`/conlist/${id}`);
