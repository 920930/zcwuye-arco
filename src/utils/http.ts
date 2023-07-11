import axios, { AxiosRequestConfig } from 'axios';
import { Message } from '@arco-design/web-vue';
import { getToken, setToken, clearToken } from './auth';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 3000,
});
// 1.添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = getToken();
    if (token && config.headers) config.headers.Authorization = token;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 2.添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.headers.authorization) {
      setToken(response.headers.authorization);
    }
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    const { data } = error.response;
    // 对响应错误做点什么
    if (error.response.status === 401) {
      clearToken();
    }
    if (error.response.status === 400 || error.response.status === 403) {
      if (Array.isArray(data.message)) Message.error(data.message[0]);
      else Message.error(data.message);
    }
    return Promise.reject(error);
  }
);
type TMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
const http = async <T>(method: TMethod, url: string, params?: any, config?: AxiosRequestConfig | boolean) => {
  let res = { params };
  if (typeof config !== 'boolean') res = { params, ...config };
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<T>(async (resolve, reject) => {
    try {
      if (method === 'get') {
        const { data } = await instance.get<T>(url, res);
        resolve(data);
      }
      if (method === 'delete') {
        const { data } = await instance.delete<T>(url, res);
        resolve(data);
      }
      if (method === 'put' || method === 'patch' || method === 'post') {
        const { data } = await instance[method]<T>(url, params, res);
        resolve(data);
      }
    } catch (error) {
      if (typeof config === 'boolean' && config) reject(error);
    }
  });
};

http.get = <T>(url: string, params?: any, config?: AxiosRequestConfig | boolean) => http<T>('get', url, params, config);
http.post = <T>(url: string, body?: any, config?: AxiosRequestConfig | boolean) => http<T>('post', url, body, config);
http.put = <T>(url: string, body?: any, config?: AxiosRequestConfig | boolean) => http<T>('put', url, body, config);
http.patch = <T>(url: string, body?: any, config?: AxiosRequestConfig | boolean) => http<T>('patch', url, body, config);
http.delete = <T>(url: string, config?: AxiosRequestConfig | boolean) => http<T>('delete', url, config);

export default http;
