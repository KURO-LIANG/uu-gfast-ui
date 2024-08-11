<template>
  <el-date-picker v-model="range" :placeholder="placeholder" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期"/>
</template>

<script lang="ts" setup>
import {defineProps, computed, defineEmits} from 'vue';

const emit = defineEmits<{
  (e: 'update:start', value: string): void
  (e: 'update:end', value: string): void
  (e: 'change', value: Array<string>): void
}>();

interface Props {
  start: string
  end: string,
  placeholder?:string
}

const props = defineProps<Props>();
const range = computed({
  get: () => [props.start, props.end],
  set: (value: Array<string>) => {
    emit('update:start', value[0]);
    emit('update:end', value[1]);
    emit('change', value);
  }
});

</script>

<style scoped>

</style>
