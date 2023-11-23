<template>
  <section class="m-20">
    <section class="bg-white p-20 mb-20">房间内页</section>
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
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const room = reactive({
  id: 0,
  contractId: 0,
});
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
  const id = `${route.params.id}`;
  const cid = `${route.params.cid}`;
  room.id = Number.parseInt(id, 10);
  room.contractId = Number.parseInt(cid, 10);
});
</script>

<style lang="scss" scoped></style>
