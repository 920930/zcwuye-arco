<template>
  <section class="m-20">
    <section class="top">
      <a-button type="primary" @click="storeBtn">新增</a-button>
      <a-space>
        <a-input v-model="search.name" placeholder="请输入用户名" />
        <a-input v-model="search.phone" placeholder="请输入用户手机号" />
        <a-button type="primary">搜索</a-button>
        <a-button>重置</a-button>
      </a-space>
    </section>
    <a-table :data="data.adminers.data" column-resizable :bordered="{ cell: true }" :pagination="{ total: data.adminers.count, showTotal: true }">
      <template #columns>
        <a-table-column title="Id" data-index="id" />
        <a-table-column title="姓名" data-index="name" />
        <a-table-column title="手机号" data-index="phone" />
        <a-table-column title="身份证" data-index="card" />
        <a-table-column title="状态" data-index="state">
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
          <a-input v-model="set.form.name" placeholder="请输入商户姓名" />
        </a-form-item>
        <a-form-item field="phone" label="手机号" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.phone" placeholder="请输入商户手机号" />
        </a-form-item>
        <a-form-item field="card" label="手机号" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.card" placeholder="请输入商户身份证号码" />
        </a-form-item>
        <a-form-item field="companies" label="公司" :rules="[{ required: true, message: '不能为空' }]">
          <a-select v-model="set.form.companies" multiple :options="data.companies" placeholder="请选择公司" />
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
import { getCompanyList } from '@/api/user';
import { userList, userPostOrPut } from '@/api/caiwu';
import { ICompany, IUser } from '@/store/modules/app/types';
const search = reactive({
  name: '',
  phone: '',
});
const set = reactive({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    name: '',
    phone: '',
    card: '',
    state: true,
    companies: [],
  },
});
const formRef = ref();
const data = reactive<{ adminers: { count: number; data: IUser[] }; companies: { value: number; label: string }[] }>({
  adminers: {
    count: 0,
    data: [],
  },
  companies: [],
});
const getAdminer = async () => {
  const [ret, count] = await userList<[IUser[], number]>();
  data.adminers.count = count;
  data.adminers.data = ret;
};
getAdminer();

const getRoleCompany = async () => {
  const companies = await getCompanyList<ICompany[]>();
  data.companies = companies.map((company) => ({ value: company.id, label: company.name }));
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
    card: { value: record.card },
    state: { value: record.state },
    companies: { value: record.companies.map((item: ICompany) => item.id) },
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
  await userPostOrPut(values);
  handleCancel();
  getAdminer();
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
}
</style>
