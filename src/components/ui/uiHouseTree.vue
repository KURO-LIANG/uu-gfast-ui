<template>
  <div class="tree-wrapper">
    <el-tree :props="props" :data="treeDataList" node-key="treeKey" @check="handlerCheck" show-checkbox
             :default-checked-keys="checkKeys"></el-tree>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, ref, computed, reactive} from 'vue';
import {getTreeList} from '/@/api/base/house'
import {getRentLandlordParentHouseTreeList} from "/@/api/rent/landlord";

interface Tree {
  name: string
  leaf?: boolean
}

const props = {
  label: 'name',
  children: 'children',
  isLeaf: 'isHouse',
  disabled: 'disabled'
}

const disabledHouseIdList = ref<number[]>([]); //禁用的房号ID数组

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const prop = defineProps<{
  modelValue: string | number | Array<number>
  multiple?: boolean
}>();

const init = (landlordParentId: number, disabledList: Array<number>) => { //初始化方法
  disabledHouseIdList.value = disabledList ?? []
  query(landlordParentId)
}
const checkKeys = computed({
  get: () => {
    if (typeof prop.modelValue === 'object') {
      return prop.modelValue.map(item => {
        return 'H' + item
      })
    }
    return []
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})

//默认的节点数据
const treeDataList = computed({
  get: () => {
    return treeSetParams(dataList.value)
  },
  set: () => {

  }
})
// 深度设置参数
const treeSetParams = (list: Array<object>) => {
  return list.map((item: any) => {
    if (item.isHouse && disabledHouseIdList.value.includes(parseInt(item.treeKey))) {
      item.disabled = true
    } else {
      item.disabled = false
    }
    if (item.isHouse) { //设置房间的Key
      item.treeKey = `H` + item.treeKey
    }
    //设置子节点
    if (item.children) {
      item.children = treeSetParams(item.children)
    }
    //假如子节点都禁用了则父节点也禁用
    if (item.children && !item.disabled) {
      let disabled = true
      item.children.forEach((item: any) => {
        if (!item.disabled) {
          disabled = false
        }
      })
      item.disabled = disabled
    }
    //不是房间且没有子节点，则禁用
    if(!item.isHouse && (!item.children || !item.children.length)) {
      item.disabled = true
    }
    return item
  })
}

defineExpose({
  init
})
const dataList = ref([]);
const query = (landlordParentId: number) => {
  if (landlordParentId > 0) {
    getRentLandlordParentHouseTreeList(landlordParentId).then((res: any) => {
      if (res.code === 0) {
        dataList.value = res.data.list ?? []
      } else {
        dataList.value = []
      }
    })
  } else {
    getTreeList({parentId: 0}).then((res: any) => {
      if (res.code === 0) {
        dataList.value = res.data.list ?? []
      } else {
        dataList.value = []
      }
    })
  }
}

//点击节点复选框之后触发
const handlerCheck = (data: any, state: any) => {
  checkKeys.value = removeH(filterCheckKeys(state.checkedKeys))
}
//过滤选择的check
const filterCheckKeys = (checkedKeys: any) => {
  return checkedKeys.filter((item: string) => {
    return item.indexOf('H') > -1
  })
}
//移除H
const removeH = (checkedKeys: Array<string>) => {
  return checkedKeys.map((item: string) => {
    return item.substring(1, item.length)
  })
}
</script>
<style lang="scss">
.tree-wrapper {
  padding: 10px;
  min-width: 300px;
  border-radius: 5px;
  border: 1px solid #e5e5e5;
}
</style>
