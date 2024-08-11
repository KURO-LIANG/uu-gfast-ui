<template>
  <!-- 导入表 -->
  <el-dialog title="导入表" v-model="visible" width="800px" top="5vh" append-to-body :close-on-click-modal="false">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="tableRef" :data="dbTableList" @selection-change="handleSelectionChange"
                height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="表名称"></el-table-column>
        <el-table-column prop="tableComment" label="表描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
          @size-change="onHandleSizeChange"
      />
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImportTable">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {listDbTable, importTable} from "/@/api/gen";
import {defineComponent, reactive, ref, toRefs} from "vue";
import {ElMessage} from "element-plus";

interface tableState {
  // 遮罩层
  visible: boolean,
  // 选中数组值
  tables: Array<string>,
  // 总条数
  total: number,
  // 表数据
  dbTableList: [],
  // 查询参数
  queryParams: {
    pageNum: number,
    pageSize: number,
    tableName: string,
    tableComment: string
  }
}
export default defineComponent({
  name: 'ImportTable',
  setup(props,ctx) {

    const tableRef = ref()
    const state = reactive<tableState>({
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 总条数
      total: 0,
      // 表数据
      dbTableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: "",
        tableComment: ""
      }
    });
    // 查询表数据
    const getList = () => {
      listDbTable(state.queryParams).then(res => {
        state.dbTableList = res.data.list;
        state.total = res.data.total;
      });
    }
    // 显示弹框
    const show = () => {
      getList();
      state.visible = true;
    }
    const clickRow = (row:Object) => {
      tableRef.value.toggleRowSelection(row);
    }
    // 多选框选中数据
    const handleSelectionChange = (selection:Array<{tableName:string}>) =>{
      state.tables = selection.map(item => item.tableName);
    }
    /** 搜索按钮操作 */
    const handleQuery = ()=> {
      state.queryParams.pageNum = 1;
      getList();
    }
    /** 重置按钮操作 */
    const resetQuery = ()=> {
      handleQuery();
    }
    /** 导入按钮操作 */
    const handleImportTable = ()=> {
      if(state.tables.length==0){
        ElMessage.error("请选择要导入的表格");
        return
      }
      importTable({ tables: state.tables.join(",") }).then(res => {
        console.log('res',res)
        state.visible = false;
        ctx.emit("ok");
      });
    }
    return {
      tableRef,
      resetQuery,
      ...toRefs(state),
      getList,
      show,
      clickRow,
      handleSelectionChange,
      handleQuery,
      handleImportTable
    }
  }
})

// export default {
//   data() {
//     return {
//       // 遮罩层
//       visible: false,
//       // 选中数组值
//       tables: [],
//       // 总条数
//       total: 0,
//       // 表数据
//       dbTableList: [],
//       // 查询参数
//       queryParams: {
//         pageNum: 1,
//         pageSize: 10,
//         tableName: undefined,
//         tableComment: undefined
//       }
//     };
//   },
//   methods: {
//     // 显示弹框
//     show() {
//       this.getList();
//       this.visible = true;
//     },
//     clickRow(row) {
//       this.$refs.table.toggleRowSelection(row);
//     },
//     // 多选框选中数据
//     handleSelectionChange(selection) {
//       this.tables = selection.map(item => item.tableName);
//     },
//     // 查询表数据
//     getList() {
//       listDbTable(this.queryParams).then(res => {
//         if (res.code === 0) {
//           this.dbTableList = res.data.list;
//           this.total = res.data.total;
//         }
//       });
//     },
//     /** 搜索按钮操作 */
//     handleQuery() {
//       this.queryParams.pageNum = 1;
//       this.getList();
//     },
//     /** 重置按钮操作 */
//     resetQuery() {
//       this.resetForm("queryForm");
//       this.handleQuery();
//     },
//     /** 导入按钮操作 */
//     handleImportTable() {
//       if(this.tables.length==0){
//         this.msgError("请选择要导入的表格");
//         return
//       }
//       importTable({ tables: this.tables.join(",") }).then(res => {
//         this.msgSuccess(res.msg);
//         if (res.code === 0) {
//           this.visible = false;
//           this.$emit("ok");
//         }
//       });
//     }
//   }
// };
</script>
