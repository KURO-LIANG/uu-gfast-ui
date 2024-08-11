<template>
  <div class="ui-desc">
    <div class="ui-desc__label" :style="style">
      {{label}}
    </div>
    <div class="ui-desc__content">
      <slot>{{content}}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(
    defineProps<{
      label: string
      content?: string
      labelWidth?: string
    }>(),
    {
      label: '',
      content: '',
      labelWidth: '6em',
    }
)

const style = computed(() => {
  return {
    width: props.labelWidth,
  }
})
</script>

<style scoped>
  .ui-desc {
    display: flex;
  }
  .ui-desc__label {
    padding: 0.5em 0;
    text-align: right;
    min-width: 0;
    color: #787878;
  }
  .ui-desc__content {
    flex: 1;
    min-width: 0;
    padding: 0.5em 0;
  }
</style>
