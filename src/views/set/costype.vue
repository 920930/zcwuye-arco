<template>
  <section class="m-20">
    <a-button class="mb-10" type="primary" @click="storeBtn">新增</a-button>
    <a-table :data="data" column-resizable :bordered="{ cell: true }">
      <template #columns>
        <a-table-column title="Id" data-index="id" />
        <a-table-column title="费用名称" data-index="title" />
        <a-table-column title="状态" data-index="state" />
        <a-table-column title="创建时间" data-index="createAt" />
        <a-table-column title="操作" data-index="set" :width="200">
          <template #cell="{ record }">
            <a-space wrap>
              <a-button type="primary" size="small" @click="editBtn(record)">编辑</a-button>
              <a-popconfirm content="确定要删除吗？" type="warning" @ok="delBtn(record.id)">
                <a-button type="primary" size="small" status="danger">删除</a-button>
              </a-popconfirm>
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
        <a-form-item field="title" label="费用名称" :rules="[{ required: true, message: '不能为空' }]">
          <a-input v-model="set.form.title" placeholder="费用名称" />
        </a-form-item>
        <a-form-item field="state" label="费用状态" :rules="[{ required: true, message: '不能为空' }]">
          <a-switch v-model="set.form.state" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="formRef.resetFields()">重置</a-button>
            <a-button html-type="submit" type="primary" :loading="loading">提交</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getCostypeList, CostypePostOrPut } from '@/api/user';
import { debounce } from '@/utils/caiwu';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading();
const set = reactive({
  visible: false,
  title: '新增',
  form: {
    id: 0,
    title: '',
    state: '',
  },
});
const formRef = ref();
const data = ref([]);
const getCostype = async () => {
  data.value = await getCostypeList();
};
getCostype();

const storeBtn = () => {
  set.visible = true;
  set.title = '新增';
};
const editBtn = (record: any) => {
  set.visible = true;
  set.title = '编辑';
  formRef.value.setFields({
    id: { value: record.id },
    title: { value: record.title },
    state: { value: record.state },
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
  setLoading(true);
  await CostypePostOrPut(val[0].values);
  handleCancel();
  getCostype();
  setLoading(false);
});

const delBtn = async (id: number) => {
  // await PermissionRemove(id);
  getCostype();
};
</script>
