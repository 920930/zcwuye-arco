<template>
  <a-modal v-model:visible="visible" :mask-closable="false" :title="`${userStore.company?.name} 商铺${data.id ? '编辑' : '新增'}`" :footer="false" @cancel="handleCancel">
    <a-form ref="formRef" :model="data" @submit="formSubmit">
      <a-form-item field="id" label="id" style="display: none">
        <a-input-number v-model="data.id" />
      </a-form-item>
      <a-form-item field="companyId" label="companyId" style="display: none">
        <a-input-number v-model="data.companyId" />
      </a-form-item>
      <a-form-item v-if="userStore.company?.dong ? true : false" field="dong" label="栋" :rules="[{ required: true, message: '不能为空' }]">
        <a-select v-model="data.dong" :options="dongValues" placeholder="请选择栋号" />
      </a-form-item>
      <a-form-item field="qu" label="区/楼" :rules="[{ required: true, message: '不能为空' }]">
        <a-select v-model="data.qu" :options="quValues" placeholder="请选择区/附区/特区/楼" />
      </a-form-item>
      <a-form-item field="num" label="号" :rules="[{ required: true, message: '不能为空' }]">
        <a-input v-model="data.num" placeholder="请输入号" />
      </a-form-item>
      <a-form-item field="area" label="面积" :rules="[{ required: true, message: '不能为空' }]">
        <a-input-number v-model="data.area" placeholder="请输入商铺面积" />
      </a-form-item>
      <a-form-item field="price" label="单价" :rules="[{ required: true, message: '不能为空' }]">
        <a-input-number v-model="data.price" placeholder="请输入商铺单价" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button @click="formRef.resetFields()">重置</a-button>
          <a-button html-type="submit" type="primary">提交</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue';
import { useUserStore } from '@/store';
import { IRoom, qutypeFn, debounce } from '@/utils/caiwu';
import { roomPostOrPut } from '@/api/caiwu';

interface IProps {
  modelValue: boolean;
  room?: IRoom;
}

const userStore = useUserStore();

const props = withDefaults(defineProps<IProps>(), { modelValue: false });

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(bool: boolean) {
    emit('update:modelValue', bool);
  },
});
const formRef = ref();
const data = reactive<Partial<IRoom> & { companyId?: number }>({
  id: 0,
  dong: undefined,
  qu: undefined,
  num: undefined,
  price: undefined,
  area: undefined,
  companyId: userStore.company?.id,
});
const setValues = (val: IRoom | undefined) => {
  formRef.value.setFields({
    id: { value: val?.id },
    dong: { value: val?.dong },
    qu: { value: val?.qu },
    num: { value: val?.num },
    price: { value: val?.price },
    area: { value: val?.area },
  });
};
watch(
  () => props.room,
  (val) => setValues(val)
);
const handleCancel = () => {
  visible.value = false;
  formRef.value.resetFields();
};

const formSubmit = debounce(async (val: { errors: any; values: any }[]) => {
  if (val[0].errors) return;
  await roomPostOrPut(val[0].values);
  handleCancel();
});
const dongValues = Array.from({ length: userStore.company?.dong ?? 0 }, (_v, i) => ({
  value: i,
  label: `${i === 0 ? '无' : `${i}栋`}`,
}));
const quValues = qutypeFn(userStore.company?.qu ?? 0, userStore.company?.qutype ?? [], userStore.company?.qulen);
</script>
