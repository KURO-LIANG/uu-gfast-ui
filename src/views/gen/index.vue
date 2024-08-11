<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="表名称" prop="tableName">
        <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="success" class="ml10" @click="handleQuery">
          <el-icon>
            <ele-Search/>
          </el-icon>
          搜索
        </el-button>
        <el-button size="default" @click="resetQuery">
          <el-icon>
            <ele-Refresh/>
          </el-icon>
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button size="default" type="primary" class="ml10" @click="handleGenTable" :disabled="multiple">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          生成
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="default" type="warning" class="ml10" @click="openImportTable">
          <el-icon>
            <ele-Delete/>
          </el-icon>
          导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-col :span="1.5">
          <el-button size="default" type="info" class="ml10" @click="handleEditTable" :disabled="multiple">
            <el-icon>
              <ele-Delete/>
            </el-icon>
            修改
          </el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5">
        <el-button size="default" type="danger" class="ml10" @click="handleDelete" :disabled="multiple">
          <el-icon>
            <ele-Delete/>
          </el-icon>
          删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="100" align="center">
        <template #default="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="表名称"
          align="center"
          prop="tableName"
          :show-overflow-tooltip="true"
          width="180"
      />
      <el-table-column
          label="表描述"
          align="center"
          prop="tableComment"
          :show-overflow-tooltip="true"
          width="220"
      />
      <el-table-column
          label="实体"
          align="center"
          prop="className"
          :show-overflow-tooltip="true"
          width="160"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200"/>

      <el-table-column label="更新时间" align="center" prop="updateTime" width="200"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              size="small"
              icon="el-icon-view"
              @click="handlePreview(scope.row)"
          >预览
          </el-button>
          <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="handleEditTable(scope.row)"
          >编辑
          </el-button>
          <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
              type="text"
              size="small"
              icon="el-icon-download"
              @click="handleGenTable(scope.row)"
          >生成代码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
        @size-change="onHandleSizeChange"
    />
    <!-- 预览界面 -->
    <el-dialog :title="preview.title" v-model="preview.open" width="80%" top="5vh" append-to-body
               :close-on-click-modal="false">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
            v-for="(value, key) in preview.data"
            :label="key"
            :name="key"
            :key="key"
        >
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="importRef" @ok="handleQuery"/>
    <el-dialog v-model="editShow" title="编辑" width="90%">
      <edit-table :value="tableId" v-if="tableId > 0" @ok="handlerOk"></edit-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {listTable, previewTable, delTable, batchGenCode} from "/@/api/gen";
import importTable from "./importTable.vue";
import editTable from "./editTable.vue";
import {defineComponent, reactive, ref, toRefs} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

interface TableData {
  tableId: number;
  tableName: string;
  tableComment: string;
  className: string;
  tplCategory: number;
  packageName: string;
  moduleName: string;
  businessName: string;
  functionName: string;
  functionAuthor: string;
  options: string;
  createTime: string;
  updateTime: string;
  remark: string;
}

interface TableDataState {
  ids: number[];
  data: Array<TableData>;
  // 选中表数组
  tableNames: Array<string>,
  // 非单个禁用
  single: boolean,
  // 非多个禁用
  multiple: boolean,
  total: number;
  loading: boolean;
  queryParams: {
    tableName: string;
    pageNum: number,
    pageSize: number,
  };
  preview: {
    open: boolean,
    title: "代码预览",
    data: Object,
    activeName: string
  },
  editShow: boolean,
  tableId: number,
}

export default defineComponent({
  name: 'Gen',
  components: {importTable, editTable},
  setup() {
    const importRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      data: [],
      total: 0,
      // 选中表数组
      tableNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      loading: false,
      queryParams: {
        tableName: '',
        pageNum: 1,
        pageSize: 10,
      },
      preview: {
        open: false,
        title: "代码预览",
        data: {},
        activeName: "controller"
      },
      editShow: false,
      tableId: 0
    });
    const loading = ref(false);
    /**查询列表 */
    const getList = () => {
      loading.value = true;
      listTable(state.queryParams).then(response => {
            state.data = response.data.list;
            state.total = response.data.total;
            state.loading = false;
          }
      );
    }
    getList()//初始化
    /** 搜索按钮操作 */
    const handleQuery = () => {
      state.queryParams.pageNum = 1;
      getList()
    }
    /** 生成代码操作 */
    const handleGenTable = (row: TableData) => {
      const tableIds = [row.tableId] || state.ids;
      ElMessageBox.confirm('是否确认要生成对应的代码文件，部分数据将被覆盖? 生成后请重启前后端服务。', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return batchGenCode(tableIds);
      }).then(() => {
        ElMessage.success("生成成功");
      }).catch(function () {
      });
    }
    /** 打开导入表弹窗 */
    const openImportTable = () => {
      importRef.value.show();
    }
    /** 重置按钮操作 */
    const resetQuery = () => {
      handleQuery();
    }
    /** 预览按钮 */
    const handlePreview = (row: TableData) => {
      previewTable(row.tableId).then(response => {
        state.preview.data = response.data.data;
        state.preview.open = true;
      });
    }
    // 多选框选中数据
    const handleSelectionChange = (selection: Array<TableData>) => {
      state.ids = selection.map(item => item.tableId);
      state.tableNames = selection.map(item => item.tableName);
      state.single = selection.length != 1;
      state.multiple = !selection.length;
    }
    //分页改变
    const onHandleSizeChange = (val: any) => {
      state.queryParams.pageNum = 1
    }
    /** 修改按钮操作 */
    const handleEditTable = (row: TableData) => {
      state.tableId = row.tableId || state.ids[0];
      state.editShow = true
      //router.push({path: "/gen/edit", query: {tableId: tableId}});
    }
    /** 删除按钮操作 */
    const handleDelete = (row: TableData) => {
      const tableIds = [row.tableId] || state.ids;
      ElMessageBox.confirm('是否确认删除表编号为"' + tableIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delTable(tableIds);
      }).then(() => {
        getList();
        ElMessage.success("删除成功");
      }).catch(function () {
      });
    }
    const handlerOk = () => {
      console.log('设置OK了');
      state.editShow = false
      getList()
    }
    return {
      importRef,
      getList,
      handleQuery,
      handleGenTable,
      openImportTable,
      resetQuery,
      handlePreview,
      handleSelectionChange,
      handleEditTable,
      handleDelete,
      handlerOk,
      onHandleSizeChange,
      ...toRefs(state),
    }
  }
})


