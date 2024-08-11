<template>
  <el-tag
      v-for="tag in tags"
      :key="tag"
      class="mx-1"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 w-80"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
  />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + 新标签
  </el-button>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'
import {defineProps, withDefaults, defineEmits, watch, getCurrentInstance} from 'vue';

interface Props {
  modelValue: string,
}

const prop = withDefaults(
    defineProps<Props>(),
    {
      modelValue: '',
    }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>();

const {proxy} = getCurrentInstance() as any;

const inputValue = ref('')
const tags = ref([])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()


watch(()=> prop.modelValue,(val)=>{
  handlerToList(val)
})

const handlerToList = (val:any)=>{
  if (val) {
    tags.value = Array.isArray(val) ? val : val.split(',');
  } else {
    tags.value = [];
    return [];
  }
}

const handleClose = (tag: string) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handlerToString = () => {
  let tagStr = ""
  tagStr = tags.value.join(",")
  return tagStr
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    tags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''

  emit('update:modelValue', handlerToString());
}
</script>

<style scoped>

</style>
