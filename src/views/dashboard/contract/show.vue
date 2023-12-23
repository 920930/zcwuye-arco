<template>
  <section class="m-20">
    <ul class="bg-white p-20 mb-20" style="display: flex; gap: 20px; justify-content: space-between">
      <section style="flex: 1">
        <li class="li">
          <a-space class="li-left">
            <span class="bold">店铺名称：</span><span class="gray">{{ contract?.name }}</span>
          </a-space>
          <a-space class="li-left">
            <span class="bold">所属项目：</span>
            <span style="color: red">{{ userStore.company?.fname }}</span>
          </a-space>
        </li>
        <li class="li">
          <a-space class="li-left">
            <span class="bold">合同编号：</span><span class="gray">{{ contract?.bianma }}</span>
          </a-space>
          <a-space>
            <span class="bold">入驻门店：</span>
            <a-tag v-for="item in contract?.oldRooms.split(',')" :key="item" color="purple" size="small">{{ item }}</a-tag>
          </a-space>
        </li>
        <a-divider orientation="left"><icon-star /></a-divider>
        <li class="li">
          <a-space class="li-left">
            <span class="bold">开始时间：</span><span class="gray">{{ contract?.startTime }}</span>
          </a-space>
        </li>
        <li class="li">
          <a-space class="li-left">
            <span class="bold">结束时间：</span><span class="gray">{{ contract?.endTime }}</span>
          </a-space>
        </li>
        <a-divider orientation="left"><icon-star /></a-divider>
        <li class="li">
          <a-space class="li-left">
            <span class="bold">租赁面积：</span><span class="gray">{{ contract?.area }} ㎡</span>
          </a-space>
          <a-space>
            <span class="bold">租赁总额：</span><span class="gray">{{ contract ? contract.area * contract.price : 0 }}元</span>
          </a-space>
        </li>
        <li class="li">
          <a-space class="li-left">
            <span class="bold">租赁单价：</span><span class="gray">{{ contract?.price }} 元/㎡</span>
          </a-space>
        </li>
        <li class="li">
          <router-link :to="{ name: 'contractStore', params: { id: contract?.id } }">编辑</router-link>
        </li>
      </section>
      <a-carousel auto-play :style="{ width: '600px' }">
        <a-carousel-item v-for="image in contract?.yyzz" :key="image"> <img :src="image" :style="{ width: '100%' }" /> </a-carousel-item>
      </a-carousel>
    </ul>
    <ul class="bg-white p-20 mb-20">
      <li class="li">
        <a-space class="li-left">老板姓名：{{ contract?.user?.name }}</a-space>
        <a-space class="li-left">
          <span>老板手机：</span>
          <span style="color: red">{{ contract?.user?.phone }}</span>
        </a-space>
        <a-space>身份证：{{ contract?.user?.card }}</a-space>
      </li>
    </ul>
    <ConList />
    <Cost :contract="contract" />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import { contractOne } from '@/api/caiwu';
import type { IContract } from '@/types/caiwu';
import ConList from './components/ConList.vue';
import Cost from './components/Cost.vue';

const route = useRoute();
const userStore = useUserStore();

const contract = ref<IContract>();
const getContract = async (id: number) => {
  contract.value = await contractOne(id);
};
const images = [
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
];
onMounted(() => {
  getContract(+`${route.params.id}`);
});
</script>

<style lang="less" scoped>
.real {
  position: relative;
  height: 240;
}

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

.gray {
  color: #666;
}

.bold {
  font-weight: bold;
}
</style>
