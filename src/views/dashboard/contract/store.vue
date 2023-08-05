<template>
  <section class="m-20 bg">
    <h2 class="bg-title">{{ companyStore.company.name }}合同 {{ id ? '编辑' : '新增' }}</h2>
    <a-form ref="formRef" :model="form" @submit="handleSubmit">
      <a-form-item v-show="false" field="id" label="Id" tooltip="Please enter username">
        <a-input-number v-model="form.id" placeholder="please enter your username..." />
      </a-form-item>
      <a-form-item field="id" label="商铺" tooltip="如果没有，请在商铺列表新增" :rules="[{ required: true, message: '请选择商铺' }]">
        <a-tree-select v-model="form.rooms" :allow-search="true" :allow-clear="true" :tree-checkable="true" tree-checked-strategy="child" :tree-check-strictly="treeCheckStrictly" :data="rooms" placeholder="请选择商铺" />
      </a-form-item>
      <a-form-item field="name" label="商铺名称" tooltip="请输入商铺名称">
        <a-input v-model="form.name" placeholder="请输入商铺名称（暂无请填写老板姓名）" />
      </a-form-item>
      <a-form-item field="phone" label="门店座机/手机" tooltip="请输入门店座机/手机">
        <a-input v-model="form.phone" placeholder="请输入门店座机/手机" />
      </a-form-item>
      <a-form-item field="userId" label="签约老板" tooltip="没有请在商户列表 新增商户" :rules="[{ required: true, message: '请选择老板' }]">
        <a-select v-model="form.userId" :options="userOptions" placeholder="通过手机或姓名搜索老板" allow-search allow-clear @search="searchUser" />
      </a-form-item>
      <a-form-item field="yyzz" label="营业执照" tooltip="营业执照">
        <a-upload ref="uploadRef" v-model="form.yyzz" :limit="1" :auto-upload="false" :custom-request="customRequest" />
      </a-form-item>
      <a-form-item field="startTime" label="合同开始时间" tooltip="合同开始到结束的时间" :rules="[{ required: true, message: '请选择合同时间范围' }]">
        <a-date-picker v-model="form.startTime" style="width: 60%" />
      </a-form-item>
      <a-form-item field="endTime" label="合同结束时间" tooltip="合同开始到结束的时间" :rules="[{ required: true, message: '请选择合同时间范围' }]">
        <a-date-picker v-model="form.endTime" style="width: 60%" />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary" :disabled="btnDisabled">提交</a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useCompanyStore } from '@/store';
import { contractOne, roomList, userSearch, contractPostOrPut } from '@/api/caiwu';
import { contractRoomToTree } from '@/utils/caiwu';
import type { IRoom, ITrees } from '@/utils/caiwu';
import type { IUser } from '@/store/modules/app/types';
import { Message } from '@arco-design/web-vue';

const route = useRoute();
const companyStore = useCompanyStore();
const id = +(route.params.id as string) || 0;

const rooms = ref<ITrees[]>();
const treeCheckStrictly = ref(false);
const userOptions = ref<{ label: string; value: string }[]>([]);
const btnDisabled = ref(false);
const formValues = ref<any>();
const uploadRef = ref();
const formRef = ref();
const form = reactive({
  id,
  rooms: [],
  name: '',
  phone: '',
  userId: '',
  startTime: '',
  endTime: '',
  yyzz: [],
});

const getOne = async () => {
  const data = await roomList<IRoom[]>(companyStore.company.id ?? 0);
  rooms.value = contractRoomToTree(data, companyStore.company);
  if (id) {
    await contractOne(id);
  }
};
getOne();

const searchUser = async (val: string) => {
  if (val.length > 1) {
    const data = await userSearch<IUser[]>(val);
    userOptions.value = data.map((item) => ({ label: `${item.name} - ${item.phone}`, value: `${item.id}` }));
  } else {
    userOptions.value = [];
  }
};

const handleSubmit = (val: any) => {
  const { errors, values } = val;
  if (errors) return;
  if (values.rooms.length === 0) {
    Message.warning('请勾选店铺');
    return;
  }
  formValues.value = values;
  uploadRef.value.submit();
};

const customRequest = (option: any) => {
  btnDisabled.value = true;
  const { fileItem, name: fileName } = option;
  const formDate = new FormData();
  formDate.set('id', formValues.value.id);
  formDate.set('rooms', formValues.value.rooms);
  formDate.set('name', formValues.value.name);
  formDate.set('phone', formValues.value.phone);
  formDate.set('userId', formValues.value.userId);
  formDate.set('startTime', formValues.value.startTime);
  formDate.set('endTime', formValues.value.endTime);
  formDate.set(fileName || 'files', fileItem);
  contractPostOrPut(formDate).then(() => {
    Message.success('创建成功');
    formValues.value = null;
    btnDisabled.value = false;
  });
  return {};
};
</script>

<style lang="less" scoped>
.bg {
  padding: 15px 0;
  padding-right: 60px;
  padding-left: 0;
  background-color: white;

  &-title {
    text-align: center;
  }
}
</style>
