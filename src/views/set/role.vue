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
        <a-form-item field="permissions" label="权限列表">
          <a-select v-model="set.form.permissions" :options="permissions" multiple placeholder="请添加角色权限" />
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
import { getPermissionList, getRoleList, rolePostOrPut } from '@/api/user';
import { debounce } from '@/utils/caiwu';

interface ISet {
  visible: boolean;
  title: string;
  form: {
    id: number;
    name: string;
    title: string;
    permissions: { id: number }[];
  };
}

const set = reactive<ISet>({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    name: '',
    title: '',
    permissions: [],
  },
});
const formRef = ref();
const data = ref([]);
const permissions = ref<{ value: number; label: string }[]>([]);
const getRole = async () => {
  data.value = await getRoleList();
  const value = await getPermissionList<{ id: number; title: string; name: string }[]>();
  permissions.value = value.map((item) => ({ value: item.id, label: `${item.title} - ${item.name}` }));
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
    permissions: { value: record.permissions.map((per: { id: number }) => per.id) },
  });
};

// 重置表单数据
const handleCancel = () => {
  set.visible = false;
  formRef.value.clearValidate();
  formRef.value.resetFields();
};

const formSubmit = debounce(async (val: { values: any; errors: any }[]) => {
  if (val[0].errors) return;
  await rolePostOrPut(val[0].values);
  handleCancel();
  getRole();
});
</script>
