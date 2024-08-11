<template>
  <div class="system-edit-post-container">
    <el-dialog v-model="isShowDialog" width="60%" :close-on-click-modal="false" :title="dialogTitle">
      <el-form ref="formRef" :model="formData" :rules="rules" size="default" label-width="120px">
        <el-form-item label="父ID" prop="parentId">
          <el-input v-model="formData.parentId" placeholder="请输入父ID"/>
        </el-form-item>
        <el-form-item label="名称" prop="regionName">
          <el-input v-model="formData.regionName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="全称" prop="mergerName">
          <el-input v-model="formData.mergerName" placeholder="请输入全称"/>
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="formData.shortName" placeholder="请输入简称"/>
        </el-form-item>
        <el-form-item label="简称合并" prop="mergerShortName">
          <el-input v-model="formData.mergerShortName" placeholder="请输入简称合并"/>
        </el-form-item>
        <el-form-item label="层级，1是省份，2是城市，3是区县" prop="level">
          <el-input v-model="formData.level" placeholder="请输入层级，1是省份，2是城市，3是区县"/>
        </el-form-item>
        <el-form-item label="城市代码" prop="cityCode">
          <el-input v-model="formData.cityCode" placeholder="请输入城市代码"/>
        </el-form-item>
        <el-form-item label="邮编号码" prop="zipCode">
          <el-input v-model="formData.zipCode" placeholder="请输入邮编号码"/>
        </el-form-item>
        <el-form-item label="全拼" prop="fullPinyin">
          <el-input v-model="formData.fullPinyin" placeholder="请输入全拼"/>
        </el-form-item>
        <el-form-item label="简拼" prop="simplifiedPinyin">
          <el-input v-model="formData.simplifiedPinyin" placeholder="请输入简拼"/>
        </el-form-item>
        <el-form-item label="第一个字" prop="firstChar">
          <el-input v-model="formData.firstChar" placeholder="请输入第一个字"/>
        </el-form-item>
        <el-form-item label="纬度" prop="longitude">
          <el-input v-model="formData.longitude" placeholder="请输入纬度"/>
        </el-form-item>
        <el-form-item label="经度" prop="latitude">
          <el-input v-model="formData.latitude" placeholder="请输入经度"/>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default" :loading="loading">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {reactive, toRefs, defineComponent, ref, unref, computed, nextTick} from 'vue';
import {addRegion, editRegion} from "/@/api/base/region";
import {ElMessage, FormInstance} from "element-plus";

interface DialogRow {
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

interface RegionState {
  loading: boolean;
  isShowDialog: boolean;
  formData: DialogRow;
  rules: Object;
}

export default defineComponent({
  name: 'EditRegion',
  setup(props, ctx) {
    const dragClasses = ['.system-edit-post-container .el-dialog', '.system-edit-post-container .el-dialog__header'];
    const formRef = ref<FormInstance | null>(null);
    const initForm = function (): DialogRow {
      return {
        id: 0,
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
      }
    }
    const state = reactive<RegionState>({
      loading: false,
      isShowDialog: false,
      formData: initForm(),
      // 表单校验
      rules: {
        regionName: [
          {required: true, message: "名称不能为空", trigger: "blur"}
        ],
        mergerName: [
          {required: true, message: "全称不能为空", trigger: "blur"}
        ],
        shortName: [
          {required: true, message: "简称不能为空", trigger: "blur"}
        ],
        mergerShortName: [
          {required: true, message: "简称合并不能为空", trigger: "blur"}
        ],
      }
    });
    // 打开弹窗
    const openDialog = (row?: DialogRow) => {
      state.isShowDialog = true;
      nextTick(() => {
        formRef.value?.resetFields();
        state.formData = initForm();
        if (row) {
          // 深拷贝，修改时不修改表格的行
          state.formData = JSON.parse(JSON.stringify(row));
        }
      })
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          state.loading = true;
          if (state.formData.id === 0) {
            //添加
            addRegion(state.formData).then(() => {
              ElMessage.success('添加成功');
              closeDialog(); // 关闭弹窗
              ctx.emit('getList')
            }).finally(() => {
              state.loading = false;
            })
          } else {
            //修改
            editRegion(state.formData).then(() => {
              ElMessage.success('修改成功');
              closeDialog(); // 关闭弹窗
              ctx.emit('getList')
            }).finally(() => {
              state.loading = false;
            })
          }
        }
      });
    };
    const dialogTitle = computed(() => {
      return (state.formData.id === 0 ? '添加' : '修改')
    });
    return {
      dragClasses,
      dialogTitle,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
</style>
