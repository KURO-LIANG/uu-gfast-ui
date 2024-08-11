<template>
  <div>
      <el-select :placeholder="placeholder" :class="className" v-if="type === 'select'" :model-value="modelValue" @change="handleChange" :size="size" :clearable="clearable">
          <el-option v-for="item of dataList" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-radio-group v-if="type === 'radio'" :model-value="modelValue" @change="handleChange" size="default" :class="className">
          <el-radio v-for="item of dataList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
      </el-radio-group>
      <el-radio-group v-if="type === 'button'" :model-value="modelValue" @change="handleChange" size="default">
          <el-radio-button v-for="item of dataList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, withDefaults, computed} from 'vue';
import dictData from "/@/data/dictData";

const prop = withDefaults(
    defineProps<{
      modelValue?: string | number
      name: string
      type?: string
      size?: string
      className?: string
      clearable?: boolean
      emptyLabel?: string
      all?: boolean
      allValue?: string | number
      allLabel?: string
      placeholder?: string
    }>(),
    {
      type: 'select',
      clearable: false,
      className: '',
      emptyLabel: '全部',
      all: false,
      allValue: '',
      allLabel: '全部',
      placeholder:'请选择'
    }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>();

const handleChange = (value: string | number) => {
  emit('update:modelValue', value);
  emit('change', value);
}

const dataList = computed(() => {
  if(!prop.all) {
    return dictData[prop.name];
  }
  return [{
    label: prop.allLabel,
    value: prop.allValue,
  }].concat(dictData[prop.name])
});
</script>

<style scoped>

</style>
