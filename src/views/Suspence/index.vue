<script setup lang="ts">
import DefaultCom from './defaultCom.vue'
import {defineAsyncComponent} from 'vue'
const AsyncCom = defineAsyncComponent(()=>import('./asyncCom.vue'))

</script>

<template>
  <Suspense>
    <template v-slot:default>
      <AsyncCom />
    </template>
    <template v-slot:fallback>
      <DefaultCom />
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>
</style>
