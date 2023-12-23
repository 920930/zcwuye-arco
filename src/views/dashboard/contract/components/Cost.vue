<template>
  <div>
    <section class="bg-white" style="margin-top: 20px; padding: 0 20px 20px">
      <section class="mb-10 flex">
        <h3>费用列表</h3>
        <a-space size="large">
          <a-space>
            <a-select v-model="searchValue.type" placeholder="费用分类" :options="costypeData" style="width: 200px" />
            <a-button type="primary" status="success" @click="searchBtn">搜索</a-button>
            <a-button @click="resetBtn">重置</a-button>
          </a-space>
          <a-button type="primary" status="danger" @click="costFormInfo.visible = true">新增</a-button>
        </a-space>
      </section>
      <a-table :data="cost.datas" :pagination="{ total: cost.count, showTotal: true, current: searchValue.page, pageSize: searchValue.size }" @page-change="pageChange">
        <template #columns>
          <a-table-column title="Id" data-index="id" />
          <a-table-column title="类目" data-index="type">
            <template #cell="{ record }">
              {{ record.costype.title }}
            </template>
          </a-table-column>
          <a-table-column title="金额" data-index="price" />
          <a-table-column title="开始时间" data-index="start" />
          <a-table-column title="结束时间" data-index="end" />
          <a-table-column title="收款人" data-index="adminer">
            <template #cell="{ record }">{{ record.adminer.name }}</template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createAt" />
          <a-table-column title="备注" data-index="desc" />
          <a-table-column title="操作" data-index="set" :width="200">
            <template #cell="{ record }">
              <a-space wrap>
                <a-button type="primary" size="small" @click="editCostBtn(record)">编辑</a-button>
                <a-popconfirm content="确定要删除吗？" type="warning" @ok="delCostBtn(record.id)">
                  <a-button type="primary" size="small" status="danger">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </section>

    <a-modal v-model:visible="costFormInfo.visible" title="收费" :footer="false" draggable @cancel="costCancel">
      <a-form ref="costFormRef" :model="costform" @submit="costOk">
        <a-form-item field="id" label="id" style="display: none">
          <a-input-number v-model="costform.id" placeholder="id" />
        </a-form-item>
        <a-form-item field="costypeId" label="费用类型">
          <a-select v-model="costform.costypeId" placeholder="请选择费用类型" :options="costypeData" @change="costypeChange" />
        </a-form-item>
        <a-form-item field="price" label="金额" required>
          <a-input-number v-model="costform.price" placeholder="收费金额" />
        </a-form-item>
        <a-form-item v-show="costFormInfo.showTime" field="start" label="开始时间" :required="costFormInfo.showTime">
          <a-date-picker v-model="costform.start" />
        </a-form-item>
        <a-form-item v-show="costFormInfo.showTime" field="end" label="结束时间" :required="costFormInfo.showTime">
          <a-date-picker v-model="costform.end" />
        </a-form-item>
        <a-form-item field="desc" label="备注说明">
          <a-input v-model="costform.desc" placeholder="填写此收费备注，可不填写" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary" :loading="loading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { getCostypeList, getCostList, CostPostOrPut } from '@/api/user';
import type { IContract, ICost } from '@/types/caiwu';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ contract: IContract | undefined }>();
const route = useRoute();
const { loading, setLoading } = useLoading();
const searchValue = reactive({
  type: undefined,
  page: 1,
  size: 20,
});
const cost = reactive<{ datas: ICost[]; count: number }>({
  datas: [],
  count: 0,
});
const costFormRef = ref();
const costFormInfo = reactive({
  visible: false,
  showTime: true,
});
const costform = reactive({
  id: 0,
  price: undefined,
  start: '',
  end: '',
  desc: '',
  contractId: 0,
  costypeId: undefined,
});
const costypeData = ref<{ value: number; label: string; dtime: boolean }[]>([]);

const getCosts = async () => {
  // 费用类目
  const costypeListData = await getCostypeList<{ id: number; title: string; dtime: boolean }[]>();
  costypeData.value = costypeListData.map((item) => ({ value: item.id, label: item.title, dtime: item.dtime }));
};
// 费用列表 cId是合同Id, costypeId是费用类型id
const costListFn = async (cId: number, costypeId = 0) => {
  const [value, total] = await getCostList<[ICost[], number]>(cId, costypeId, searchValue.page, searchValue.size);
  cost.count = total;
  cost.datas = value;
};

onMounted(() => {
  costform.contractId = +`${route.params.id}`;
  getCosts();
  costListFn(costform.contractId);
});
const costOk = async ({ values, errors }: { values: any; errors: any }) => {
  if (errors) return;
  if (!values.costypeId) {
    Message.warning('请选择收费类型');
    return;
  }
  if (+values.price <= 0) {
    Message.warning('干啥呢？金额错误！');
    return;
  }
  setLoading(true);
  try {
    await CostPostOrPut(values, true);
    costListFn(costform.contractId);
    costFormInfo.visible = false;
  } catch (error) {
    window.console.log(error);
  } finally {
    setLoading(false);
  }
};
// 关闭modal后数据重置
const costCancel = () => {
  costFormRef.value.resetFields();
  costFormInfo.showTime = true;
};
const editCostBtn = (record: any) => {
  costFormInfo.showTime = record.costype.dtime;
  costFormInfo.visible = true;
  costFormRef.value.setFields({
    id: { value: record.id },
    price: { value: record.price },
    desc: { value: record.desc },
    start: { value: record.costype.dtime ? record.start : '' },
    end: { value: record.costype.dtime ? record.end : '' },
    costypeId: { value: record.costype.id },
  });
};
const delCostBtn = (item: any) => {};

const searchBtn = () => costListFn(costform.contractId, searchValue.type);
const resetBtn = () => {
  searchValue.type = undefined;
  searchValue.page = 1;
  costListFn(costform.contractId);
};
const pageChange = (num: number) => {
  searchValue.page = num;
  searchBtn();
};
// 费用类型变动
const costypeChange = (e: any) => {
  const costOne = costypeData.value.find((item) => item.value === e);
  costFormInfo.showTime = costOne ? costOne.dtime : true;
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
