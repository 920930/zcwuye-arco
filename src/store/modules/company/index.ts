import { defineStore } from 'pinia';
import { getCompanyList } from '@/api/user';
import type { ICompany } from './types';

const useCompanyStore = defineStore('company', {
  state: (): { companies: ICompany[]; company: ICompany } => ({
    companies: [],
    company: {
      id: undefined,
      name: undefined,
      dong: undefined,
      qu: undefined,
      qutype: undefined,
      qulen: undefined, // 区增量长度(例 字母数字3 则最多 A3 B3)默认0
      state: true,
    },
  }),
  actions: {
    setCompany(id: number | undefined) {
      const one = this.companies.find((item) => item.id === id);
      if (one) this.company = one;
    },
    async setCompanise() {
      this.companies = await getCompanyList<ICompany[]>();
    },
  },
});

export default useCompanyStore;
