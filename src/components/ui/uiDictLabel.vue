<template>
  <el-tag v-if="tag === 'tag'" :type="!_type || _type==='primary'?'':_type">{{activeText}}</el-tag>
  <span v-else :class="[!_type ? '' : 'color-'+_type]">{{activeText}}</span>
</template>

<script lang="ts" setup>
import dictData from "/@/data/dictData";
import {computed} from "vue";
import {Option} from "/@/index";

const dict = dictData as any;

const prop = withDefaults(
    defineProps<{
      modelValue?: string | number
      name: string
      type?: string
      tag?: string
      status?: boolean
      text?: string | number
    }>(),
    {
      type: '',
      tag: '',
      text: '',
      status: false
    }
);

const activeText = computed(() => {
  const data = dict[prop.name].find((item: Option) => item.value === prop.modelValue);
  return !data ? prop.text : data.label;
});

const _type = computed(() => {
  if(prop.status) {
    const data = dict[prop.name].find((item: Option) => item.value === prop.modelValue);
    return data && data.type ? data.type : prop.type;
  }
  return prop.type;
});
</script>

<style scoped>

</style>
