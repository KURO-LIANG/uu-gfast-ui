<template>
  <div class="component-upload-image">
    <div class="upload-img-wrapper" v-for="(item,index) in fileList" :key="index" >
      <el-image :src="item.url" :style="{'width':width+'px','height':height+'px'}" alt="" class="upload-img" :preview-src-list="[item.url]" fit="cover"/>
      <div class="del-container">
        <el-icon class="icon-delete" @click="handleRemove(item)"><delete /></el-icon>
      </div>
    </div>
    <el-upload
      class="dm-upload"
      :action="uploadImgUrl"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :class="{hide: fileList.length >= limit}"
    >
      <div class="upload-btn-wrapper" :style="{'width':width+'px','height':height+'px'}">
        <el-icon class="el-icon-plus"><plus /></el-icon>
      </div>
      <!-- 上传提示 -->
      <template v-if="showTip" #tip>
        <div class="el-upload__tip">
          请上传
          <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
          <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
          的文件
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed, watch} from "vue";
import {ElMessage} from "element-plus";
import {Delete, Plus} from "@element-plus/icons-vue";
interface uploadData {
  dialogImageUrl: string,
  dialogVisible: boolean,
  hideUpload: boolean,
  baseUrl: string,
  uploadImgUrl: string, //上传的图片服务器地址
  fileList: file[]
}

interface file {
  name:string,
  url:string
}

export default defineComponent({
  name: 'ImageUpload',
  components: {Plus, Delete},
  emits:['update:modelValue'],
  props:{
    modelValue: [String, Object, Array],
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    width:{
      type: [Number,String],
      default:148
    },
    height:{
      type: [Number,String],
      default:148
    }
  },
  setup(props,ctx) {
    const state = reactive<uploadData>({
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: import.meta.env.VITE_API_URL+'',
      uploadImgUrl: import.meta.env.VITE_API_URL + 'api/v1/pub/upload/singleImg', //上传的图片服务器地址
      fileList: []
    })
    //监听value
    watch(()=> props.modelValue,(val)=>{
      console.log(val)
      handlerFileList(val)
    })
    const handlerFileList = (val:any)=>{
      if (val) {
        // 首先将值转为数组
        const list:string[] = Array.isArray(val) ? val : val.split(',');
        // 然后将数组转为对象数组
        state.fileList = list.map(item => {
          return { name: item, url: item };
        });
      } else {
        state.fileList = [];
        return [];
      }
    }
    //删除图片
    const handleRemove = (rf:file) => {
      const findex = state.fileList.map(f => f.name).indexOf(rf.name);
      state.fileList.splice(findex, 1);
      ctx.emit("update:modelValue", listToString(state.fileList));
    }
    //上传成功
    const handleUploadSuccess = (res:any) => {
      if(res.code === 0){
        state.fileList.push({ name: res.data.name, url: res.data.full_path });
        ctx.emit("update:modelValue", listToString(state.fileList));
      }else{
        ElMessage.error(res.msg);
      }
    }

    // 对象转成指定字符串分隔
    const listToString = (list:file[], separator?:string) => {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        // strs += list[i].url.replace(state.baseUrl, "") + separator;
        strs += list[i].url + separator;
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    }
    // 上传前loading加载
    const handleBeforeUpload = (file:any)=> {
      let isImg = false;
      if (props.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = props.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(String(type)) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }
      if(file.name.length > 100){//文件名过长
        ElMessage.error('文件名字应该在100字符以内');
        return false;
      }
      if (!isImg) {
        ElMessage.error(
          `文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`
        );
        return false;
      }
      if (props.fileSize) {
        const isLt = file.size / 1024 / 1024 < props.fileSize;
        if (!isLt) {
          ElMessage.error(`上传头像图片大小不能超过 ${props.fileSize} MB!`);
          return false;
        }
      }
      if(state.fileList.length >= props.limit){
        ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`);
        return false;
      }
    }
    // 上传失败
    const handleUploadError = ()=> {
      ElMessage.error({
        type: "error",
        message: "上传失败",
      });
    }
    //是否显示
    const showTip = computed(()=>{
      return props.isShowTip && (props.fileType || props.fileSize);
    })
    return {
      handleRemove,
      handleBeforeUpload,
      handleUploadSuccess,
      handleUploadError,
      showTip,
      ...toRefs(state)
    };
  }
})
</script>
<style scoped lang="scss">
.dm-upload{
  display: inline-block;
  vertical-align: top;
}
.upload-btn-wrapper{
  border: 1px dashed #c0ccda;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  overflow: hidden;
}

.upload-img-wrapper{
  display: inline-block;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
  .del-container{
    visibility: hidden;
    position: absolute;
    top: 10px;
    right: 10px;
    .icon-delete{
      color: #F56C6C;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .upload-img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
.upload-img-wrapper:hover .del-container{
  visibility: visible;
}
// .el-upload--picture-card 控制加号部分
.hide.dm-upload{
  display:none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter, .el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>

