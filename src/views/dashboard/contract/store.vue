<template>
  <section class="m-20 bg">
    <h2 class="bg-title">{{ userStore.company?.name }}合同 {{ id ? '编辑' : '新增' }}</h2>
    <h3 class="bg-ftitle">{{ userStore.company?.fname }}</h3>
    <a-form ref="formRef" :model="form" @submit="handleSubmit">
      <a-form-item v-show="false" field="id" label="Id" tooltip="Please enter username">
        <a-input-number v-model="form.id" placeholder="please enter your username..." />
      </a-form-item>
      <a-form-item field="rooms" label="商铺" tooltip="如果没有，请在商铺列表新增">
        <a-tree-select v-model="form.rooms" :allow-search="true" :allow-clear="true" :tree-checkable="true" tree-checked-strategy="child" :tree-check-strictly="treeCheckStrictly" :data="rooms" placeholder="请选择商铺" />
      </a-form-item>
      <a-form-item field="bianma" label="合同编号" tooltip="请输入合同编号" :rules="[{ required: true, message: '商铺名称不能为空' }]">
        <a-input v-model="form.bianma" placeholder="请输入合同编号（自生成可修改）" />
      </a-form-item>
      <a-form-item field="name" label="商铺名称" tooltip="请输入商铺名称" :rules="[{ required: true, message: '商铺名称不能为空' }]">
        <a-input v-model="form.name" placeholder="请输入商铺名称（暂无请填写老板姓名）" />
      </a-form-item>
      <a-form-item field="area" label="总面积" tooltip="请输入租赁总面积" :rules="[{ required: true, message: '商铺名称不能为空' }]">
        <a-input-number v-model="form.area" placeholder="请输入租赁总面积，含公摊" />
      </a-form-item>
      <a-form-item field="price" label="租金单价" tooltip="请输入商铺租金单价" :rules="[{ required: true, message: '商铺名称不能为空' }]">
        <a-input-number v-model="form.price" placeholder="商铺租金单价 多少元/㎡" />
      </a-form-item>
      <a-form-item field="userId" label="签约老板" tooltip="没有请在商户列表 新增商户" :rules="[{ required: true, message: '请选择老板' }]">
        <a-select v-model="form.userId" :options="userOptions" placeholder="通过手机或姓名搜索老板" allow-search allow-clear @search="searchUser" />
      </a-form-item>
      <a-form-item field="yyzz" label="营业执照" tooltip="营业执照">
        <a-upload ref="uploadRef" v-model="form.yyzz" :default-file-list="fileList" multiple list-type="picture-card" :limit="2" :auto-upload="false" :custom-request="customRequest" @before-remove="yyzzRemove" />
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
    <a-modal v-model:visible="removeImgInfo.visible" @ok="removeImgOk" @cancel="removeImgInfo.visible = false">
      <template #title> 确认删除吗？ </template>
      <div>删除后图片将无法恢复</div>
    </a-modal>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { contractOne, roomList, userSearch, contractPostOrPut, delImg } from '@/api/caiwu';
import { type IRoom, type ITrees, contractRoomToTree, tinyCanvas } from '@/utils/caiwu';
import type { IUser } from '@/store/modules/app/types';
import { FileItem, Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import { ICompany } from '@/store/modules/user/types';

interface IForm {
  id: number;
  rooms: string[];
  bianma: string;
  name: string;
  area?: number;
  price?: number;
  userId: string;
  startTime: string;
  endTime: string;
  yyzz: any[];
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const id = +(route.params.id as string) || 0;
const bm = ref(`${userStore.company?.bm}${dayjs().format('YYYYMMDDHHmmss')}-${Math.random().toString().slice(-5)}`);

const rooms = ref<ITrees[]>();
const treeCheckStrictly = ref(false);
const userOptions = ref<{ label: string; value: string }[]>([]);
const btnDisabled = ref(false);
const blobs = ref<Blob[]>([]);
const removeImgInfo = reactive({
  visible: false,
  url: '',
});

const uploadRef = ref();
const formRef = ref();
const fileList = ref<{ uid: string; name: string; url: string }[]>([]);

const form = reactive<IForm>({
  id,
  rooms: [],
  bianma: bm.value,
  name: '',
  area: undefined,
  price: undefined,
  userId: '',
  startTime: '',
  endTime: '',
  yyzz: [],
});

const getOne = async () => {
  const data = await roomList<IRoom[]>(userStore.company?.id ?? 0);
  if (id) {
    const val = await contractOne<IForm>(id);
    console.log(val);
    console.log(val.price, typeof val.price);
    const { user } = val as any;
    rooms.value = contractRoomToTree(data, userStore.company as ICompany, new Set(val.rooms));
    form.id = val.id;
    form.name = val.name;
    form.rooms = val.rooms;
    form.yyzz = val.yyzz;
    form.userId = `${user.id}`;
    form.startTime = val.startTime;
    form.endTime = val.endTime;
    form.yyzz = val.yyzz;
    form.price = val.price;
    form.area = val.area;

    userOptions.value = [{ label: `${user.name} - ${user.phone}`, value: `${user.id}` }];
    fileList.value = val.yyzz.map((item) => ({ uid: Math.random().toString().slice(2), name: item, url: item }));
  } else {
    rooms.value = contractRoomToTree(data, userStore.company as ICompany);
  }
};
await getOne();

const searchUser = async (val: string) => {
  if (val.length > 1) {
    const data = await userSearch<IUser[]>(val);
    userOptions.value = data.map((item) => ({ label: `${item.name} - ${item.phone}`, value: `${item.id}` }));
  } else {
    userOptions.value = [];
  }
};
// 表单提交
const handleSubmit = async (val: any) => {
  const { errors, values } = val;
  if (errors) return;
  btnDisabled.value = true;
  // 图片提交，触发对应组件按钮
  uploadRef.value.submit();

  const formDate = new FormData();
  Object.keys(values).forEach((k) => {
    formDate.set(k, values[k]);
  });
  // 公司
  formDate.set('companyId', userStore.company?.id ? `${userStore.company.id}` : '1');
  // 异步图片裁切
  const map = blobs.value.map((item) => tinyCanvas(item));
  Promise.all(map)
    .then((ret) => {
      ret.forEach((res) => formDate.append('files', res));
    })
    .then(async () => {
      contractPostOrPut(formDate).then(() => {
        Message.success('创建成功');
        router.back();
      });
    })
    .finally(() => {
      blobs.value = [];
      btnDisabled.value = false;
    });
};
// 图片提交按钮
const customRequest = (option: any) => {
  const { fileItem } = option;
  blobs.value.push(fileItem.file as File);
  return {};
};
// 删除图片
const removeImgOk = async () => {
  // console.log(url);
  // delImg(id, url).then(() => {
  //   form.yyzz = form.yyzz.filter((item: string) => !item.includes(url as string));
  // });
};
const yyzzRemove = async (file: FileItem) => {
  if (file.status === 'done') {
    try {
      await delImg(id, file.url);
      form.yyzz = form.yyzz.filter((item: string) => !item.includes(file.url as string));
    } catch (error) {
      return false;
    }
  }
  return true;
};
</script>

<style lang="less" scoped>
.bg {
  padding: 18px 0;
  padding-right: 60px;
  padding-left: 0;
  background-color: white;

  &-title {
    text-align: center;
  }

  &-ftitle {
    text-align: center;
  }
}
</style>
