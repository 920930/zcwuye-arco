<template>
  <section>
    <section class="m-20 container">
      <section>
        <a-button type="primary" @click="info.visible = true">新增</a-button>
      </section>
      <section v-for="(room, i) in rooms" :key="i">
        <h3>{{ i }}</h3>
        <section class="list">
          <Item v-for="v in room" :key="v.id" :room="v" @edit-fn="editFn" @del-fn="delFn" />
        </section>
      </section>
    </section>

    <Edit :model-value="info.visible" :room="info.room" @update:model-value="updateModelValue" />
  </section>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useCompanyStore } from '@/store';
import { roomList, roomDel } from '@/api/caiwu';
import type { IRoom } from '@/utils/caiwu';
import { roomToTree } from '@/utils/caiwu';
import Item from './item.vue';
import Edit from './edit.vue';

const info = reactive<{ visible: boolean; room: IRoom | undefined }>({
  visible: false,
  room: undefined,
});
const rooms = ref<{ [key: string]: IRoom[] }>({});
const companyStore = useCompanyStore();
const getRoomList = async () => {
  const data = await roomList<IRoom[]>(companyStore.company.id ?? 0);
  rooms.value = roomToTree(data, companyStore.company);
};
getRoomList();

const updateModelValue = () => {
  info.visible = false;
  info.room = undefined;
  getRoomList();
};
// 查询要更新房间的数据
const editFn = (id: number) => {
  info.visible = true;
  Object.values(rooms.value).forEach((item) => {
    const val = item.find((v) => v.id === id);
    if (val) info.room = val;
  });
};

const delFn = async (id: number) => {
  await roomDel(id);
  getRoomList();
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding: 20px;
  background-color: white;

  .list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 769px) {
    .list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
