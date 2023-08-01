<template>
  <section class="m-20">
    <a-button class="mb-10" type="primary" @click="storeBtn">新增</a-button>
    <a-table :data="companyStore.companies" column-resizable :bordered="{ cell: true }">
      <template #columns>
        <a-table-column title="Id" data-index="id" />
        <a-table-column title="名称" data-index="name" />
        <a-table-column title="栋" data-index="dong" />
        <a-table-column title="区" data-index="qu" />
        <a-table-column title="区类型" data-index="qutype">
          <template #cell="{ record }">
            <a-space>
              <a-tag v-for="(val, index) of qutypeFn(record.qutype)" :key="index" color="purple">{{ val.label.split(' ')[0] }}</a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="set" :width="200">
          <template #cell="{ record }">
            <a-space wrap>
              <a-button type="primary" size="small" @click="editBtn(record)">编辑</a-button>
              <a-button type="primary" size="small" status="danger">删除</a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="set.visible" :mask-closable="false" :footer="false" @cancel="handleCancel">
      <template #title> {{ set.title }} </template>
      <a-form ref="formRef" :model="set.form" @submit="formSubmit">
        <a-form-item field="id" label="id" style="display: none">
          <a-input-number v-model="set.form.id" />
        </a-form-item>
        <a-form-item field="name" label="公司名称" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.name" placeholder="公司名称" />
        </a-form-item>
        <a-form-item field="dong" label="栋号" :rules="[{ required: true, message: '不能为空' }]">
          <a-input-number v-model="set.form.dong" placeholder="0栋 表示本项目没有栋号" />
        </a-form-item>
        <a-form-item field="qu" label="区号" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.qu" placeholder="本项目有多少个区" />
        </a-form-item>
        <a-form-item field="qutype" label="区类型" :rules="[{ required: true, message: '不能为空' }]">
          <a-select v-model="set.form.qutype" :options="qutype" multiple placeholder="请选择区" />
        </a-form-item>
        <a-form-item field="qulen" label="区增量" :rules="[{ required: true, message: '不能为空' }]">
          <a-input-number v-model="set.form.qulen" placeholder="例 楼2 即最多只有2楼, 没有请填0" />
        </a-form-item>
        <a-form-item field="state" label="状态">
          <a-switch v-model="set.form.state" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="formRef.resetFields()">重置</a-button>
            <a-button html-type="submit" type="primary">提交</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { companyPutOrPost } from '@/api/user';
import { useCompanyStore } from '@/store';
const qutype = [
  { value: 1, label: '数字区 如1区 2区' },
  { value: 2, label: '字母区 如A区 B区' },
  { value: 3, label: '字母数字区 如A1区' },
  { value: 4, label: '楼区 如1楼 2楼' },
  { value: 5, label: '特区 如特1区' },
];
const set = reactive({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    name: '',
    dong: 0,
    qu: '',
    qutype: [],
    qulen: 0,
    state: true,
  },
});
const companyStore = useCompanyStore();
const formRef = ref();

const storeBtn = () => {
  set.visible = true;
  set.title = '新增';
};
const editBtn = (record: any) => {
  set.visible = true;
  set.title = '编辑';
  formRef.value.setFields({
    id: { value: record.id },
    name: { value: record.name },
    dong: { value: record.dong },
    qu: { value: record.qu },
    qutype: { value: record.qutype },
    qulen: { value: record.qulen },
    state: { value: record.state },
  });
};

// 重置表单数据
const handleCancel = () => {
  set.visible = false;
  formRef.value.clearValidate();
  formRef.value.resetFields();
};

const formSubmit = async ({ values, errors }: { values: any; errors: any }) => {
  if (errors) return;
  await companyPutOrPost(values);
  handleCancel();
  companyStore.setCompanise();
};

const qutypeFn = (val: number[]) => {
  return qutype.filter((item) => new Set(val).has(item.value));
  // return one?.label.split(' ')[0];
};
</script>

<style lang="less" scoped></style>
