<template>
  <div>
    <el-upload
        class="avatar-uploader el-upload--text"
        action=""
        :show-file-list="false"
        :before-upload="beforeUploadVideo"
        :on-progress="uploadVideoProcess"
        style="border: 1px solid #DCDFE6;border-radius: 4px;padding: 10px;"
    >
      <video v-if="videoSrc !='' && progressFlag == false" :src="videoSrc" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
      <i v-else-if="videoSrc =='' && progressFlag == false" class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-if="progressFlag == true" type="circle" :percentage="loadProgress" style="margin-top:30px;" />
      <div slot="tip" class="el-upload__tip" style="color: #E6A23C;"> 请保证视频格式正确，且不超过10M。</div>
    </el-upload>
  </div>
</template>


<script>
import { uploadImg } from '/@/api/system/common/index'
export default {
  data() {
    return {
      progressFlag: false, // 关闭进度条
      loadProgress: 0, // 进度条初始值
      videoSrc: ''

    }
  },
  methods: {
    // 进度条
    uploadVideoProcess(event, file, fileList) {
      this.loadProgress = Math.floor(event.percent)
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        // setTimeout(() => { this.progressFlag = false }, 1000) // 一秒后关闭进度条
      }
    },
    // 文件上传之前做处理
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过10MB哦!')
        return false
      }
      // 获取视频时长
      var url = URL.createObjectURL(file)
      var audioElement = new Audio(url)
      var duration
      audioElement.addEventListener('loadedmetadata', function(_event) {
        duration = audioElement.duration // 时长为秒，小数，182.36
        this.$parent.$data.wDuration = parseInt(duration)
        console.log(duration)
      })
      new Promise(function(resolve, reject) {
        const _URL = window.URL || window.webkitURL
        const videoElement = document.createElement('video')
        // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
        videoElement.addEventListener('loadedmetadata', function(_event) {
          const duration = videoElement.duration // 视频时长
          const valid = Math.floor(duration) <= 4
          valid ? resolve() : reject()
        })
        videoElement.src = _URL.createObjectURL(file)
      }).then(() => {
        this.uploadImg(file) // 调用上传接口
      }, () => {
        this.$message.error('上传的视频时长过大，请重新上传')
        return Promise.reject()
      })
    },
    // 上传接口
    async uploadImg(file) {
      this.progressFlag = true // 显示进度条
      const fd = new FormData()
      fd.append('file', file)
      uploadImg(fd).then(response => {
        this.videoSrc = response.result.url
        this.progressFlag = false
        this.$emit('setFileSrc', this.videoSrc)
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
      })
    }

  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

