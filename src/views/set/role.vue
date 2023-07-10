<template>
  <section class="m-20">
    <a-button class="mb-10" type="primary" @click="storeBtn">新增</a-button>
    <a-table :data="data" column-resizable :bordered="{ cell: true }">
      <template #columns>
        <a-table-column title="Id" data-index="id" />
        <a-table-column title="角色英语标识" data-index="name" />
        <a-table-column title="角色汉语标识" data-index="title" />
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
        <a-form-item field="name" label="英语标识" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.name" placeholder="角色英语标识" />
        </a-form-item>
        <a-form-item field="title" label="汉语标识" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.title" placeholder="角色汉语标识" />
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
import { getRoleList, rolePostOrPut } from '@/api/user';
const set = reactive({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    name: '',
    title: '',
  },
});
const formRef = ref();
const data = ref([]);
const getRole = async () => {
  data.value = await getRoleList();
};
getRole();

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
    title: { value: record.title },
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
  await rolePostOrPut(values);
  handleCancel();
  getRole();
};
</script>

<style lang="less" scoped></style>
