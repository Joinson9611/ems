<template>
  <div class="app-main">
    <div class="app-title-item">
      <span class="tip-text">欢迎使用灯光智控系统</span>
      <span class="tip-text">点击新建项目来创建一个新项目</span>
      <span class="tip-text">单机进入项目可以查看项目具体内容</span>
      <span class="tip-text"><el-button v-if="isMangmentShow" size="mini" type="primary" @click.native="$router.push('/platform/mangment')">后台人员管理</el-button></span>
    </div>
    <div class="app-project_item">
      <el-card shadow="never" class="project-list" body-style="padding: 0;">
        <div slot="header" class="clearfix">
          <span style="line-height: 29px">项目列表</span>
          <div class="button" style="float: right">
            <!--新建-->
            <el-button v-waves v-if="isCreateProjectShow" class="filter-item" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-plus" @click="openAddProject">新建项目</el-button>
            <!--删除-->
            <!-- <el-button v-waves v-loading="isDeleteLoading" v-if="isDeteteProject" :disabled="projectselection.length===0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteProjects">删除项目</el-button> -->
          </div>
        </div>
        <el-table
          v-loading="isProjectListLoadingShow"
          :data="projectList"
          element-loading-text="Loading"
          style="width: 100%;"
          fit
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            align="center"
            width="50"
          /> -->
          <el-table-column label="序号" align="center" width="70">
            <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="项目名称" align="center">
            <template slot-scope="scope">
              <a style="color: #409EFF" @click="openEditProject(scope.row)">{{ scope.row.project_name }}</a>
            </template>
          </el-table-column>
          <el-table-column label="项目地址" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目描述" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200"
            fixed="right"
          >
            <template slot-scope="scope" class="tab-btn">
              <el-button
                class="btn"
                type="primary"
                size="mini"
                @click="onProjectSelected(scope.row)"
              >
                进入项目
              </el-button>
              <el-button
                v-if="isDeteteProject"
                class="btn"
                type="danger"
                size="mini"
                @click="deleteProjects(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog
        :visible.sync="dialogProjectVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        :title="isEdit ? '编辑项目':'新建项目'"
      >
        <el-form ref="formProject" :model="paramsProject" :rules="projectInfoRules" label-width="120px">
          <el-form-item label="项目名称" class="dialog-form-item" prop="project_name">
            <el-input :readonly="!isEditProject" v-model="paramsProject.project_name" type="text"/>
          </el-form-item>
          <el-form-item label="项目地址" class="dialog-form-item" prop="address">
            <el-input :readonly="!isEditProject" v-model="paramsProject.address" type="text"/>
          </el-form-item>
          <el-form-item label="项目描述" class="dialog-form-item" prop="label">
            <el-input :readonly="!isEditProject" v-model="paramsProject.label" type="text"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
          <el-button v-waves @click.native="dialogProjectVisible = false">取消</el-button>
          <el-button v-waves v-if="isEditProject" :loading="isButtonLoadingShow" type="primary" @click.native="onProjectInfoSubmit">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getProjects, editProjectInfo, addProject, deleteProject } from '@/api/project'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'

