<template>
  <section class="bg-white" style="margin-top: 20px; padding: 0 20px 20px">
    <section class="mb-10 flex">
      <h3>合同续签情况</h3>
      <a-button type="primary" status="danger" @click="info.visible = true">新增</a-button>
    </section>
    <a-table :data="conlistData.values" :pagination="{ total: conlistData.total, showTotal: true, current: info.page, pageSize: info.size }" @page-change="pageChange">
      <template #columns>
        <a-table-column title="Id" data-index="id" />
        <a-table-column title="合同图片" data-index="img">
          <template #cell="{ record }">
            <a-button size="small" type="outline" status="success" @click="htBtn(record)">查看合同</a-button>
          </template>
        </a-table-column>
        <a-table-column title="开始时间" data-index="startTime" />
        <a-table-column title="结束时间" data-index="endTime" />
        <a-table-column title="备注" data-index="desc" />
        <a-table-column title="操作" data-index="set" :width="200">
          <template #cell="{ record }">
            <a-space wrap>
              <a-button type="primary" size="small" @click="editFn(record)">编辑</a-button>
              <a-popconfirm content="确定要删除吗？" type="warning" @ok="delFn(record.id)">
                <a-button type="primary" size="small" status="danger">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal :visible="info.visible" title="合同续签情况" :footer="false" draggable @cancel="handleCancel">
      <a-form ref="conlistFormRef" :model="conlist" @submit="formSubmit">
        <a-form-item field="id" tooltip="Please enter id" label="id" style="display: none">
          <a-input-number v-model="conlist.id" placeholder="please enter your id..." />
        </a-form-item>
        <a-form-item field="contractId" tooltip="Please enter contractId" label="contractId" style="display: none">
          <a-input-number v-model="conlist.contractId" placeholder="please enter your contractId..." />
        </a-form-item>
        <a-form-item field="startTime" label="开始时间" required>
          <a-date-picker v-model="conlist.startTime" style="width: 300px" />
        </a-form-item>
        <a-form-item field="endTime" label="结束时间" required>
          <a-date-picker v-model="conlist.endTime" style="width: 300px" />
        </a-form-item>
        <a-form-item field="desc" label="备注">
          <a-input v-model="conlist.desc" placeholder="添加备注和说明" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary" :loading="loading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :visible="info.ht" fullscreen title="合同图片列表" :footer="false" @cancel="htCancel">
      <section class="ht">
        <div class="ht-left">
          <a-upload ref="htuploadRef" :action="htUpload.action" :headers="htUpload.headers" list-type="picture" multiple :default-file-list="htImgs" @before-upload="beforeUp" />
        </div>
        <article class="ht-right">
          <a-carousel auto-play :style="{ height: htUpload.height + 'px' }">
            <a-carousel-item v-for="image in htImgs" :key="image.uid">
              <img :src="image.url" :style="{ width: '100%' }" />
            </a-carousel-item>
          </a-carousel>
        </article>
      </section>
    </a-modal>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { conLists, conListPostOrPut, conListDel } from '@/api/caiwu';
import type { IConList } from '@/types/caiwu';
import { tinyCanvas } from '@/utils/caiwu';
import { getToken } from '@/utils/auth';
import useLoading from '@/hooks/loading';

const route = useRoute();
const info = reactive({
  visible: false,
  ht: false,
  page: 1,
  size: 5,
});
const conlistFormRef = ref();
const conlistData = reactive<{ values: IConList[]; total: number }>({
  values: [],
  total: 0,
});
const conlist = reactive<{
  contractId: number;
  id: number;
  startTime: string;
  endTime: string;
  desc: string;
  imgs: string[];
}>({
  contractId: 0,
  id: 0,
  startTime: '',
  endTime: '',
  desc: '',
  imgs: [],
});
const htImgs = ref<{ uid: string; name: string; url: string }[]>([]);
const htuploadRef = ref();
const htUpload = reactive({
  height: 0,
  action: '',
  headers: {
    Authorization: '',
  },
});
const { loading, setLoading } = useLoading();

const getConList = async () => {
  const [value, total] = await conLists<[IConList[], number]>(conlist.contractId, info.page, info.size);
  conlistData.values = value;
  conlistData.total = total;
};
onMounted(() => {
  conlist.contractId = +`${route.params.id}`;
  getConList();
  htUpload.height = document.documentElement.clientHeight - 200;
  htUpload.headers.Authorization = getToken() || '';
});
// 表单编辑
const editFn = (record: any) => {
  info.visible = true;
  conlistFormRef.value.setFields({
    id: { value: record.id },
    price: { value: +record.price },
    area: { value: +record.area },
    startTime: { value: record.startTime },
    endTime: { value: record.endTime },
    desc: { value: record.desc },
  });
};
// model关闭后，重置
const handleCancel = () => {
  info.visible = false;
  conlistFormRef.value.resetFields();
};
// 表单提交
const formSubmit = async ({ values, errors }: any) => {
  if (errors) return;
  setLoading(true);
  setTimeout(() => setLoading(false), 3000);
  // values.contractId = conlist.contractId;
  await conListPostOrPut(values);
  getConList();
  handleCancel();
};
const delFn = async (id: number) => {
  await conListDel(id);
  getConList();
};
// 换页
const pageChange = (num: number) => {
  info.page = num;
  getConList();
};
// 合同modal界面关闭
const htCancel = () => {
  htImgs.value.length = 0;
  info.ht = false;
};
// 合同列表查看
const htBtn = (record: any) => {
  htUpload.action = `${import.meta.env.VITE_API_BASE_URL}/api/conlist/upload/${record.id}`;
  if (record.imgs) {
    const ret: { uid: string; name: string; url: string }[] = [];
    record.imgs.forEach((url: string) => {
      const arr = url.split('/');
      const uid = arr[arr.length - 1];
      ret.push({ uid, name: uid, url });
    });
    htImgs.value.push(...ret);
  }

  info.ht = true;
};
// 图片上传前压缩图片
const beforeUp = (file: File) => tinyCanvas(file);
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ht {
  display: flex;
  gap: 20px;

  &-left {
    flex: 1;
  }

  &-right {
    flex: 1;
  }
}
</style>
