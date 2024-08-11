<template>

</template>
<script lang="ts">

import {defineComponent, reactive, toRefs} from "vue";

interface basicState {
  rules: object;
}

export default defineComponent({
  name: 'BasicInfoForm',
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  setup() {
    const state = reactive<basicState>({
      rules: {
        tableName: [
          {required: true, message: "请输入表名称", trigger: "blur"}
        ],
        tableComment: [
          {required: true, message: "请输入表描述", trigger: "blur"}
        ],
        className: [
          {required: true, message: "请输入实体类名称", trigger: "blur"}
        ],
        functionAuthor: [
          {required: true, message: "请输入作者", trigger: "blur"}
        ]
      }
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
