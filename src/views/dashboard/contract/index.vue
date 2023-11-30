<template>
  <section class="m-20">
    <section class="top">
      <a-button type="primary" @click="() => storeBtn()">新增</a-button>
      <a-space>
        <a-input v-model.trim="search.username" placeholder="请输入负责人" />
        <a-input v-model.trim="search.userphone" placeholder="请输入手机号" />
        <a-input v-model.trim="search.name" placeholder="请输入店铺名称" />
        <a-button type="primary" @click="searchBtn(1)">搜索</a-button>
        <a-button @click="searchReset">重置</a-button>
      </a-space>
    </section>
    <a-table :data="data.datas" column-resizable :bordered="{ cell: true }" :pagination="{ total: data.count, showTotal: true, current: search.page, pageSize: search.size }" @page-change="pageChange">
      <template #columns>
        <a-table-column title="合同编码" data-index="bianma" />
        <a-table-column title="门店名称" data-index="name" />
        <a-table-column title="负责人" data-index="user.name" />
        <a-table-column title="手机号" data-index="user.phone" />
        <a-table-column title="商铺">
          <template #cell="{ record }">
            <a-space v-if="record.oldRooms" wrap>
              <a-tag v-for="(rom, index) of record.oldRooms.split(',')" :key="index" :color="record.state ? 'blue' : 'gray'" bordered>
                {{ rom }}
              </a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="合同开始时间" data-index="startTime" />
        <a-table-column title="合同结束时间" data-index="endTime" />
        <a-table-column title="合同状态">
          <template #cell="{ record }">
            <a-space v-if="record.state" wrap>
              <a-tag :color="timeFn(record).color" bordered>
                {{ timeFn(record).str }}
              </a-tag>
            </a-space>
            <a-space v-else wrap>
              <a-tag color="gray" bordered>合同关闭</a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="set" :width="200">
          <template #cell="{ record }">
            <a-space wrap>
              <a-button type="primary" size="mini" @click="editBtn(record)">编辑</a-button>
              <a-button type="primary" size="mini" status="danger">删除</a-button>
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
import { useUserStore } from '@/store';
import type { IContract } from '@/types/caiwu';

const router = useRouter();
const userStore = useUserStore();
const search = reactive({
  page: 1,
  size: 2,
  name: '',
  username: '',
  userphone: '',
});

const data = reactive<{ count: number; datas: IContract[] }>({
  count: 0,
  datas: [],
});
const getAdminer = async (str: string) => {
  // str格式实际如：page=1&companyId=2&hasRooms=1
  const [ret, count] = await contractList<[IContract[], number]>(str);
  data.count = count;
  data.datas = ret;
};

// 关键词搜查
const searchBtn = (page = 1) => {
  search.page = page;
  const str = new URLSearchParams();
  str.append('page', `${search.page}`);
  str.append('size', `${search.size}`);
  str.append('companyId', `${userStore.company?.id ?? 1}`);
  if (search.name.length) str.append('name', search.name);
  if (search.username.length) str.append('username', search.username);
  if (search.userphone.length) str.append('phone', search.userphone);
  getAdminer(str.toString());
};
// 这里可以初始加载，也可以搜索加载
searchBtn();

const storeBtn = (id = 0) => {
  router.push({ name: 'contractStore', params: { id } });
};
const editBtn = (record: any) => {
  router.push({ name: 'contractStore', params: { id: record.id } });
};
// 分页加载
const pageChange = (num: number) => searchBtn(num);
// 搜索重置
const searchReset = () => {
  search.name = '';
  search.username = '';
  search.userphone = '';
  searchBtn();
};

const timeFn = (item: any) => {
  const end = new Date(item.endTime).getTime();
  const day = 24 * 60 * 60 * 1000;
  const ct = end - Date.now();
  let str = '合同正常';
  let color = 'gray';
  if (!item.state) {
    return {
      str: '合同关闭',
      color: 'gray',
    };
  }
  if (ct > day * 20) {
    color = 'blue';
    str = '合同正常';
  } else if (ct <= day * 20 && ct > day * 19) {
    color = 'gold';
    str = '20天内到期';
  } else if (ct <= day * 19 && ct > day * 18) {
    color = 'gold';
    str = '19天内到期';
  } else if (ct <= day * 18 && ct > day * 17) {
    color = 'gold';
    str = '18天内到期';
  } else if (ct <= day * 17 && ct > day * 16) {
    color = 'gold';
    str = '17天内到期';
  } else if (ct <= day * 16 && ct > day * 15) {
    color = 'gold';
    str = '16天内到期';
  } else if (ct <= day * 15 && ct > day * 14) {
    color = 'orange';
    str = '15天内到期';
  } else if (ct <= day * 14 && ct > day * 13) {
    color = 'orange';
    str = '14天内到期';
  } else if (ct <= day * 13 && ct > day * 12) {
    color = 'orange';
    str = '13天内到期';
  } else if (ct <= day * 12 && ct > day * 11) {
    color = 'orange';
    str = '12天内到期';
  } else if (ct <= day * 11 && ct > day * 10) {
    color = 'orange';
    str = '11天内到期';
  } else if (ct <= day * 10 && ct > day * 9) {
    color = 'orange';
    str = '10天内到期';
  } else if (ct <= day * 9 && ct > day * 8) {
    color = 'orangered';
    str = '9天内到期';
  } else if (ct <= day * 8 && ct > day * 7) {
    color = 'orangered';
    str = '8天内到期';
  } else if (ct <= day * 7 && ct > day * 6) {
    color = 'orangered';
    str = '7天内到期';
  } else if (ct <= day * 6 && ct > day * 5) {
    color = 'orangered';
    str = '6天内到期';
  } else if (ct <= day * 5 && ct > day * 4) {
    color = 'red';
    str = '5天内到期';
  } else if (ct <= day * 4 && ct > day * 3) {
    color = 'red';
    str = '4天内到期';
  } else if (ct <= day * 3 && ct > day * 2) {
    color = 'red';
    str = '3天内到期';
  } else if (ct <= day * 2 && ct > day * 1) {
    color = 'magenta';
    str = '2天内到期';
  } else if (ct <= day * 1 && ct > day * 0.5) {
    color = 'magenta';
    str = '1天内到期';
  } else {
    color = 'magenta';
    str = '已过期';
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
