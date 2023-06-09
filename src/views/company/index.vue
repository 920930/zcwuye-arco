<template>
  <section>
    <div>{{ dever }}</div>
  </section>
</template>

<script lang="ts" setup>
import { useReSive } from '@/hooks/cesi';
const { dever } = useReSive();
</script>
