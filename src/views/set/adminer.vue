<template>
  <section class="m-20">
    <a-button class="mb-10" type="primary" @click="storeBtn">新增</a-button>
    <a-table :data="data.adminers" column-resizable :bordered="{ cell: true }">
      <template #columns>
        <a-table-column title="Id" data-index="id" />
        <a-table-column title="姓名" data-index="name" />
        <a-table-column title="手机号" data-index="phone" />
        <a-table-column title="角色" data-index="role">
          <template #cell="{ record }">{{ record.role.title }}</template>
        </a-table-column>
        <a-table-column title="角色" data-index="state">
          <template #cell="{ record }">
            <a-tag :color="record.state ? 'green' : 'red'" bordered>{{ record.state ? '正常' : '关闭' }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="公司">
          <template #cell="{ record }">
            <a-space wrap>
              <a-tag v-for="(company, index) of record.companies" :key="index" color="blue" bordered>{{ company.name }}</a-tag>
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
        <a-form-item field="name" label="姓名" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.name" placeholder="请输入员工姓名" />
        </a-form-item>
        <a-form-item field="phone" label="手机号" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.phone" placeholder="请输入员工手机号" />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input v-model="set.form.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item field="pwd" label="确认密码">
          <a-input v-model="set.form.pwd" placeholder="请输入确认密码" />
        </a-form-item>
        <a-form-item field="role" label="角色" :rules="[{ required: true, message: '不能为空' }]">
          <a-select v-model="set.form.role" :options="data.roles" />
        </a-form-item>
        <a-form-item field="companies" label="公司" :rules="[{ required: true, message: '不能为空' }]">
          <a-select v-model="set.form.companies" multiple placeholder="请选择公司">
            <a-option v-for="company in companyStore.companies" :key="company.id" :label="company.name" :value="company.id" />
          </a-select>
        </a-form-item>
        <a-form-item field="state" label="状态" :rules="[{ required: true, message: '不能为空' }]">
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
import { useCompanyStore } from '@/store';
import { getAdminerList, getRoleList, adminerPutOrPost } from '@/api/user';
import type { IRole, IAdminer } from '@/store/modules/app/types';
import type { ICompany } from '@/store/modules/company/types';
import { debounce } from '@/utils/caiwu';

const set = reactive({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    name: '',
    phone: '',
    password: undefined,
    pwd: undefined,
    state: true,
    role: 1,
    companies: [],
  },
});
const companyStore = useCompanyStore();
const formRef = ref();
const data = reactive<{ adminers: IAdminer[]; roles: { value: number; label: string }[] }>({
  adminers: [],
  roles: [],
});
const getAdminer = async () => {
  data.adminers = await getAdminerList();
};
getAdminer();

const getRoleCompany = async () => {
  const roles = await getRoleList<IRole[]>();
  data.roles = roles.map((role) => ({ value: role.id, label: role.title }));
};
getRoleCompany();

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
    phone: { value: record.phone },
    state: { value: record.state },
    role: { value: record.role.id },
    companies: { value: record.companies.map((item: ICompany) => item.id) },
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
  await adminerPutOrPost(val[0].values);
  handleCancel();
  getAdminer();
});
</script>