export default {
  directives: { waves },
  data() {
    return {
      isEdit: false,
      isDeleteLoading: false,
      isButtonLoadingShow: false,
      dialogProjectVisible: false,
      isProjectListLoadingShow: false,
      isIndeterminate: false,
      checkAll: false,

      projectselection: [],
      projectList: [],
      deviceTypeOptions: [],
      projectInfoRules: {
        project_name: [{ required: true, trigger: 'blur', message: '请输入项目名称' }],
        address: [{ required: true, trigger: 'blur', message: '请输入项目地址' }],
        label: [{ required: true, trigger: 'blur', message: '请输入项目描述' }],
        module_list: [{ required: true, trigger: 'change', message: '请选择项目模块' }]
      },
      paramsProject: {
        project_id: undefined,
        project_name: undefined,
        label: undefined,
        address: undefined,
        module_list: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_company',
      'Account_Type',
      'permission_routers'
    ]),
    isCreateProjectShow: function() {
      return [1, 2, 10].includes(this.Account_Type)
    },
    isDeteteProject() {
      return [1, 2, 10].includes(this.Account_Type)
    },
    isEditProject() {
      return [1, 2, 10, 11].includes(this.Account_Type)
    },
    isMangmentShow: function() {
      return [1, 2].includes(this.Account_Type)
    }
  },
  created() {
    this.getProjects()
    // if (this.Account_Type === 10) {
    //   this.getDeviceTypes2()
    // } else {
    //   this.getDeviceTypes()
    // }
  },
  methods: {
    imgError(event) {
      const img = event.srcElement
      img.src = process.env.PROJECT_IMAGE_URL + '0.jpg'
      img.onerror = null
    },

    handleSelectionChange(val) {
      this.projectselection = val
    },

    deleteProjects({ project_id }) {
      this.$confirm('确认删除选中项目吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isDeleteLoading = true
        deleteProject({ project_id }).then(() => {
          this.isDeleteLoading = false
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getProjects()
        }).catch(() => {
          this.isDeleteLoading = false
        })
      })
    },

    closeDialogProject() {
      this.isEdit = false
      if (this.$refs.formProject) this.$refs.formProject.clearValidate()
    },

    // 打开项目新建对话框
    openAddProject() {
      if (this.$refs.formProject !== undefined) this.$refs.formProject.resetFields()
      this.init()
      this.dialogProjectVisible = true
    },
    // 打开项目编辑对话框
    openEditProject(info) {
      this.isEdit = true
      this.dialogProjectVisible = true
      this.paramsProject.project_id = info.project_id
      this.paramsProject.project_name = info.project_name
      this.paramsProject.label = info.label
      this.paramsProject.address = info.address
      this.paramsProject.module_list = info.module_list.split(',').map(item => parseInt(item))
      // this.checkAll = this.deviceTypeOptions.length === this.paramsProject.module_list.length
      // this.isIndeterminate = this.deviceTypeOptions.length > this.paramsProject.module_list.length && this.paramsProject.module_list.length > 0
    },
    // 提交编辑/信息
    onProjectInfoSubmit() {
      this.$refs.formProject.validate(valid => {
        let params
        if (valid) {
          this.isButtonLoadingShow = true
          if (!this.isEdit) {
            params = {
              name: this.paramsProject.project_name,
              address: this.paramsProject.address,
              label: this.paramsProject.label,
              // module_list: this.paramsProject.module_list.join(','),
              module_list: ''
            }
            addProject(params).then(() => {
              this.dialogProjectVisible = false
              this.isButtonLoadingShow = false
              this.getProjects()
              this.$message({
                type: 'success',
                message: '成功'
              })
            }).catch(() => {
              this.isButtonLoadingShow = false
            })
          } else {
            params = {
              project_id: this.paramsProject.project_id,
              name: this.paramsProject.project_name,
              address: this.paramsProject.address,
              label: this.paramsProject.label,
              module_list: ''
            }
            editProjectInfo(params).then(() => {
              this.isButtonLoadingShow = false
              this.dialogProjectVisible = false
              this.getProjects()
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
            }).catch(() => {
              this.isButtonLoadingShow = false
            })
          }
        }
      })
    },

    init() {
      this.paramsProject.project_name = undefined
      this.paramsProject.address = undefined
      this.paramsProject.label = undefined
      this.paramsProject.module_list = []
      this.isIndeterminate = false
      this.checkAll = false
    },

    /**
     * @Description: 获取各个项目的图片url
     **/
    getProjectImageUrl(ID) {
      return process.env.PROJECT_IMAGE_URL + ID + '.jpg' + '?t=' + (+new Date())
    },

    /**
     * @Description: 去往管理页面
     **/
    toMangmentPage() {
      this.$router.push({ path: '/platform/mangment' })
    },

    /**
     * @Description: 项目选择
     **/
    onProjectSelected(project) {
      this.isProjectListLoadingShow = true
      this.$store.dispatch('SelectProject', project).then(() => {
        this.$store.dispatch('RemoveRoles').then(() => {
          this.$store.dispatch('RemoveRoutes').then(() => {
            this.$router.push({ path: '/' })
          })
        })
      }).catch(err => {
        this.isProjectListLoadingShow = false
        console.log(err)
      })
    },
    /**
     * @Description: 获取项目列表
     **/
    getProjects() {
      getProjects().then(respones => {
        this.projectList = respones.data.items
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
  .box-card-component{
    .el-card__header {
      padding: 0!important;
    }
    .el-card__body {
      padding: 0!important;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-main{
    padding: 12px 24px 32px 24px;
  }
  .checkbox {
    padding: 5px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
  /deep/.el-transfer-panel {
    width: 300px;
    height: 450px;
  }
  .app-title-item {
    margin-left: 10px;
    margin-bottom: 10px;
    margin-top: 0;
    .company-text{
      line-height: 48px;
      display: block;
      font-size: 26px;
      font-weight: 600;
    }
    .tip-text{
      display: block;
      line-height: 36px;
    }
  }
  .app-button-item {
    margin-bottom: 30px;
    margin-left: 10px;
  }
  .app-project_item {
    margin-left: 0;
    // text-align: center;
  }
  .box-card-component {
    padding: 0;
    margin: 10px;
    height: 280px;
    text-align: center;
    width: 240px;
    float: left;
    cursor: pointer;
    .box-card-header {
      position: relative;
      height: 220px;
      img {
        width: 100%;
        height: 100%;
        transition: all 0.2s linear;
        &:hover {
           transform: scale(1.1, 1.1);
           filter: contrast(130%);
        }
      }
    }
    .box-card-body {
      text-align:center;
      line-height: 60px;
      .project-project_name-item {
        font-size: 18px;
        color: #24292e;
      }
    }
  }
</style>
