<template>
  <div class="app-container">
    <el-button type="primary" style="margin-bottom:10px" @click="selectLogoImage">设置logo</el-button>
    <div class="image-wrapper">
      <div class="image logo" >
        <el-image :src="logoImg" fit="fill" class="logo">
          <div slot="error" class="image-slot logo">
            <el-image :src="img" fit="fill"/>
          </div>
        </el-image>
      </div>
    </div>
    <!--弹出导入窗口-->
    <el-dialog :visible.sync="imageSelectVisible" :append-to-body="true" :close-on-click-modal="false" :title="isLogo ? '大屏Logo图片' : '大屏中间图片'" style="text-align: center; min-width: 800px" @close="close">
      <el-upload
        v-if="imageSelectVisible"
        ref="upload"
        :multiple="false"
        :auto-upload="false"
        :on-change="onUploadChange"
        :before-upload="onUploadFileCheck"
        :before-remove="onUploadFileRemove"
        :on-exceed="onUploadFileLimit"
        :http-request="UploadFile"
        :limit="1"
        :show-file-list="false"
        :accept="'.png'"
        class="avatar-uploader"
        drag
        action="customize">
        <div v-if="imageUrl" class="img-wrapper">
          <img :src="imageUrl" class="avatar">
          <div class="close" @click.stop="clearImage"><SvgIcon icon-class="close"/></div>
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon"/>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click.native="onUploadButtonCancel">取消</el-button>
        <el-button
          v-waves
          :loading="isButtonUploadLoadingShow"
          :disabled="isUploadButtonDisable"
          type="primary"
          @click.native="onUploadButtonSubmit">上传
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadLogoImage } from '@/api/project.js'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import SvgIcon from '@/components/SvgIcon'
export default {
  directives: {
    waves
  },
  components: {
    SvgIcon
  },
  data() {
    return {
      isLogo: true,
      imageSelectVisible: false,
      logoImg: '',
      img: '',
      imageUrl: '',
      isUploadButtonDisable: false,
      isButtonUploadLoadingShow: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.img = process.env.FILE_URL + `/image/project_image/0.png`
    this.logoImg = process.env.FILE_URL + `/image/project_image/${this.selected_project_id}.png` + '?t=' + (+new Date())
  },
  methods: {
    clearImage() {
      this.imageUrl = ''
      this.$refs.upload.clearFiles()
    },
    close() {
      this.imageUrl = ''
    },
    selectLogoImage() {
      this.imageSelectVisible = true
      this.isLogo = true
    },
    selecteMainImage() {
      this.imageSelectVisible = true
      this.isLogo = false
    },
    /**
     * @Description: 上传对话框文件改变时回调
     * @Date: 2020/7/8
     **/
    onUploadChange(file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.isUploadButtonDisable = false
    },
    /**
     * @Description: 上传对话框文件删除时回调
     * @Date: 2020/7/8
     **/
    onUploadFileRemove() {
      this.isUploadButtonDisable = true
    },
    /**
     * @Description: 取消上传操作
     * @Date: 2020/7/8
     **/
    onUploadButtonCancel() {
      this.imageSelectVisible = false
    },
    /**
     * @Description: 上传文件事件
     * @Date: 2020/7/8
     **/
    onUploadButtonSubmit() {
      this.$refs.upload.submit()
    },
    /**
     * @Description: 上传文件类型大小限制
     * @Date: 2020/7/8
     **/
    onUploadFileCheck(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === this.isLogo ? 'png' : 'jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!extension) {
        this.$message({
          message: `上传图片只能${this.isLogo ? 'png' : 'jpg'}格式`,
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 2MB',
          type: 'warning'
        })
      }
      return extension && isLt2M
    },
    /**
     * @Description: 文件数量限制
     * @Date: 2020/7/8
     **/
    onUploadFileLimit() {
      this.$message({
        message: '只能上传一个文件',
        type: 'warning'
      })
    },
    /**
     * @Description: 文件上传操作
     * @Date: 2020/7/8
     **/
    UploadFile(content) {
      this.isButtonUploadLoadingShow = true
      const formData = new FormData()
      formData.append('project_image', content.file, content.file.name)
      formData.append('project_id', this.selected_project_id)
      uploadLogoImage(formData).then(() => {
        this.$message({
          type: 'success',
          message: '图片上传成功'
        })
        this.logoImg = process.env.FILE_URL + `/image/project_image/${this.selected_project_id}.png` + '?t=' + (+new Date())
        this.isButtonUploadLoadingShow = false
        this.imageSelectVisible = false
      }).catch(err => {
        console.log(err)
        this.isButtonUploadLoadingShow = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .title {
      margin: 10px 0;
    }
  }
  .avatar-uploader /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .img-wrapper  {
    position: relative;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-weight: bold;
      background: #F56C6C;
    }
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    // width: 178px;
    // height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    // width: 178px;
    // height: 178px;
    display: block;
  }
  .image {
    // width: 400px;
    // height: 262.5px;
  }
  .image-error{
    width: 400px;
    height: 262.5px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // background: #f5f7fa;
    // color: #909399;
  }
  // .logo {
  //   width: 50px;
  //   height: 50px;
  // }
</style>
