import { defineStore } from 'pinia';
import { login as userLogin, logout as userLogout, getUserInfo, LoginData } from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';
import useCompanyStore from '../company';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    avatar: undefined,
    job: undefined,
    companies: [],
    companyId: undefined,
    introduction: undefined,
    phone: undefined,
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
    async setInfo(partial: Partial<UserState>) {
      const companyStore = useCompanyStore();
      await companyStore.setCompanise();
      const { companies } = partial;
      const companyId = companies ? companies[0].id : undefined;
      companyStore.setCompany(companyId);
      const ret = { ...partial, companyId };
      this.$patch(ret);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      await this.setInfo(res);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const token = await userLogin(loginForm);
        setToken(token);
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
