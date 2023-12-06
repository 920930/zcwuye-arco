import { defineStore } from 'pinia';
import { login as userLogin, logout as userLogout, getUserInfo, LoginData } from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
// import { useStorageAsync } from '@vueuse/core';
import { type UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    avatar: undefined,
    job: undefined,
    companies: [],
    company: undefined,
    introduction: undefined,
    phone: undefined,
    card: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      // const companyStore = useCompanyStore();
      const { companies } = partial;
      // const companyId = companies ? companies[0].id : undefined;
      // companyStore.setCompany(companyId);
      const company = companies?.[0];
      // companyInfo.value = useStorageAsync('company', company);
      const ret = { ...partial, company };
      this.$patch(ret);
    },

    setCompany(id: number) {
      const company = this.companies.find((item) => item.id === id);
      // companyInfo.value = company;
      this.$patch({ company });
    },
    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
