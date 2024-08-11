<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="basicInfoForm" :model="info" :rules="rules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="表名称" prop="tableName">
                <el-input placeholder="请输入仓库名称" v-model="info.tableName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表描述" prop="tableComment">
                <el-input placeholder="请输入" v-model="info.tableComment"/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="实体类名称" prop="className">
                <el-input placeholder="请输入" v-model="info.className"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作者" prop="functionAuthor">
                <el-input placeholder="请输入" v-model="info.functionAuthor"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" maxlength="20" show-word-limit  :rows="3" v-model="info.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="cloum">
        <el-alert
          title="⚠️表字段中的created_by、updated_by、updated_at、deleted_at的字段在此列表中已经隐藏"
          type="warning"
          show-icon
        />
        <el-table ref="dragTable" :data="cloumns" :max-height="tableHeight" width="100%">
          <el-table-column label="序号" type="index" width="50" fixed />
          <el-table-column
            label="字段列名"
            prop="columnName"
            width="150"
            fixed
            :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" width="150" fixed>
            <template #default="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            class-name="allowDrag"
            label="物理类型"
            prop="columnType"
            width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="go类型" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.goType">
                <el-option label="int" value="int" />
                <el-option label="uint" value="uint" />
                <el-option label="int64" value="int64" />
                <el-option label="uint64" value="uint64" />
                <el-option label="float64" value="float64" />
                <el-option label="string" value="string" />
                <el-option label="Time" value="Time" />
                <el-option label="byte" value="byte" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="go属性" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.goField"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="json属性" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.htmlField" />
            </template>
          </el-table-column>

          <el-table-column label="插入" width="50">
            <template #default="scope">
              <el-checkbox true-label="1" v-model="scope.row.isInsert" :disabled="scope.row.isPk=='1' || scope.row.columnName=='created_at'"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" width="50">
            <template #default="scope">
              <el-checkbox true-label="1" v-model="scope.row.isEdit" :disabled="scope.row.isPk=='1' || scope.row.columnName=='created_at'"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表" width="50">
            <template #default="scope">
              <el-checkbox true-label="1" v-model="scope.row.isList" :disabled="scope.row.htmlField==info.treeParentCode"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询" width="50">
            <template #default="scope">
              <el-checkbox true-label="1" v-model="scope.row.isQuery" :disabled="scope.row.htmlField==info.treeParentCode"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.queryType">
                <el-option label="=" value="EQ" />
                <el-option label="!=" value="NE" />
                <el-option label=">" value="GT" />
                <el-option label=">=" value="GTE" />
                <el-option label="<" value="LT" />
                <el-option label="<=" value="LTE" />
                <el-option label="LIKE" value="LIKE" />
                <el-option label="BETWEEN" value="BETWEEN" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" width="50">
            <template #default="scope">
              <el-checkbox true-label="1" v-model="scope.row.isRequired"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="显示类型" width="140">
            <template #default="scope">
              <el-select v-model="scope.row.htmlType" :disabled="scope.row.htmlField==info.treeParentCode">
                <el-option label="文本框" value="input" />
                <el-option label="文本域" value="textarea" />
                <el-option label="下拉框" value="select" />
                <el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" />
                <el-option label="日期控件" value="datetime" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" width="160">
            <template #default="scope">
              <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                <el-option
                  v-for="dict in dictOptions"
                  :key="dict.dictType"
                  :label="dict.dictName"
                  :value="dict.dictType">
                  <span style="float: left">{{ dict.dictName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
              </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="关联表" width="160">
            <template #default="scope">
              <el-select v-model="scope.row.linkTableName" clearable filterable placeholder="请选择" @change="handleChangeConfig(scope.row,scope.$index)">
                <el-option
                  v-for="table in relationTable"
                  :key="table.tableName"
                  :label="table.tableName"
                  :value="table.tableName"
                >
                  <span style="float: left">{{ table.tableName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ table.tableComment }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="genInfo">
        <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="tplCategory" label="生成模板">
                <el-select v-model="info.tplCategory">
                  <el-option label="单表（增删改查）" value="crud" />
                  <el-option label="树表（增删改查）" value="tree"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="packageName" label="生成包路径">
                <el-input v-model="info.packageName" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="moduleName" label="生成模块名">
                <el-input v-model="info.moduleName" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="businessName" label="生成业务名">
                <el-input v-model="info.businessName" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="functionName" label="生成功能名">
                <el-input v-model="info.functionName" />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts">
import { getGenTable, updateGenTable ,getRelationTable} from "/@/api/gen";
import {ElMessage, FormInstance} from "element-plus";
import {defineComponent, reactive, ref, toRefs, unref} from "vue";

interface column {
  columnId : number;
  tableId : number;
  columnName:string;
  columnComment:string;
  columnType:string;
  goType:string;
  goField :string;
  htmlField:string;
  isPk:string;
  isIncrement:string;
  isRequired:string;
  isInsert:string;
  isEdit:string;
  isList:string;
  isQuery:string;
  queryType:string;
  htmlType:string;
  dictType:string;
  sort:number;
  linkTableName:string;
  linkTableClass:string;
  linkTablePackage:string;
  linkLabelId:string;
  linkLabelName:string;
}

interface TableDataState {
  // 选中选项卡的 name
  activeName: string;
  // 表格的高度
  tableHeight:string;
  // 表列信息
  cloumns:Array<column> ;
  // 字典信息
  dictOptions: [];
  // 表详细信息
  info: {
    tableName:string;
    tableComment:string;
    className:string;
    functionAuthor:string;
    remark:string;
    tplCategory:string;
    functionName:string;
    businessName:string;
    moduleName:string;
    packageName:string;
    columns:Array<column>
  },
  //关联表选项
  relationTable:[],
  rules:Object
}

export default defineComponent({
  name: 'GenEdit',
  props: {
    value: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props,ctx) {
    const basicInfoForm = ref<HTMLElement | null>(null);
    const genInfoForm = ref<HTMLElement | null>(null);
    const state = reactive<TableDataState>({
      // 选中选项卡的 name
      activeName: "basic",
      // 表格的高度
      tableHeight:document.documentElement.scrollHeight+ "px",
      // 表列信息
      cloumns: [],
      // 字典信息
      dictOptions: [],
      // 表详细信息
      info: {
        tableName:'',
        tableComment:'',
        className:'',
        functionAuthor:'',
        remark:'',
        tplCategory:'',
        functionName:'',
        businessName:'',
        moduleName:'',
        packageName:'',
        columns:[]
      },
      //关联表选项
      relationTable:[],
      rules:{
        tableName: [
          { required: true, message: "请输入表名称", trigger: "blur" }
        ],
        tableComment: [
          { required: true, message: "请输入表描述", trigger: "blur" }
        ],
        className: [
          { required: true, message: "请输入实体类名称", trigger: "blur" }
        ],
        functionAuthor: [
          { required: true, message: "请输入作者", trigger: "blur" }
        ],
        tplCategory: [
          { required: true, message: "请选择生成模板", trigger: "blur" }
        ],
        packageName: [
          { required: true, message: "请输入生成包路径", trigger: "blur" }
        ],
        moduleName: [
          { required: true, message: "请输入生成模块名", trigger: "blur" }
        ],
        businessName: [
          { required: true, message: "请输入生成业务名", trigger: "blur" }
        ],
        functionName: [
          { required: true, message: "请输入生成功能名", trigger: "blur" }
        ]
      }
    })
    const init = ()=>{
      getGenTable(props.value).then(res => {
        let columns = []
        columns = res.data.rows.filter((item:column)=>{
          return !['created_by','updated_by','updated_at','deleted_at'].includes(item.columnName)
        })
        state.cloumns = columns;
        state.info = res.data.info;
        state.info.columns = state.cloumns;
      });
      //获取关联选项表
      getRelationTable().then(res=>{
        state.relationTable = res.data
      })
    }
    init();

    //提交表单
    const submitForm = ()=> {
      const basicInfoFormRef = unref(basicInfoForm) as any;
      const genInfoFormRef = unref(genInfoForm) as any;
      Promise.all([basicInfoFormRef, genInfoFormRef].map(getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item);
        if (validateResult) {
          const genTable = Object.assign({}, state.info);
          genTable.columns = state.cloumns;
          // genTable.params = {
          //   treeCode: genTable.treeCode,
          //   treeName: genTable.treeName,
          //   treeParentCode: genTable.treeParentCode
          // };
          updateGenTable(genTable).then(() => {
            ElMessage.success("操作成功");
            ctx.emit('ok')
          });
        } else {
          ElMessage.error("表单校验未通过，请重新检查提交内容");
        }
      });
    }
    //子组件修改info的column
    const setInfoColumn = (column:[])=>{
      state.info.columns = column;
    }
    const getFormPromise = (form:FormInstance)=> {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res);
        });
      });
    }
    const handleChangeConfig = ()=> {
      // state.relationTable.filter(function(item) {
      //   if (item.tableName === row.linkTableName) {
      //     row.fkCol = item.columns
      //   }
      // })
    }
    return {
      basicInfoForm,
      genInfoForm,
      submitForm,
      setInfoColumn,
      getFormPromise,
      handleChangeConfig,
      ...toRefs(state)
    }
  }
})

