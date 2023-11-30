<template>
  <section class="m-20">
    <ul class="bg-white p-20 mb-20">
      <li class="li">
        <a-space class="li-left">店铺名称：{{ contract?.name }}</a-space>
        <a-space>
          <span>所属项目：</span>
          <span style="color: red">{{ userStore.company?.fname }}</span>
        </a-space>
      </li>
      <li class="li">
        <a-space class="li-left">合同编号：{{ contract?.bianma }}</a-space>
        <a-space>
          <span>入驻门店：</span>
          <a-tag v-for="item in contract?.oldRooms.split(',')" :key="item" color="purple" size="small">{{ item }}</a-tag>
        </a-space>
      </li>
      <li class="li">
        <a-space class="li-left">
          开始时间:<a-tag size="small">{{ contract?.startTime }}</a-tag>
        </a-space>
        <a-space class="li-left">
          结束时间：<a-tag size="small">{{ contract?.endTime }}</a-tag>
        </a-space>
      </li>
    </ul>
    <section class="bg-white p-20 mb-20">房间内页</section>
    <section class="mb-20 flex">
      <section class="p-20 bg-white" style="flex: 1">
        <section class="mb-10">物业费</section>
        <a-table :columns="columns" :data="data" />
      </section>
      <section class="p-20 bg-white" style="flex: 1">
        <section class="mb-10">杂费</section>
        <a-table :columns="columns" :data="data" />
      </section>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import { contractOne } from '@/api/caiwu';
import type { IContract } from '@/types/caiwu';
const route = useRoute();
const userStore = useUserStore();

const contract = ref<IContract>();

const contractId = ref(0);
const getContract = async () => {
  contract.value = await contractOne(contractId.value);
  console.log(contract.value);
};
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];
const data = reactive([
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com',
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com',
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com',
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com',
  },
]);

onMounted(() => {
  contractId.value = Number.parseInt(`${route.params.id}`, 10);
  getContract();
});
</script>

<style lang="less" scoped>
.li {
  display: flex;
  margin-bottom: 15px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &-left {
    flex-basis: 400px;
  }
}
</style>
