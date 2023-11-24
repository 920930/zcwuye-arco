<template>
  <section class="m-20">
    <section class="top">
      <a-button type="primary" @click="storeBtn(0)">新增</a-button>
      <a-space>
        <a-input v-model="search.name" placeholder="请输入用户名" />
        <a-input v-model="search.phone" placeholder="请输入用户手机号" />
        <a-button type="primary" @click="searchBtn">搜索</a-button>
        <a-button @click="searchReset">重置</a-button>
      </a-space>
    </section>
    <a-table :data="data.data" column-resizable :bordered="{ cell: true }" :pagination="{ total: data.count, showTotal: true, current: search.currentPage }" @page-change="pageChange">
      <template #columns>
        <!-- <a-table-column title="ID" data-index="id" /> -->
        <a-table-column title="合同编码" data-index="bianma" />
        <a-table-column title="铺面" data-index="oldRooms" />
        <a-table-column title="铺面名" data-index="name" />
        <a-table-column title="老板" data-index="user.name" />
        <a-table-column title="手机号" data-index="user.phone" />
        <a-table-column title="合同开始时间" data-index="startTime" />
        <a-table-column title="合同结束时间" data-index="endTime" />
        <a-table-column title="状态" data-index="state">
          <template #cell="{ record }">
            <a-tag :color="timeToMis(record.endTime, record.oldRooms).color" bordered>{{ timeToMis(record.endTime, record.oldRooms).str }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="set" :width="200">
          <template #cell="{ record }">
            <a-space wrap>
              <a-button type="primary" size="small" @click="storeBtn(record.id)">编辑</a-button>
              <a-button type="primary" size="small" status="danger">删除</a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </section>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { contractList } from '@/api/caiwu';
// import { debounce } from '@/utils/caiwu';
import type { IUser } from '@/store/modules/app/types';
import { useCompanyStore } from '@/store';

const router = useRouter();
const companyStore = useCompanyStore();
const search = reactive({
  currentPage: 1,
  name: '',
  phone: '',
});
const data = reactive<{ count: number; data: IUser[] }>({
  count: 0,
  data: [],
});
const getContractList = async (searchValue = '', page = 1, size = 10) => {
  const [ret, count] = await contractList<[IUser[], number]>(companyStore.company.id ?? 0, page, size);
  data.count = count;
  data.data = ret;
};
getContractList();

const storeBtn = (id = 0) => router.push({ name: 'contractStore', params: { id } });

// 分页加载
const pageChange = (page: number) => {
  search.currentPage = page;
  getContractList('', page);
};
// 关键词搜查
const searchBtn = () => {
  const str = new URLSearchParams();
  if (search.name.length) str.append('name', search.name);
  if (search.phone.length) str.append('phone', search.phone);
  if (str.size > 0) {
    search.currentPage = 1;
    getContractList(str.toString(), 1);
  }
};
const searchReset = () => {
  search.currentPage = 1;
  if (search.name.length || search.phone.length) {
    getContractList();
  }
  search.name = '';
  search.phone = '';
};
// 日期转毫秒
const timeToMis = (t: string, room = '') => {
  let str = '正常';
  let color = 'green';
  const day = 24 * 60 * 60 * 1000;
  const time = new Date(t).getTime();
  const now = Date.now();
  const sm = time - now;
  if (room && room.length) {
    if (sm <= 0) {
      str = '合同过期';
      color = '#86909c';
    } else if (sm / day <= 30) {
      str = '合同30天内到期';
    } else if (sm / day <= 20) {
      str = '合同20天内到期';
    } else if (sm / day <= 10) {
      str = '合同10天内到期';
    } else if (sm / day <= 5) {
      str = '合同5天内到期';
    } else if (sm / day <= 3) {
      str = '合同3天内到期';
    }
  } else {
    str = '合同关闭';
    color = 'gray';
  }
  return { str, color };
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
}
</style>
