<template>
  <div>
    <el-select :model-value="province" @change="changeProvince" style="width: 150px">
      <el-option :value="''" label="请选择"></el-option>
      <el-option v-for="item of provinceList" :key="item" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <el-select v-if="cityList.length" :model-value="city" @change="changeCity" style="width: 150px;margin-left:6px;">
      <el-option :value="''" label="请选择"></el-option>
      <el-option v-for="item of cityList" :key="item" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <el-select v-if="areaList.length" :model-value="area" @change="changeArea" style="width: 150px;margin-left:6px;">
      <el-option :value="''" label="请选择"></el-option>
      <el-option v-for="item of areaList" :key="item" :value="item.value" :label="item.label"></el-option>
    </el-select>
<!--    <el-select v-if="streetList.length" :model-value="street" @change="changeStreet" style="width: 150px;margin-left:6px;">-->
<!--      <el-option :value="''" label="请选择"></el-option>-->
<!--      <el-option v-for="item of streetList" :key="item" :value="item.value" :label="item.label"></el-option>-->
<!--    </el-select>-->
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref, defineProps, defineEmits, computed} from 'vue';
import chinaAreaData from "/@/data/chinaAreaData202001.js";

interface AreaOption {
  value: string,
  label: string
}

interface Props {
  province?: string
  city?: string
  area?: string
  // street?: string
}

interface Emits {
  (e: 'update:province', value: string): void
  (e: 'update:city', value: string): void
  (e: 'update:area', value: string): void
  // (e: 'update:street', value: string): void
  (e: 'change', value: Array<any>|undefined): void
}

const emit = defineEmits<Emits>();

const areaData = chinaAreaData();
const provinceList: Ref<Array<AreaOption>> = ref([]);
// const cityList: Ref<Array<AreaOption>> = ref([]);
// const areaList: Ref<Array<AreaOption>> = ref([]);
// const streetList: Ref<Array<AreaOption>> = ref([]);
const labels = ref<Array<any>>([]);
const props = defineProps<Props>();

const cityList = computed(() => {
  return getData(props.province ?? '')
})
const areaList = computed(() => {
  return getData(props.city ?? '')
})
// const streetList = computed(() => {
//   return getData(props.area ?? '')
// })

const getData = (key: string) : Array<AreaOption> => {
  const _list: Array<AreaOption> = [];

  for(let k in areaData[key]) {
    _list.push({
      value: k,
      label: areaData[key][k]
    })
  }
  return _list;
}

const changeProvince = (value: string) => {
  // cityList.value = getData(value);
  // areaList.value = [];
  // streetList.value = [];
  emit('update:province', value);
  emit('update:city', '');
  emit('update:area', '');
  // emit('update:street', '');
  let province = provinceList.value.find(item => item.value == value)
  labels.value = ["","",""]
  labels.value[0] = province?.label
  labels.value[1] = ""
  labels.value[2] = ""
  // labels.value[3] = ""
  emit('change', labels.value);
}

const changeCity = (value: string) => {
  // areaList.value = getData(value);
  // streetList.value = [];
  emit('update:city', value);
  emit('update:area', '');
  // emit('update:street', '');
  let city = cityList.value.find(item => item.value == value)
  labels.value[1] = city?.label
  labels.value[2] = ""
  // labels.value[3] = ""
  emit('change', labels.value);
}

const changeArea = (value: string) => {
  // streetList.value = getData(value);
  emit('update:area', value);
  // emit('update:street', '');
  let area = areaList.value.find(item => item.value == value)
  labels.value[2] = area?.label
  // labels.value[3] = ""
  emit('change', labels.value);
}

// const changeStreet = (value: string) => {
//   emit('update:street', value);
//   let street = streetList.value.find(item => item.value == value)
//   labels.value[3] = street?.label
//   emit('change', labels.value);
// }

onMounted(() => {
  provinceList.value = getData('86');
  // cityList.value = [];
  // areaList.value = [];
  // streetList.value = [];
})
</script>

<style scoped>

</style>
