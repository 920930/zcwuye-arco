<template>
  <section class="m-20">
    <ul class="bg-white p-20 mb-20">
      <li class="li">
        <a-space class="li-left">店铺名称：{{ contract?.name }}</a-space>
        <a-space>
          <span>所属项目：</span>
          <span style="color: red">{{ userStore.company?.fname }}</span>
        </a-space>
      </li>
      <li class="li">
        <a-space class="li-left">合同编号：{{ contract?.bianma }}</a-space>
        <a-space>
          <span>入驻门店：</span>
          <a-tag v-for="item in contract?.oldRooms.split(',')" :key="item" color="purple" size="small">{{ item }}</a-tag>
        </a-space>
      </li>
      <li class="li">
        <a-space class="li-left">
          开始时间:<a-tag size="small">{{ contract?.startTime }}</a-tag>
        </a-space>
        <a-space class="li-left">
          结束时间：<a-tag size="small">{{ contract?.endTime }}</a-tag>
        </a-space>
      </li>
    </ul>
    <ul class="bg-white p-20 mb-20">
      <li class="li">
        <a-space class="li-left">老板姓名：{{ contract?.user?.name }}</a-space>
        <a-space class="li-left">
          <span>老板手机：</span>
          <span style="color: red">{{ contract?.user?.phone }}</span>
        </a-space>
        <a-space>身份证：{{ contract?.user?.card }}</a-space>
      </li>
    </ul>
    <section class="bg-white p-20 mb-20"> 主题内容 </section>
    <section class="bg-white" style="padding: 0 20px 20px">
      <section class="mb-10 flex">
        <h3>费用列表</h3>
        <section>
          <a-space size="large">
            <a-space>
              <a-select v-model="searchValue.type" placeholder="费用分类" :options="typeData" style="width: 200px" />
              <a-button type="primary" status="success" @click="searchBtn">搜索</a-button>
              <a-button @click="resetBtn">重置</a-button>
            </a-space>
            <a-button type="primary" status="danger" @click="costVisible = true">新增</a-button>
          </a-space>
        </section>
      </section>
      <a-table :data="cost.datas">
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
          <a-table-column title="说明" data-index="desc" />
          <a-table-column title="收款人" data-index="adminer">
            <template #cell="{ record }">{{ record.adminer.name }}</template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createAt" />
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

    <a-modal v-model:visible="costVisible" title="收费" :footer="false" draggable @cancel="costCancel">
      <a-form ref="costFormRef" :model="costform" @submit="costOk">
        <a-form-item field="id" label="id" style="display: none">
          <a-input-number v-model="costform.id" placeholder="id" />
        </a-form-item>
        <a-form-item field="costypeId" label="费用类型">
          <a-select v-model="costform.costypeId" placeholder="请选择费用类型" :options="typeData" />
        </a-form-item>
        <a-form-item field="price" label="金额" required>
          <a-input-number v-model="costform.price" placeholder="收费金额" />
        </a-form-item>
        <a-form-item field="start" label="开始时间" required>
          <a-date-picker v-model="costform.start" />
        </a-form-item>
        <a-form-item field="end" label="结束时间" required>
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
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import { contractOne } from '@/api/caiwu';
import { getCostypeList, getCostList, CostPostOrPut } from '@/api/user';
import type { IContract, ICost } from '@/types/caiwu';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';

const route = useRoute();
const userStore = useUserStore();
const { loading, setLoading } = useLoading();
const costFormRef = ref();
const searchValue = reactive({
  type: undefined,
});
const contract = ref<IContract>();
const costVisible = ref(false);
const cost = reactive<{ datas: ICost[]; count: number }>({
  datas: [],
  count: 0,
});
const typeData = ref<{ value: number; label: string }[]>([
  // { value: 1, label: '房租' },
  // { value: 2, label: '电费' },
  // { value: 3, label: '水费' },
  // { value: 4, label: '垃圾费' },
  // { value: 5, label: '滞纳金' },
  // { value: 6, label: '押金' },
  // { value: 7, label: '保险费' },
  // { value: 8, label: '培训费' },
]);
const costform = reactive({
  id: 0,
  price: undefined,
  start: '',
  end: '',
  desc: '',
  contractId: 0,
  costypeId: undefined,
});

const getContract = async () => {
  // 合同信息
  contract.value = await contractOne(costform.contractId);
  // 费用类目
  const costypeListData = await getCostypeList<{ id: number; title: string }[]>();
  typeData.value = costypeListData.map((item) => ({ value: item.id, label: item.title }));
};
// 费用列表 cId是合同Id, costypeId是费用类型id
const costListFn = async (cId: number, costypeId = 0) => {
  const [value, total] = await getCostList<[ICost[], number]>(cId, costypeId);
  cost.count = total;
  cost.datas = value;
};

onMounted(() => {
  costform.contractId = Number.parseInt(`${route.params.id}`, 10);
  getContract();
  costListFn(costform.contractId);
});

const costOk = async ({ values, errors }: { values: any; errors: any }) => {
  if (errors) return;
  if (!values.costypeId) {
    Message.warning('请选择收费类型');
    return;
  }
  setLoading(true);
  try {
    await CostPostOrPut(values, true);
    costListFn(costform.contractId);
    costVisible.value = false;
  } catch (error) {
    window.console.log(error);
  } finally {
    setLoading(false);
  }
};
// 关闭modal后数据重置
const costCancel = () => costFormRef.value.resetFields();
const editCostBtn = (record: any) => {
  costVisible.value = true;
  costFormRef.value.setFields({
    id: { value: record.id },
    price: { value: record.price },
    desc: { value: record.desc },
    start: { value: record.start },
    end: { value: record.end },
    costypeId: { value: record.costype.id },
  });
};
const delCostBtn = (item: any) => {};

const searchBtn = () => costListFn(costform.contractId, searchValue.type);
const resetBtn = () => costListFn(costform.contractId);
</script>

<style lang="less" scoped>
.li {
  display: flex;
  margin-bottom: 15px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &-left {
    flex-basis: 400px;
  }
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
