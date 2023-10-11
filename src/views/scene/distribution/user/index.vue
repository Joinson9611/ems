<template>
  <div class="app-container" style="padding: 0">
    <div class="filter-container">
      <el-select v-model="userId" class="filter-item" placeholder="请选择人员" @change="userChange">
        <el-option
          v-for="item in userOptions"
          :key="item.user_id"
          :label="item.user_name"
          :value="item.user_id"
        />
      </el-select>
      <el-button v-waves :disabled="!userId" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="newUserscene">添加</el-button>
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteUserscenes">删除</el-button>
    </div>

    <!--任务列表-->
    <el-table
      v-loading="isListLoadingShow"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="50"/>
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column label="场景名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scene }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label || '/' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="isDialogUserscenesShow" :append-to-body="true" :close-on-click-modal="false" title="添加场景" @closed="closeDialogUserscene">
      <el-form ref="formdata" :model="formdataUserscene" :rules="usersceneRules" label-width="120px">
        <el-form-item label="场景" class="dialog-form-item" prop="scene_id">
          <el-select v-model="formdataUserscene.scene_id" filterable placeholder="请选择场景" >
            <el-option v-for="item in sceneOptions" :key="item.scene_id" :label="item.scene" :value="item.scene_id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isDialogUserscenesShow = false">取消</el-button>
        <el-button v-waves :loading="isButtonLoadingShow" type="primary" @click.native="onSumbit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectUserList } from '@/api/users'
import { getScenesList } from '@/api/scenes'
import { Formattimestamp } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getUserscenesInfoList, addUserscenes, deleteUserscenes } from '@/api/userscenes'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination
  },
  directives: {
    waves
  },

  data() {
    return {
      usersceneRules: {
        scene_id: { required: true, message: '请选择场景', trigger: 'blur' }
      },
      userId: undefined,
      isEdit: false,
      isButtonLoadingShow: false,
      list: [],
      sceneOptions: [],
      isDialogUserscenesShow: false,
      isListLoadingShow: false,
      multipleSelection: [],
      questionbankOptions: [],
      userOptions: [],
      // 场景总数
      total: 0,
      // 请求场景列表信息参数
      paramsGetUserscene: {
        project_id: undefined
      },
      formdataUserscene: {
        scene_id: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },

  created() {
    this.getProjectUserList()
  },
  methods: {
    getProjectUserList() {
      getProjectUserList({ project_id: this.selected_project_id }).then(res => {
        this.userOptions = res.data.user_list
      }).catch(() => {})
    },

    getScenesList() {
      getScenesList({ project_id: this.selected_project_id, user_id: this.userId }).then(res => {
        this.sceneOptions = res.data.items
      }).catch(() => {})
    },
    onSearch() {
      this.getUsersceneList()
    },
    userChange(id) {
      this.userId = id
      this.getScenesList()
      this.getUsersceneList()
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    // 提交表单
    onSumbit() {
      this.$refs.formdata.validate(valid => {
        if (valid) {
          const params = {
            user_id: this.userId,
            project_id: this.selected_project_id,
            scene_id: this.formdataUserscene.scene_id
          }
          addUserscenes(params).then(() => {
            this.isDialogUserscenesShow = false
            this.getUsersceneList()
            this.$message({
              type: 'success',
              message: '编辑成功！'
            })
            this.init()
          }).catch(err => {
            console.error(err)
          })
        }
      })
    },
    newUserscene() {
      this.isDialogUserscenesShow = true
    },
    closeDialogUserscene() {
      if (this.isEdit) {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.resetFields()
        this.init()
      } else {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.clearValidate()
      }
      this.isEdit = false
    },
    init() {
      this.formdataUserscene.scene_id = undefined
    },
    deleteUserscenes() {
      this.$confirm('确认删除选中的场景吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isListLoadingShow = true
        const deleteParam = {
          scene_id_list: this.multipleSelection.map(item => item.scene_id),
          project_id: this.selected_project_id,
          user_id: this.userId
        }
        deleteUserscenes(deleteParam).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.isListLoadingShow = false
          this.getUsersceneList()
        }).catch(err => {
          console.error(err)
          this.isListLoadingShow = false
        })
      })
    },

    getUsersceneList() {
      this.isListLoadingShow = true
      getUserscenesInfoList({ project_id: this.selected_project_id, user_id: this.userId }).then(res => {
        this.isListLoadingShow = false
        this.total = res.data.total
        this.list = res.data.items
      }).catch(err => {
        console.error(err)
        this.isListLoadingShow = false
      })
    },
    formateTime(timpstamp) {
      return Formattimestamp(timpstamp)
    }
  }
}
</script>

<style>

</style>
