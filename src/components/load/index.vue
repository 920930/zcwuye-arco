<template>
  <section v-if="modelValue"> <icon-loading /> </section>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    time?: number;
  }>(),
  {
    modelValue: false,
    time: 1000,
  }
);

const emit = defineEmits<{
  'update:modelValue': [bool?: boolean];
}>();

setTimeout(() => emit('update:modelValue'), props.time);
</script>

<style lang="less" scoped>
.clas {
  position: absolute;
}
</style>
