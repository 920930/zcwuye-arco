import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useCompanyStore from './modules/company';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useCompanyStore };
export default pinia;
