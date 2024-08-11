<template>
    <div>
        <div class="el-input el-input--default el-input-group el-input-group--append">
            <div class="flex-item el-input__wrapper flex-warp cs-input-group">
                <el-tag
                    class="gap-mr-xxs gap-mt-xxs"
                    type="info"
                    size="small"
                    v-for="(item, index) of tags"
                    :key="item.id"
                    closable
                    @close="onRemove(index)"
                >{{ item.houseNo }}
                </el-tag>
            </div>
            <view class="el-input-group__append pointer" @click="onShow">
                <el-icon>
                    <OfficeBuilding/>
                </el-icon>
            </view>
        </div>
        <el-dialog v-model="visible" width="600px" append-to-body>
            <el-form :model="queryData">
                <div class="flex-row">
                    <el-form-item class="flex-item" label="楼层">
                        <async-estate-struct-select v-model="queryData.structId" check-strictly/>
                    </el-form-item>
                    <el-form-item class="gap-ml">
                        <el-button type="primary" @click="query">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <div class="gap-mt gap-mb flex-row flex-between">
                <span>房间列表：</span>
                <el-checkbox v-if="multiple" v-model="checkAll" @change="changeAll">全选</el-checkbox>
            </div>
            <div style="height: 300px;" v-loading="loading">
                <el-empty v-if="!dataList.length"/>
                <el-checkbox-group v-if="multiple" v-model="_values">
                    <el-checkbox class="cs-width-6em" v-for="item of dataList" :key="item.id" :label="item.id">
                        {{ item.houseNo }}
                    </el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-else v-model="_value">
                    <el-radio class="cs-width-6em" v-for="item of dataList" :key="item.id" :label="item.id">
                        {{ item.houseNo }}
                    </el-radio>
                </el-radio-group>
            </div>
            <template #footer>
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import {defineProps, ref, reactive, toRaw, computed, watch, onMounted} from 'vue';
import AsyncEstateStructSelect from "/@/components/async/asyncEstateStructSelect.vue";
import {getList, getAllList} from '/@/api/base/house'
import {OfficeBuilding} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

// 定义接口来定义对象的类型
interface TableData {
    id: number;
    structId?: string;
    estateId?: string;
    houseModelId?: string;
    houseNo: string;
    fullHouseNo?: string;
    createdBy?: string;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'change', value: any): void
}>()

const prop = defineProps<{
    modelValue: string | number | Array<number>
    multiple?: boolean,
    defaults?: Array<TableData>
}>();

const visible = ref(false);
const loading = ref(false);
const checkAll = ref(false);
const dataList = ref<Array<TableData>>([]);
const _value = ref();
const _values = ref<Array<number>>([]);
const tags = ref<Array<TableData>>([]);
const queryData = reactive({
    structId: '',
    page: 1,
    limit: 500,
});

const selectedData = computed(() => {
    return dataList.value.filter((item: any) => _value.value === item.id || _values.value.includes(item.id))
});

watch(() => prop.modelValue, (nv: any, ov) => {
  initData()
})

const initData = () => {
  if(!prop.modelValue) {
    tags.value = [];
  } else {
    let ids: number[] = [];
    if (prop.multiple) {
      ids = prop.modelValue as Array<number>
    } else {
      ids = [prop.modelValue as number]
    }
    if(ids.length) {
      getAllList({
        houseIds: ids,
      }).then(res => {
        tags.value = res;
      })
    } else {
      tags.value = [];
    }
  }
}

const query = () => {
    loading.value = true
    getList(toRaw(queryData)).then((res: any) => {
        if (res.code === 0) {
            dataList.value = res.data.list ?? []
        } else {
            dataList.value = []
        }
    }).finally(() => {
        checkAll.value = false
        loading.value = false
    })
}

const onShow = () => {
    query()
    checkAll.value = false;
    visible.value = true;
    _values.value = [];
    _value.value = '';
}

//移除房间
const onRemove = (index: number) => {
    if (prop.multiple) {
        tags.value.splice(index, 1)
    } else {
        tags.value = [];
    }
    emitUpdate()
}

const confirm = () => {
    if (!_values.value.length && !_value.value) {
        ElMessage.error('请选择房间');
        return;
    }
    visible.value = false
    emitUpdate()
}

const emitUpdate = () => {
    if (prop.multiple) {
        const ids = _values.value.concat(prop.modelValue as number[])
        const _ids = Array.from(new Set(ids));
        emit('update:modelValue', _ids)
        emit('change', _ids)
    } else {
        emit('update:modelValue', _value.value)
        emit('change', _value.value)
    }
}

const changeAll = (v: boolean) => {
    if (v) {
        _values.value = dataList.value.map(item => item.id);
    } else {
        _values.value = []
    }
}

onMounted(initData)
</script>
