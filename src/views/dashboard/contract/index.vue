<template>
  <section class="m-20">
    <section class="top">
      <a-button type="primary" @click="() => storeBtn()">新增</a-button>
      <a-space>
        <a-input v-model="search.phone" placeholder="请输入合同编码" />
        <a-input v-model="search.name" placeholder="请输入店铺名称" />
        <a-input v-model="search.name" placeholder="请输入店铺名称" />
        <a-input v-model="search.name" placeholder="请输入店铺名称" />
        <a-button type="primary" @click="searchBtn">搜索</a-button>
        <a-button @click="searchReset">重置</a-button>
      </a-space>
    </section>
    <a-table :data="data.data" column-resizable :bordered="{ cell: true }" :pagination="{ total: data.count, showTotal: true, current: search.currentPage }" @page-change="pageChange">
      <template #columns>
        <a-table-column title="合同编码" data-index="bianma" />
        <a-table-column title="门店名称" data-index="name" />
        <a-table-column title="负责人" data-index="user.name" />
        <a-table-column title="手机号" data-index="user.phone" />
        <a-table-column title="项目" data-index="company.name" />
        <a-table-column title="商铺">
          <template #cell="{ record }">
            <a-space wrap>
              <a-tag v-for="(rom, index) of record.oldRooms.split(',')" :key="index" color="blue" bordered>
                {{ rom }}
              </a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="合同开始时间" data-index="startTime" />
        <a-table-column title="合同结束时间" data-index="endTime" />
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { contractList } from '@/api/caiwu';
import { useUserStore } from '@/store';
import type { IContract } from '@/types/caiwu';

const router = useRouter();
const userStore = useUserStore();
const search = reactive({
  currentPage: 1,
  name: '',
  phone: '',
});

const data = reactive<{ count: number; data: IContract[] }>({
  count: 0,
  data: [],
});
const getAdminer = async (str = '', page = 1, size = 10) => {
  const [ret, count] = await contractList<[IContract[], number]>(userStore.company?.id ?? 1, page, size);
  data.count = count;
  data.data = ret;
};
getAdminer();

const storeBtn = (id = 0) => {
  router.push({ name: 'contractStore', params: { id } });
};
const editBtn = (record: any) => {
  router.push({ name: 'contractStore', params: { id: record.id } });
};

// 分页加载
const pageChange = (page: number) => {
  search.currentPage = page;
  getAdminer('', page);
};
// 关键词搜查
const searchBtn = () => {
  const str = new URLSearchParams();
  if (search.name.length) str.append('name', search.name);
  if (search.phone.length) str.append('phone', search.phone);
  // @ts-ignore
  if (str.size > 0) {
    search.currentPage = 1;
    getAdminer(str.toString(), 1);
  }
};
const searchReset = () => {
  search.currentPage = 1;
  if (search.name.length || search.phone.length) {
    getAdminer();
  }
  search.name = '';
  search.phone = '';
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
