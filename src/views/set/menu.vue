<template>
  <div class="m-20">
    <a-button type="primary" status="success" class="mb-10" @click="storeBtn">
      <template #icon><icon-plus /></template>
      <template #default>新增</template>
    </a-button>
    <a-table :data="data.menu" column-resizable :bordered="{ cell: true }">
      <template #columns>
        <a-table-column title="Id" data-index="id"></a-table-column>
        <a-table-column title="名称" data-index="meta.locale">
          <template #cell="{ record }">{{ $t(record.meta.locale) }}</template>
        </a-table-column>
        <a-table-column title="公司" data-index="meta.companies">
          <template #cell="{ record }">
            <a-space wrap>
              <a-tag v-for="item in findCompanyName(record.company)" :key="item.id" bordered>{{ item.name }}</a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="set">
          <template #cell="{ record }">
            <a-space wrap>
              <a-button type="primary" size="small" @click="editBtn(record)">编辑</a-button>
              <a-button type="primary" size="small" status="danger">删除</a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="modal.visible" :mask-closable="false" :footer="false" @cancel="handleCancel">
      <template #title> {{ modal.title }} </template>
      <a-form ref="formRef" :model="modal.form" @submit="formSubmit">
        <a-form-item field="id" label="路由id" style="display: none">
          <a-input-number v-model="modal.form.id" />
        </a-form-item>
        <a-form-item field="name" label="路由name" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="modal.form.name" placeholder="请输入路由name" />
        </a-form-item>
        <a-form-item field="meta.locale" label="路由locale" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="modal.form.meta.locale" placeholder="请输入路由locale" />
        </a-form-item>
        <a-form-item field="meta.requiresAuth" label="登录访问">
          <a-switch v-model="modal.form.meta.requiresAuth" disabled />
        </a-form-item>
        <a-form-item field="meta.order" label="排序">
          <a-input-number v-model="modal.form.meta.order" placeholder="请输排序" />
        </a-form-item>
        <a-form-item field="meta.icon" label="图标">
          <a-input v-model="modal.form.meta.icon" placeholder="请输入路由图标" />
        </a-form-item>
        <a-form-item field="meta.roles" label="角色权限">
          <a-select v-model="modal.form.meta.roles" placeholder="不选则对所有角色生效" multiple>
            <a-option v-for="role in data.roles" :key="role.id" :label="role.title" :value="role.name" />
          </a-select>
        </a-form-item>
        <a-form-item field="company" label="所属公司" :rules="[{ required: true, message: '不能为空' }]">
          <a-select v-model="modal.form.company" multiple>
            <a-option v-for="company in companyStore.companies" :key="company.id" :label="company.name" :value="company.id" />
          </a-select>
        </a-form-item>
        <a-form-item field="parent" label="父级路由">
          <a-cascader v-model="modal.form.parent" :options="data.menuOption" check-strictly placeholder="请选择父级栏目 可不选" allow-clear />
        </a-form-item>
        <a-form-item field="meta.hideInMenu" label="显示">
          <a-switch v-model="modal.form.meta.hideInMenu" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="formRef.resetFields()">重置</a-button>
            <a-button html-type="submit" type="primary">提交</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getMenuList, getRoleList, menuPostOrPut } from '@/api/user';
import { useUserStore, useAppStore, useCompanyStore } from '@/store';
import type { IMenu, IRole, IOptions } from '@/store/modules/app/types';
import { menuToOption } from '@/utils';
import { debounce } from '@/utils/caiwu';

const appStore = useAppStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();

const data = reactive<{ menu: IMenu[]; roles: IRole[]; menuOption: IOptions[] }>({
  menu: [],
  roles: [],
  menuOption: [],
});
const getMenuBtn = async () => {
  data.menu = await getMenuList<IMenu[]>();
  data.menuOption = menuToOption(data.menu);
};
getMenuBtn();
const getRoleAdCompany = async () => {
  data.roles = await getRoleList<IRole[]>();
};
getRoleAdCompany();
// 公司名称
const findCompanyName = (coms: number[]) => {
  const set = new Set(coms);
  return userStore.companies.filter((item) => set.has(item.id));
};

const formRef = ref();
const modal = reactive<{ visible: boolean; title: string; form: IMenu }>({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    name: '',
    meta: {
      locale: '',
      icon: '',
      order: 1,
      requiresAuth: true,
      hideInMenu: true,
      roles: [],
    },
    company: [],
    parent: undefined,
  },
});

const storeBtn = () => {
  modal.visible = true;
  modal.title = '新增';
};
const editBtn = (record: IMenu) => {
  modal.visible = true;
  modal.title = '编辑';
  const { roles } = record.meta;
  let setroles: string[] = [];
  if (roles) {
    setroles = roles.includes('*') ? data.roles.map((item) => item.name) : [...roles];
  } else {
    setroles = data.roles.map((item) => item.name);
  }
  formRef.value.setFields({
    'id': { value: record.id },
    'name': { value: record.name },
    'meta.locale': { value: record.meta.locale },
    'meta.order': { value: record.meta.order || 1 },
    'meta.icon': { value: record.meta.icon },
    'meta.requiresAuth': { value: record.meta.requiresAuth },
    'meta.hideInMenu': { value: record.meta.hideInMenu },
    'meta.roles': { value: setroles },
    'company': { value: record.company.map((item) => item) },
    'parent': { value: record.parent?.id ?? null },
  });
};
// 重置表单数据
const handleCancel = () => {
  modal.visible = false;
  formRef.value.clearValidate();
  formRef.value.resetFields();
};
const formSubmit = debounce(async (val: { values: any; errors: any }[]) => {
  if (val[0].errors) return;
  val[0].values.parent = val[0].values.parent === undefined ? null : val[0].values.parent;
  await menuPostOrPut(val[0].values);
  handleCancel();
  getMenuBtn();
  appStore.fetchServerMenuConfig(userStore.companyId);
});
</script>
