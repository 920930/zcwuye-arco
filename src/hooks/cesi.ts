import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
export const useReSive = () => {
  const dever = ref<'destop' | 'mobile'>('destop');
  const fn = (e: UIEvent) => {
    const tar = e.target as Window;
    dever.value = tar.innerWidth > 800 ? 'destop' : 'mobile';
  };
  onMounted(() => {
    console.log('onMounted');
  });
  onBeforeMount(() => {
    window.addEventListener('resize', fn);
  });
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount');
    window.removeEventListener('resize', fn);
  });
  return { dever };
};
