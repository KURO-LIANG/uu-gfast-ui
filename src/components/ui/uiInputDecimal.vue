<template>
  <el-input
      :model-value="modelValue"
      :disabled="disabled"
      :clearable="clearable"
      :readonly="readonly"
      :size="size"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @keydown="onkeydown"
      @input="onInput"
      @change="onChange"
  >
      <template
          v-for="(item, key, index) in $slots"
          :key="index"
          v-slot:[key]="slotScope"
      >
          <slot :name="key" v-bind="slotScope"></slot>
      </template>
<!--    <template #prefix>-->
<!--      <slot name="prefix"></slot>-->
<!--    </template>-->
<!--    <template #prepend>-->
<!--      <slot name="prepend"></slot>-->
<!--    </template>-->
<!--    <template #suffix>-->
<!--      <slot name="suffix"></slot>-->
<!--    </template>-->
<!--    <template #append>-->
<!--      <slot name="append"></slot>-->
<!--    </template>-->
  </el-input>
</template>

<script lang="ts" setup>
import {defineProps, withDefaults, defineEmits, computed, getCurrentInstance} from 'vue';

interface Props {
  modelValue: number | string,
  decimal?: number
  maxlength?: number
  size?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  minus?: boolean
  placeholder?: string
}

const prop = withDefaults(
    defineProps<Props>(),
    {
      decimal: 2,
      maxlength: 16,
      disabled: false,
      readonly: false,
      clearable: false,
      minus: false,
      placeholder: '',
    }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>();

const {proxy} = getCurrentInstance() as any;

const check = (value: string | number | undefined) => {
  let val = ''
  if (undefined !== value && '' !== (value + '').trim()) {
    let pattern = ""
    let str = prop.minus ? '-?' : ''
    if (prop.decimal === 0) {
      pattern = `^${str}\\d+$`
    } else {
      pattern = `^${str}\\d+\\.?(\\d{1,${prop.decimal}})?$`
    }
    let reg = new RegExp(pattern)

    if ((prop.minus && value === '-') || reg.test(value + '')) {
      return value
    } else {
      return parseMoney(value, 4, prop.decimal)
    }
  }
  return val
};

/**
 * 转为货币
 * @param value
 * @param type 0-保留小数；1-向上取整；2-向下取整；3-四舍五入取整；4-向下保留小数
 * @param fixed
 * @returns {number}
 */
const parseMoney = (value: number | string, type = 0, fixed = 2) => {
  let _value = Number(value)
  if (isNaN(_value)) {
    return 0
  }
  switch (type) {
    case 0:
      _value = Number(_value.toFixed(fixed))
      break;
    case 1:
      _value = Math.ceil(_value)
      break;
    case 2:
      _value = Math.floor(_value)
      break;
    case 3:
      _value = Math.round(_value)
      break;
    case 4:
      _value = Math.floor(_value * 100) / 100
      _value = Number(_value.toFixed(fixed))
      break;
  }
  return _value
};

const onkeydown = (e: any) => {
    e.stopPropagation()
    if((e.keyCode < 48 || e.keyCode > 105) && e.keyCode !== 110 && e.keyCode !== 8) {
        e.preventDefault();
        return false;
    }
}

const onInput = (value: number | string) => {
  let val = check(value)
  emit('update:modelValue', val)
};

const onChange = (value: number | string) => {
  let val = check(value)
  emit('change', val)
}
</script>

<style scoped>

</style>
