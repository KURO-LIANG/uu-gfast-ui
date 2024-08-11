<template>
  <div class="system-post-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :inline="true" :model="tableData.param" ref="queryRef" label-width="68px">
          <!--          <el-form-item label="父ID" prop="parentId">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.parentId"-->
          <!--                placeholder="请输入父ID"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item label="名称" prop="regionName">
            <el-input
                size="default"
                v-model="tableData.param.regionName"
                placeholder="请输入名称"
                clearable
            />
          </el-form-item>
          <el-form-item label="全称" prop="mergerName">
            <el-input
                size="default"
                v-model="tableData.param.mergerName"
                placeholder="请输入全称"
                clearable
            />
          </el-form-item>
          <!--          <el-form-item label="简称" prop="shortName">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.shortName"-->
          <!--                placeholder="请输入简称"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="简称合并" prop="mergerShortName">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.mergerShortName"-->
          <!--                placeholder="请输入简称合并"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item label="行政等级" prop="level" style="width: 200px;">
            <el-select
                v-model="tableData.param.level"
                placeholder="行政等级"
                clearable
                size="default"
                style="width: 240px"
            >
              <el-option label="全部" :value="0"/>
              <el-option label="省份" :value="1"/>
              <el-option label="城市" :value="2"/>
              <el-option label="区县" :value="3"/>
            </el-select>
          </el-form-item>

          <!--          <el-form-item label="城市代码" prop="cityCode">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.cityCode"-->
          <!--                placeholder="请输入城市代码"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="邮编号码" prop="zipCode">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.zipCode"-->
          <!--                placeholder="请输入邮编号码"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="全拼" prop="fullPinyin">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.fullPinyin"-->
          <!--                placeholder="请输入全拼"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="简拼" prop="simplifiedPinyin">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.simplifiedPinyin"-->
          <!--                placeholder="请输入简拼"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="第一个字" prop="firstChar">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.firstChar"-->
          <!--                placeholder="请输入第一个字"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="纬度" prop="longitude">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.longitude"-->
          <!--                placeholder="请输入纬度"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="经度" prop="latitude">-->
          <!--            <el-input-->
          <!--                size="default"-->
          <!--                v-model="tableData.param.latitude"-->
          <!--                placeholder="请输入经度"-->
          <!--                clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search/>
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh/>
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="primary" class="ml10" @click="handlerAdd" v-auth="'base/region/add'">
              <el-icon>
                <ele-FolderAdd/>
              </el-icon>
              新增
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="handlerDel(null)"
                       v-auth="'base/region/delete'">
              <el-icon>
                <ele-Delete/>
              </el-icon>
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange"
                v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="ID" align="center" prop="id" show-overflow-tooltip/>
        <el-table-column label="父ID" align="center" prop="parentId" show-overflow-tooltip/>
        <el-table-column label="名称" align="center" prop="regionName" show-overflow-tooltip/>
        <el-table-column label="全称" align="center" prop="mergerName" show-overflow-tooltip/>
        <!--        <el-table-column label="简称" align="center" prop="shortName" show-overflow-tooltip/>-->
        <!--        <el-table-column label="简称合并" align="center" prop="mergerShortName" show-overflow-tooltip/>-->
        <el-table-column label="行政等级" align="center" prop="level" show-overflow-tooltip/>
        <!--        <el-table-column label="城市代码" align="center" prop="cityCode" show-overflow-tooltip/>-->
        <!--        <el-table-column label="邮编号码" align="center" prop="zipCode" show-overflow-tooltip/>-->
        <!--        <el-table-column label="全拼" align="center" prop="fullPinyin" show-overflow-tooltip/>-->
        <!--        <el-table-column label="简拼" align="center" prop="simplifiedPinyin" show-overflow-tooltip/>-->
        <!--        <el-table-column label="第一个字" align="center" prop="firstChar" show-overflow-tooltip/>-->
        <!--        <el-table-column label="纬度" align="center" prop="longitude" show-overflow-tooltip/>-->
        <!--        <el-table-column label="经度" align="center" prop="latitude" show-overflow-tooltip/>-->
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handlerEdit(scope.row)" v-auth="'base/region/edit'">
              修改
            </el-button>
            <el-button size="small" type="primary" link @click="handlerDel(scope.row)" v-auth="'base/region/delete'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="queryList"
      />
    </el-card>
    <EditRegion ref="editRef" @getList="queryList"/>
  </div>
</template>
<script lang="ts">
import {toRefs, reactive, onMounted, ref, defineComponent, toRaw} from 'vue';
import {ElMessageBox, ElMessage} from 'element-plus';
import {getList, deleteRegion} from "/@/api/base/region";
import EditRegion from "/@/views/base/region/component/editRegion.vue";
import {FormInstance} from "element-plus/es";

// 定义接口来定义对象的类型
interface TableData {
  id: number;
  parentId: string;
  regionName: string;
  mergerName: string;
  shortName: string;
  mergerShortName: string;
  level: number;
  cityCode: string;
  zipCode: string;
  fullPinyin: string;
  simplifiedPinyin: string;
  firstChar: string;
  longitude: string;
  latitude: string;
}

interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableData>;
    total: number;
    loading: boolean;
    param: {
      parentId: string;
      regionName: string;
      mergerName: string;
      shortName: string;
      mergerShortName: string;
      level: number;
      cityCode: string;
      zipCode: string;
      fullPinyin: string;
      simplifiedPinyin: string;
      firstChar: string;
      longitude: string;
      latitude: string;
      pageNum: number;
      pageSize: number;
    };
  };
}

export default defineComponent({
  name: 'RegionList',
  components: {EditRegion},
  setup() {
    const editRef = ref();
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          parentId: '',
          regionName: '',
          mergerName: '',
          shortName: '',
          mergerShortName: '',
          level: 0,
          cityCode: '',
          zipCode: '',
          fullPinyin: '',
          simplifiedPinyin: '',
          firstChar: '',
          longitude: '',
          latitude: '',
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      queryList()
    };
    const queryList = () => {
      state.tableData.loading = true
      getList(state.tableData.param).then(res => {
        state.tableData.data = res.data.list ?? [];
        state.tableData.total = res.data.total;
        state.tableData.loading = false;
      }).catch(e => {
        state.tableData.data = [];
        state.tableData.loading = false;
      })
    };
    // 打开新增弹窗
    const handlerAdd = () => {
      editRef.value.openDialog();
    };
    // 打开修改弹窗
    const handlerEdit = (row: Object) => {
      editRef.value.openDialog(toRaw(row));
    };
    // 删除
    const handlerDel = (row: any) => {
      let msg = '你确定要删除所选的数据？';
      let ids: number[] = [];
      if (row) {
        ids = [row.id]
      } else {
        ids = state.ids
      }
      if (ids.length === 0) {
        ElMessage.error('请选择要删除的数据。');
        return
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteRegion(ids).then(() => {
              ElMessage.success('删除成功');
              queryList();
            })
          })
          .catch(() => {
          });
    };
    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 多选框选中数据
    const handleSelectionChange = (selection: Array<TableData>) => {
      state.ids = selection.map(item => item.id)
    };
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      queryList()
    };
    return {
      queryRef,
      editRef,
      handlerAdd,
      handlerEdit,
      handlerDel,
      onHandleSizeChange,
      onHandleCurrentChange,
      queryList,
      handleSelectionChange,
      resetQuery,
      ...toRefs(state),
    };
  },
});
</script>
