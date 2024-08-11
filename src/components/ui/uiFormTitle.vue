<template>
  <div class="">
    <div class="f_l black-div"></div>
    <span class="f_l basic-data">{{title}}</span>
  </div>
  <div class="clearfix gap-mb-xs"></div>
</template>

<script lang="ts" setup>
import {defineProps, withDefaults} from 'vue';

interface Props {
  title :string
}
const prop = withDefaults(
    defineProps<Props>(),
    {
      title:''
    }
);
</script>

<style scoped>
.f_l {
  float: left;
}
.black-div {
  width: 5px;
  height: 30px;
  background-color: #555;
}
.basic-data {
  font-family: "Microsoft YaHei", "Lucida Grande", "Lucida Sans Unicode", Tahoma, Helvetica, Arial, sans-serif;
  color: #555;
  line-height: 30px;
  font-size: 17px;
  font-weight: 700;
  margin-left: 20px;
}
cl, .clearfix {
  zoom: 1;
}
.cl:after, .clearfix:after {
  content: "\20";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