// export default {
//   name: "Gen",
//   components: { importTable },
//   data() {
//     return {
//       // 遮罩层
//       loading: true,
//       // 唯一标识符
//       uniqueId: "",
//       // 选中数组
//       ids: [],
//       // 选中表数组
//       tableNames: [],
//       // 非单个禁用
//       single: true,
//       // 非多个禁用
//       multiple: true,
//       // 总条数
//       total: 0,
//       // 表数据
//       tableList: [],
//       // 日期范围
//       dateRange: "",
//       // 查询参数
//       queryParams: {
//         pageNum: 1,
//         pageSize: 10,
//         tableName: undefined,
//         tableComment: undefined
//       },
//       // 预览参数
//       preview: {
//         open: false,
//         title: "代码预览",
//         data: {},
//         activeName: "controller"
//       }
//     };
//   },
//   created() {
//     this.getList();
//   },
//   activated() {
//     const time = this.$route.query.t;
//     if (time != null && time != this.uniqueId) {
//       this.uniqueId = time;
//       this.resetQuery();
//     }
//   },
//   methods: {
//     /** 查询表集合 */
//     getList() {
//       this.loading = true;
//       listTable(this.queryParams).then(response => {
//           this.tableList = response.data.list;
//           this.total = response.data.total;
//           this.loading = false;
//         }
//       );
//     },
//     /** 搜索按钮操作 */
//     handleQuery() {
//       this.queryParams.pageNum = 1;
//       this.getList();
//     },
//     /** 生成代码操作 */
//     handleGenTable(row) {
//       const tableIds = row.tableId || this.ids;
//       this.$confirm('是否确认要生成对应的代码文件，部分数据将被覆盖? 生成后请重启前后端服务。', "警告", {
//         confirmButtonText: "确定",
//         cancelButtonText: "取消",
//         type: "warning"
//       }).then(function() {
//         return batchGenCode(tableIds);
//       }).then(() => {
//         this.msgSuccess("生成成功");
//       }).catch(function() {});
//     },
//     /** 打开导入表弹窗 */
//     openImportTable() {
//       this.$refs.import.show();
//     },
//     /** 重置按钮操作 */
//     resetQuery() {
//       this.dateRange = [];
//       this.resetForm("queryForm");
//       this.handleQuery();
//     },
//     /** 预览按钮 */
//     handlePreview(row) {
//       previewTable(row.tableId).then(response => {
//         this.preview.data = response.data;
//         this.preview.open = true;
//       });
//     },
//     // 多选框选中数据
//     handleSelectionChange(selection) {
//       this.ids = selection.map(item => item.tableId);
//       this.tableNames = selection.map(item => item.tableName);
//       this.single = selection.length != 1;
//       this.multiple = !selection.length;
//     },
//     /** 修改按钮操作 */
//     handleEditTable(row) {
//       const tableId = row.tableId || this.ids[0];
//       this.$router.push({ path: "/gen/edit", query: { tableId: tableId } });
//     },
//     /** 删除按钮操作 */
//     handleDelete(row) {
//       const tableIds = row.tableId || this.ids;
//       this.$confirm('是否确认删除表编号为"' + tableIds + '"的数据项?', "警告", {
//         confirmButtonText: "确定",
//         cancelButtonText: "取消",
//         type: "warning"
//       }).then(function() {
//           return delTable(tableIds);
//       }).then(() => {
//           this.getList();
//           this.msgSuccess("删除成功");
//       }).catch(function() {});
//     }
//   }
// };
</script>
