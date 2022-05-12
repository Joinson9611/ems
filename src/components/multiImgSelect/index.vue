<template>
  <div >
    <el-upload
      :class="{'hide' : hideUpload}"
      :auto-upload="false"
      :limit="4"
      :file-list="uploadImageList"
      :multiple="true"
      :on-exceed="exceedUpload"
      :on-change="beforeUpload"
      :on-preview="ImagesPreview"
      :on-remove="handleRemove"
      action="#"
      list-type="picture-card"
      accept=".jpg,.png,.jpeg">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :append-to-body="true" :visible.sync="dialogImgShow" title="现场图片">
      <img :src="itemPic" alt="">
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    imgList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogImgShow: false,
      formData: {
        interestType: '',
        name: '',
        description: ''
      },
      interestOptions: [],
      hideUpload: false,
      limitUpload: 0,
      isShowSettingGroup: false,
      isShowPreivew: false,
      itemPic: '',
      uploadImageList: [],
      showOverlay: true,
      uploadClass: false
    }
  },
  watch: {
    imgList: {
      handler(val) {
        this.uploadImageList = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // comfirm() {
    //   this.uploadClass = true
    // },
    // 将内容清空
    resetFormDataMessage() {
      this.formData.interestType = ''
      this.formData.name = ''
      this.formData.description = ''
      this.uploadImageList = []
      this.limitUpload = 0
      this.hideUpload = false
    },
    closeOverlayPanel() {
      this.showOverlay = false
    },
    ImagesPreview(file) {
      this.itemPic = file.url
      this.dialogImgShow = true
    },
    handleRemove(file, filelist) {
      this.uploadImageList = filelist
      this.limitUpload -= 1
      const url = []
      const files = []
      this.uploadImageList.forEach(item => {
        if (item.isUrl) {
          url.push(item)
        } else {
          files.push(item.raw)
        }
      })
      this.$emit('getImgList', url, files)
      if (this.limitUpload < 5) {
        setTimeout(() => {
          this.hideUpload = false
        }, 800)
      }
    },
    beforeUpload(file) {
      this.uploadImageList.push(file)
      // console.log(file)
      this.limitUpload += 1
      if (this.limitUpload >= 5) {
        this.hideUpload = true
      } else {
        this.hideUpload = false
      }
      const url = []
      const files = []
      this.uploadImageList.forEach(item => {
        if (item.isUrl) {
          url.push(item)
        } else {
          files.push(item.raw)
        }
      })
      this.$emit('getImgList', url, files)
    },
    // 压缩图片
    compressEvent: function(img, callback) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const width = img.width
      const height = img.height
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      const dataURL = canvas.toDataURL('image/jpeg', 0.1)
      if (callback) {
        callback(dataURL)
      }
    },
    exceedUpload() {
      this.$message.warning('最多上传4张图片')
    },
    openSetting() {
      this.isShowSettingGroup = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .confirm {
    margin-top: 10px;
  }
  /deep/.el-upload-list__item {
    width: 80px;
    height: 80px
  }
  /deep/.el-upload {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
</style>

