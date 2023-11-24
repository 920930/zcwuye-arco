<template>
  <a-config-provider :locale="locale">
    <router-view />
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import GlobalSetting from '@/components/global-setting/index.vue';
import useLocale from '@/hooks/locale';
import { useUserStore } from './store';

const router = useRouter();
const userStore = useUserStore();
onBeforeMount(async () => {
  if (userStore.role.includes('super') && !router.currentRoute.value.fullPath.includes('workplace')) {
    router.push({ name: 'Workplace' });
  }
});

const { currentLocale } = useLocale();
const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return enUS;
  }
});
</script>

<style lang="less">
.flex {
  display: flex;
  gap: 20px;
}

.m-20 {
  margin: 20px;
}

.p-20 {
  padding: 20px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.bg-white {
  background-color: white;
  border-radius: 5px;
}
</style>
