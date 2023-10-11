<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="paramsGetScene.scene" style="width:200px" placeholder="场景名称" class="filter-item" @keyup.enter.native="onSearch" />
      <el-button v-waves v-if="isUpdateShow" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="newScene">新建</el-button>
      <el-button v-waves v-if="isUpdateShow" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteScenes">删除</el-button>
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
      <el-table-column label="场景名称" align="center" >
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="editScene(scope.row)">{{ scope.row.scene }}</a>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onBind(scope.row)">场景绑定</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="paramsGetScene.page" :limit.sync="paramsGetScene.limit" @pagination="getSceneList" />
    <el-dialog :visible.sync="isDialogScenesShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑场景' : '新建场景' " @closed="closeDialogScene">
      <el-form ref="formdata" :model="formdataScene" :rules="groupRules" label-width="120px">
        <el-form-item label="场景名称：" class="dialog-form-item" prop="scene">
          <el-input v-model="formdataScene.scene"/>
        </el-form-item>
        <el-form-item label="描述：" class="dialog-form-item" >
          <el-input v-model="formdataScene.label" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isDialogScenesShow = false">取消</el-button>
        <el-button v-waves :loading="isButtonLoadingShow" type="primary" @click.native="onSumbit">确定</el-button>
      </div>
    </el-dialog>

    <el-drawer
      :visible.sync="isSceneBindDialogShow"
      title="场景绑定"
      direction="ltr"
      size="50%"
    >
      <div class="body-wrapper">
        <el-form label-width="100px">
          <el-form-item label="场景名称" class="dialog-form-item">
            <span>{{ sceneInfo.scene }}</span>
          </el-form-item>
          <el-form-item label="描述" class="dialog-form-item">
            <span>{{ sceneInfo.label }}</span>
          </el-form-item>
          <el-card shadow="never" class="project-list" body-style="padding: 0;">
            <div slot="header" class="clearfix">
              <span style="line-height: 29px">绑定列表</span>
              <div class="button" style="float: right">
                <!--新建-->
                <el-button v-waves class="filter-item" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-plus" @click="isDialogHandleBindShow = true">添加</el-button>
                <!--删除-->
                <el-button v-waves v-loading="isBindDeleteLoading" :disabled="bindselection.length===0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteBind">删除</el-button>
              </div>
            </div>
            <el-table
              v-loading="isBindlLoadingShow"
              :data="sceneGroupList"
              element-loading-text="Loading"
              style="width: 100%;"
              fit
              highlight-current-row
              max-height="500"
              @selection-change="handleBindSelectionChange"
            >
              <el-table-column
                type="selection"
                align="center"
                width="50"
              />
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
              </el-table-column>
              <el-table-column label="组名称" align="center">
                <template slot-scope="scope">
                  <a style="color: #409EFF" @click="openEditBind(scope.row)">{{ scope.row.group_name }}</a>
                </template>
              </el-table-column>
              <el-table-column label="所属网关" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.gateway || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="设备类型" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.device_type || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="控制值" align="center">
                <template slot-scope="scope">
                  <span>{{ getValueMap(scope.row) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="isDialogHandleBindShow" :append-to-body="true" :close-on-click-modal="false" :title="isBindEdit? '编辑' : '新建'" @close="closeBindDialog">
      <el-form ref="formBind" :model="formdatabind" :rules="BindInfoRules" label-width="100px">
        <el-form-item label="组" class="dialog-form-item" prop="group_id">
          <el-select v-model="formdatabind.group_id" placeholder="请选择组" >
            <el-option v-for="item in groupOptions" :key="item.id" :label="item.group_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="值" class="dialog-form-item" prop="value">
          <el-radio-group v-if="formdatabind.device_type_id === 10" v-model="formdatabind.value">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
          <el-slider v-else :min="0" :max="100" v-model="formdatabind.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="isDialogHandleBindShow = false">取消</el-button>
        <el-button v-waves :loading="isDialogBindLoadingShow" type="primary" @click.native="onBindSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contains } from '@/utils/tools'
import { getGroupsList } from '@/api/groups'
import { getScenesgroupsInfoList, addScenesgroups, deleteScenesgroups, updateScenesgroups } from '@/api/scenegroups'
import { Formattimestamp } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getScenesInfoList, addScenes, deleteScenes, updateScenes } from '@/api/scenes.js'
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
      groupRules: {
        scene: { required: true, message: '请填写场景名称', trigger: 'blur' },
        label: { required: true, message: '请填写描述', trigger: 'blur' }
      },
      BindInfoRules: {
        group_id: { required: true, message: '请选择组', trigger: 'change' },
        value: { required: true, message: '请输入控制值', trigger: 'blur' }
      },

      isEdit: false,
      isBindEdit: false,
      isButtonLoadingShow: false,
      isBindlLoadingShow: false,
      isBindlDeleteLoading: false,
      list: [],
      formdatabind: {
        group_id: undefined,
        value: undefined,
        device_type_id: undefined
      },

      isDialogScenesShow: false,
      isListLoadingShow: false,
      isSceneBindDialogShow: false,
      multipleSelection: [],
      sceneGroupList: [],
      bindselection: [],
      groupOptions: [],
      isDialogHandleBindShow: false,

      sceneInfo: {
        scene: undefined,
        label: undefined,
        scene_id: undefined
      },

      tempFilterOptions: {
        question_bank_type: undefined
      },

      // 场景
      total: 0,

      // 请求场景列表信息参
      paramsGetScene: {
        project_id: undefined,
        page: 1,
        limit: 20,
        scene: undefined
      },
      isUpdateShow: false,
      formdataScene: {
        scene_id: undefined,
        scene: undefined,
        project_id: undefined,
        label: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id', 'roles'])
  },
  watch: {
    'formdatabind.group_id': {
      handler(group_id) {
        this.groupOptions.forEach(item => {
          if (item.id === group_id) {
            this.formdatabind.device_type_id = item.device_type_id
          }
        })
      },
      immediate: true
    }
  },

  created() {
    this.isUpdateShow = contains('342', this.roles)
    this.getSceneList()
    this.getGroupsList()
  },

  methods: {
    closeBindDialog() {
      this.formdatabind.group_id = undefined
      this.formdatabind.value = undefined
    },
    getValueMap(info) {
      if (info.device_type_id === 10) {
        const valueMap = ['关', '开']
        return valueMap[info.value]
      } else {
        return info.value
      }
    },
    getGroupsList() {
      getGroupsList({ project_id: this.selected_project_id }).then(res => {
        this.groupOptions = res.data.items
      }).catch(() => {})
    },
    openEditBind(info) {
      this.isBindEdit = true
      this.formdatabind.value = info.value
      this.formdatabind.group_id = info.group_id
      this.formdatabind.device_type_id = info.device_type_id
      this.isDialogHandleBindShow = true
    },
    onBind(info) {
      this.formdatabind.scene_id = info.scene_id
      this.sceneInfo.scene = info.scene
      this.sceneInfo.label = info.label
      this.getScenesgroupsInfoList(info.scene_id)
      this.isSceneBindDialogShow = true
    },
    getScenesgroupsInfoList(scene_id) {
      const params = {
        project_id: this.selected_project_id,
        scene_id
      }
      getScenesgroupsInfoList(params).then(res => {
        this.sceneGroupList = res.data.items
      }).catch(() => {})
    },

    onSearch() {
      this.getSceneList()
    },

    handleBindSelectionChange(val) {
      this.bindselection = val
    },

    questionBankChange(val) {
      if (val === '') {
        this.paramsGetScene.question_bank_type_id = undefined
      } else {
        this.paramsGetScene.question_bank_type_id = val
      }
      this.getSceneList()
    },

    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    // 提交表单
    onSumbit() {
      this.$refs.formdata.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            const params = {
              scene_id: this.formdataScene.scene_id,
              scene: this.formdataScene.scene,
              project_id: this.selected_project_id,
              label: this.formdataScene.label
            }
            updateScenes(params).then(() => {
              this.isDialogScenesShow = false
              this.getSceneList()
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.init()
            }).catch(err => {
              console.error(err)
            })
          } else {
            const params = {
              scene: this.formdataScene.scene,
              project_id: this.selected_project_id,
              label: this.formdataScene.label
            }
            this.formdataScene.group_id = undefined
            addScenes(params).then(() => {
              this.isDialogScenesShow = false
              this.getSceneList()
              this.$message({
                type: 'success',
                message: '新建成功！'
              })
              this.init()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },

    onBindSubmit() {
      this.$refs.formBind.validate(valid => {
        if (valid) {
          if (this.isBindEdit) {
            const params = {
              scene_id: this.formdatabind.scene_id,
              group_id: this.formdatabind.group_id,
              value: this.formdatabind.value,
              project_id: this.selected_project_id
            }
            updateScenesgroups(params).then(() => {
              this.isDialogHandleBindShow = false
              this.getScenesgroupsInfoList(this.formdatabind.scene_id)
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.initBind()
            }).catch(err => {
              console.error(err)
            })
          } else {
            const params = {
              scene_id: this.formdatabind.scene_id,
              group_id: this.formdatabind.group_id,
              value: this.formdatabind.value,
              project_id: this.selected_project_id
            }
            addScenesgroups(params).then(() => {
              this.isDialogHandleBindShow = false
              this.getScenesgroupsInfoList(this.formdatabind.scene_id)
              this.$message({
                type: 'success',
                message: '新建成功！'
              })
              this.initBind()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    initBind() {
      this.formdataScene.value = undefined
      this.formdataScene.scene_id = undefined
    },
    newScene() {
      this.isDialogScenesShow = true
    },
    editScene(info) {
      this.isDialogScenesShow = true
      this.isEdit = true
      this.formdataScene.label = info.label
      this.formdataScene.scene_id = info.scene_id
      this.formdataScene.scene = info.scene
    },
    closeDialogScene() {
      if (this.isEdit) {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.resetFields()
        this.init()
      } else {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.clearValidate()
      }
      this.isEdit = false
    },
    init() {
      this.formdataScene.label = undefined
      this.formdataScene.scene = undefined
    },
    deleteScenes() {
      this.$confirm('确认删除选中的场景吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isListLoadingShow = true
        const deleteParam = {
          scene_id_list: this.multipleSelection.map(item => item.scene_id).toString(),
          project_id: this.selected_project_id
        }
        deleteScenes(deleteParam).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.isListLoadingShow = false
          this.getSceneList()
        }).catch(err => {
          console.error(err)
          this.isListLoadingShow = false
        })
      })
    },
    deleteBind() {
      this.$confirm('确认删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isListLoadingShow = true
        const deleteParam = {
          group_id_list: this.bindselection.map(item => item.group_id),
          project_id: this.selected_project_id,
          scene_id: this.formdatabind.scene_id
        }
        deleteScenesgroups(deleteParam).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.isListLoadingShow = false
          this.getScenesgroupsInfoList(this.formdatabind.scene_id)
        }).catch(err => {
          console.error(err)
          this.isListLoadingShow = false
        })
      })
    },
    getSceneList() {
      this.paramsGetScene.project_id = this.selected_project_id
      this.isListLoadingShow = true
      getScenesInfoList(this.paramsGetScene).then(res => {
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
