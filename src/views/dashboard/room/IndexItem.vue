<template>
  <section class="item">
    <section class="item-top">
      <section class="item-top-left">
        <icon-home style="margin-right: 5px" />
        <span>{{ dongqunum }}</span>
      </section>
      <a-tag color="orange">
        <template #icon><icon-face-meh-fill /></template>
        即将到期
      </a-tag>
      <a-tag color="red">
        <template #icon><icon-face-frown-fill /></template>
        已经到期
      </a-tag>
      <!-- <a-tag color="green">
        <template #icon><icon-face-smile-fill /></template>
        正常
      </a-tag> -->
    </section>
    <span class="item-time">合同到期时间：2023-10-19</span>
    <section class="item-list">
      <span>商户: 张三</span>
      <span>手机: 18081990075</span>
      <span>交租日期: 2023-09-15</span>
      <span>金额: 80789.36元/月 </span>
    </section>
    <a-tag color="orangered">
      <template #icon><icon-github /></template>
      请续租
    </a-tag>
    <section style="position: absolute; right: 10px; bottom: 10px">
      <a-space>
        <a-popconfirm content="确定要删除吗？" type="warning" @ok="$emit('delFn', room.id)">
          <a-button type="dashed" size="small">删除</a-button>
        </a-popconfirm>

        <a-button type="dashed" status="warning" size="small" @click="$emit('editFn', room.id)">编辑</a-button>
        <a-button v-if="props.room.contract?.id" type="dashed" status="success" size="small" @click="navigatorFn">进入</a-button>
      </a-space>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { IRoom } from '@/utils/caiwu';
import { useRouter } from 'vue-router';

const props = defineProps<{ room: IRoom }>();
defineEmits<{
  (e: 'editFn', id: number): void;
  (e: 'delFn', id: number): void;
}>();
// defineEmits<{
//   editFn: [id: number];
//   delFn: [id: number];
// }>();
const router = useRouter();
const dongqunum = computed(() => {
  return `${props.room.dong ? `${props.room.dong}栋` : ''}${props.room.qu.includes('0') ? '' : props.room.qu}${props.room.num}`;
});

const navigatorFn = () => {
  router.push({ name: 'contractShow', params: { id: props.room.contract?.id || 0 } });
};
</script>

<style lang="less" scoped>
.item {
  position: relative;
  height: 200px;
  padding: 10px 8px;
  color: rgb(0 0 0 / 50%);
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    transform: translateY(-7px);
    cursor: pointer;
  }

  &-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    &-left {
      display: flex;
      align-items: center;
      color: black;
      font-size: 16px;
    }
  }

  &-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 12px;
  }
}
</style>
