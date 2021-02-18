<template>
  <div>
    Home
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'vue-meta';

export default defineComponent({
  setup: () => {
    useMeta({
      title: 'Home',
    });
  }
});
</script>

<style lang="postcss" scoped>
</style>