// export default {
//   name: "GenEdit",
//   components: {
//     basicInfoForm,
//     genInfoForm
//   },
//   data() {
//     return {
//       // 选中选项卡的 name
//       activeName: "cloum",
//       // 表格的高度
//       tableHeight: document.documentElement.scrollHeight - 245 + "px",
//       // 表列信息
//       cloumns: [],
//       // 字典信息
//       dictOptions: [],
//       // 表详细信息
//       info: {},
//       //关联表选项
//       relationTable:[],
//     };
//   },
//   beforeCreate() {
//     const { tableId } = this.$route.query;
//     if (tableId) {
//       // 获取表详细信息
//       getGenTable(tableId).then(res => {
//         let columns = []
//         columns = res.data.rows.filter(item=>{
//           return !['created_by','updated_by','updated_at','deleted_at'].includes(item.columnName)
//         })
//         this.cloumns = columns;
//         this.info = res.data.info;
//         this.info.columns = this.cloumns;
//       });
//       //获取关联选项表
//       getRelationTable().then(res=>{
//         this.relationTable = res.data
//       })
//     }
//   },
//   methods: {
//     /** 提交按钮 */
//     submitForm() {
//       const basicForm = this.$refs.basicInfo.$refs.basicInfoForm;
//       const genForm = this.$refs.genInfo.$refs.genInfoForm;
//       Promise.all([basicForm, genForm].map(this.getFormPromise)).then(res => {
//         const validateResult = res.every(item => !!item);
//         if (validateResult) {
//           const genTable = Object.assign({}, basicForm.model, genForm.model);
//           genTable.columns = this.cloumns;
//           genTable.params = {
//             treeCode: genTable.treeCode,
//             treeName: genTable.treeName,
//             treeParentCode: genTable.treeParentCode
//           };
//           updateGenTable(genTable).then(res => {
//             this.msgSuccess(res.data);
//             if (res.code === 0) {
//               this.close();
//             }
//           });
//         } else {
//           this.msgError("表单校验未通过，请重新检查提交内容");
//         }
//       });
//     },
//     //子组件修改info的column
//     setInfoColumn(column){
//         this.info.column = column;
//     },
//     getFormPromise(form) {
//       return new Promise(resolve => {
//         form.validate(res => {
//           resolve(res);
//         });
//       });
//     },
//     /** 关闭按钮 */
//     close() {
//       this.$store.dispatch("tagsView/delView", this.$route);
//       this.$router.push({ path: "/system/tools/gen", query: { t: Date.now()}})
//     },
//     handleChangeConfig(row, index) {
//       this.relationTable.filter(function(item) {
//         if (item.tableName === row.linkTableName) {
//           row.fkCol = item.columns
//         }
//       })
//     },
//   },
//   mounted() {
//     const el = this.$refs.dragTable.$el.querySelectorAll(".el-table__body-wrapper > table > tbody")[0];
//     const sortable = Sortable.create(el, {
//       handle: ".allowDrag",
//       onEnd: evt => {
//         const targetRow = this.cloumns.splice(evt.oldIndex, 1)[0];
//         this.cloumns.splice(evt.newIndex, 0, targetRow);
//         for (let index in this.cloumns) {
//           this.cloumns[index].sort = parseInt(index) + 1;
//         }
//       }
//     });
//   }
// };
</script>

<style>
 .allowDrag{cursor: move;}
</style>
