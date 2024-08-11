<template>
  <el-checkbox-group :model-value="modelValue" @change="handleChange">
    <el-checkbox v-for="item of dataList" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, withDefaults, computed} from 'vue';
import dictData from "/@/data/dictData";

const prop = withDefaults(
    defineProps<{
      modelValue: Array<string | number | undefined>
      name: string
    }>(),
    {}
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string | number>): void
}>();

const handleChange = (value: Array<string | number>) => {
  emit('update:modelValue', value);
}

const dataList = computed(() => {
  return dictData[prop.name];
});
</script>

<style scoped>

</style>
