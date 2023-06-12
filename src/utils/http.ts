import axios, { AxiosRequestConfig } from 'axios';
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
    // 对响应错误做点什么
    if (error.response.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);
type TMethod = 'get' | 'post' | 'put' | 'delete';
const http = async <T>(method: TMethod, url: string, params?: any, config?: AxiosRequestConfig) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<T>(async (resolve) => {
    try {
      if (method === 'get') {
        const { data } = await instance.get<T>(url, { params, ...config });
        resolve(data);
      }
      if (method === 'delete') {
        const { data } = await instance.delete<T>(url, config);
        resolve(data);
      }
      if (method === 'put' || method === 'post') {
        const { data } = await instance[method]<T>(url, params, config);
        resolve(data);
      }
    } catch (error) {
      // reject(error);
    }
  });
};

http.get = <T>(url: string, params?: any, config?: AxiosRequestConfig) => http<T>('get', url, params, config);
http.post = <T>(url: string, body?: any, config?: AxiosRequestConfig) => http<T>('post', url, body, config);
http.put = <T>(url: string, body?: any, config?: AxiosRequestConfig) => http<T>('put', url, body, config);
http.delete = <T>(url: string, config?: AxiosRequestConfig) => http<T>('delete', url, config);

export default http;
