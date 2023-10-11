<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="paramGetAutomationsInfoList.automation" placeholder="自动化方案名称" style="width: 300px;" class="filter-item" @keyup.enter.native="onSearch" />
      <!-- <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
      <el-button v-waves v-if="isUpdateShow" class="filter-item" type="primary" icon="el-icon-plus" @click="openDialogAutomationsAdd">新建</el-button>
      <el-button v-waves v-if="isUpdateShow" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onAutomationsSubmitsDelete">删除</el-button>
    </div>

    <el-table
      v-loading="isAutomationsInfoListLoadingShow"
      :data="automationInfoList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (paramGetAutomationsInfoList.page - 1) * paramGetAutomationsInfoList.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="自动化方案名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogAutomationsEdit(scope.row)"><i>{{ scope.row.automation }}</i></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCondition(scope.row)">条件管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="paramGetAutomationsInfoList.page" :limit.sync="paramGetAutomationsInfoList.limit" @pagination="getAutomationInfoList" />
    <el-dialog :visible.sync="isDialogAutomationsShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit? '编辑自动化方案' : '新建自动化方案'" @close="closeAutomationDialog">
      <el-form ref="formAutomations" :model="paramAutomationsInfo" :rules="AutomationsInfoRules" label-width="100px">
        <el-form-item label="方案名称" class="dialog-form-item" prop="automation">
          <el-input v-model="paramAutomationsInfo.automation" type="text" />
        </el-form-item>
        <el-form-item label="场景" class="dialog-form-item" prop="scene_id">
          <el-select v-model="paramAutomationsInfo.scene_id" filterable placeholder="请选择场景" >
            <el-option v-for="item in sceneOptions" :key="item.scene_id" :label="item.scene" :value="item.scene_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" class="dialog-form-item">
          <el-input v-model="paramAutomationsInfo.label" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogAutomationsAdd">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isDialogAutomationsLoadingShow" type="primary" @click.native="onAutomationsSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="issceneDialogShow"
      title="条件管理"
      direction="ltr"
      size="50%"
    >
      <div class="body-wrapper">
        <el-form label-width="100px">
          <el-form-item label="方案名称" class="dialog-form-item" prop="automation">
            <span>{{ automationInfo.automation }}</span>
          </el-form-item>
          <el-form-item label="描述" class="dialog-form-item">
            <span>{{ automationInfo.label }}</span>
          </el-form-item>
          <el-card shadow="never" class="project-list" body-style="padding: 0;">
            <div slot="header" class="clearfix">
              <span style="line-height: 29px">自动化条件列表</span>
              <div class="button" style="float: right">
                <!--新建-->
                <el-button v-waves class="filter-item" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-plus" @click="isDialogHandleConditionShow = true">新建</el-button>
                <!--删除-->
                <el-button v-waves v-loading="isConditionDeleteLoading" :disabled="conditionselection.length===0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteCondition">删除</el-button>
              </div>
            </div>
            <el-table
              v-loading="isConditionLoadingShow"
              :data="sceneList"
              element-loading-text="Loading"
              style="width: 100%;"
              fit
              max-height="400px"
              highlight-current-row
              @selection-change="handleConditionSelectionChange"
            >
              <el-table-column
                type="selection"
                align="center"
                width="50"
              />
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
              </el-table-column>
              <el-table-column label="通道名称" align="center">
                <template slot-scope="scope">
                  <a style="color: #409EFF" @click="openEditCondition(scope.row)">{{ scope.row.channel_name }}</a>
                </template>
              </el-table-column>
              <el-table-column label="通道描述" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.channel_label || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="传感器名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.device_name || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="传感器类型" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.device_type || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作符" align="center">
                <template slot-scope="scope">
                  <span>{{ operTypesMap[scope.row.operator_type_id] || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="条件数值" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.value || '/' }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="sceneTotal>0" :total="sceneTotal" :page.sync="paramsGetConditionList.page" :limit.sync="paramsGetConditionList.limit" @pagination="getConditionInfoList" />
          </el-card>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="isDialogHandleConditionShow" :append-to-body="true" :close-on-click-modal="false" :title="isConditionEdit ? '自动化条件编辑':'自动化条件添加'" @close="closeConditionDialog">
      <el-form ref="formCondition" :model="formCondition" :rules="ConditionInfoRules" label-width="100px">
        <el-form-item label="设备类型" class="dialog-form-item" prop="device_type_id">
          <el-select v-model="formCondition.device_type_id" placeholder="请选择设备类型" @change="deviceTypeChange">
            <el-option v-for="item in devicetypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="通道" class="dialog-form-item" prop="channel_id">
          <el-select v-model="formCondition.channel_id" placeholder="请选择通道" >
            <el-option v-for="item in channelOptions" :key="item.id" :label="item.channel_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="运算符" class="dialog-form-item" prop="operator_type_id">
          <el-select v-model="formCondition.operator_type_id" placeholder="请选择通道" >
            <el-option v-for="item in opertypesOptions" :key="item.operator_type_id" :label="item.operator_type" :value="item.operator_type_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="条件数值" class="dialog-form-item" prop="value">
          <el-input v-model="formCondition.value"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="isDialogHandleConditionShow = false">取消</el-button>
        <el-button v-waves :loading="isDialogConditionLoadingShow" type="primary" @click.native="onConditionSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contains } from '@/utils/tools'
import { getChannelsenorsList } from '@/api/channelsenors'
import { getDeviceTypeList } from '@/api/devicetypes'
import { getOperatortypes } from '@/api/operatortypes'
import { getScenesList } from '@/api/scenes'
import { Formattimestamp, FormatDate } from '@/utils/time'
import { getAutomationInfoList, deleteAutomation, addAutomation, updateAutomation } from '@/api/automations'
import { getConditionInfoList, addCondition, deleteCondition, updateCondition } from '@/api/conditions'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Automations',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      conditionselection: [],
      automationInfoList: [],
      sceneList: [],
      channelOptions: [],
      devicetypeOptions: [],
      opertypesOptions: [],
      operTypesMap: [],
      isConditionDeleteLoading: false,
      isAutomationsInfoListLoadingShow: false,
      isDialogAutomationsShow: false,
      isDialogAutomationsLoadingShow: false,
      isDialogEditAutomationsLoadingShow: false,
      isDialogConditionLoadingShow: false,
      issceneDialogShow: false,
      isDialogHandleConditionShow: false,
      isConditionEdit: false,
      isUpdateShow: false,
      isEdit: false,
      total: 0,
      sceneTotal: 0,
      paramsGetConditionList: {
        project_id: undefined,
        auto_id: undefined
      },
      formCondition: {
        device_type_id: undefined,
        project_id: undefined,
        auto_id: undefined,
        channel_id: undefined,
        condition_id: undefined,
        operator_type_id: undefined,
        value: undefined
      },
      automationInfo: {
        automation: undefined,
        label: undefined
      },
      sceneInfo: {
        project_id: undefined,
        condition: undefined,
        label: undefined,
        scene_id: undefined
      },
      tempFilterOptions: {
        automation: undefined
      },
      sceneOptions: [],
      paramGetAutomationsInfoList: {
        project_id: undefined,
        automation: undefined,
        page: 1,
        limit: 20
      },
      paramAutomationsInfo: {
        auto_id: undefined,
        automation: undefined,
        scene_id: undefined,
        label: undefined
      },
      ConditionInfoRules: {
        device_type_id: [{ required: true, trigger: 'change', message: '请选择设备类型' }],
        channel_id: [{ required: true, trigger: 'blur', message: '请选择通道' }],
        operator_type_id: [{ required: true, trigger: 'blur', message: '请选择操作符' }],
        value: [{ required: true, trigger: 'blur', message: '请输入传感器条件数值' }]
      },
      AutomationsInfoRules: {
        automation: [{ required: true, trigger: 'blur', message: '请输入自动化方案名称' }],
        scene_id: [{ required: true, trigger: 'change', message: '请选择场景' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id', 'roles'
    ])
  },
  created() {
    this.isUpdateShow = contains('372', this.roles)
    this.getAutomationInfoList()
    this.getScenesList()
    this.getOperatortypes()
    this.getDeviceTypeList()
  },
  methods: {
    closeAutomationDialog() {
      if (this.isEdit) {
        this.isEdit = false
      }
    },
    deviceTypeChange(id) {
      if (id) {
        this.getChannelsenorsList(id)
      }
    },
    getChannelsenorsList(device_type_id) {
      getChannelsenorsList({ device_type_id, project_id: this.selected_project_id }).then(res => {
        this.channelOptions = res.data.items
      }).catch(() => {})
    },
    getDeviceTypeList() {
      getDeviceTypeList({ device_type_group_id: 3 }).then(res => {
        this.devicetypeOptions = res.data.items
      }).catch(() => {

      })
    },
    getOperatortypes() {
      getOperatortypes().then(res => {
        this.opertypesOptions = res.data.items
        this.opertypesOptions.forEach((item, key) => {
          this.operTypesMap[key] = item.operator_type
        })
      }).catch(() => {})
    },
    getScenesList() {
      getScenesList({ project_id: this.selected_project_id }).then(res => {
        this.sceneOptions = res.data.items
      }).catch(() => {})
    },
    getTime(time) {
      return Formattimestamp(time)
    },
    closeConditionDialog() {
      this.isDialogHandleConditionShow = false
      this.conditionInit()
      if (this.$refs.formCondition !== undefined) this.$refs.formCondition.resetFields()
      this.isConditionEdit = false
    },
    openEditCondition(info) {
      this.isConditionEdit = true
      this.formCondition.condition_id = info.id
      this.formCondition.device_type_id = info.device_type_id
      this.formCondition.channel_id = info.channel_id
      this.formCondition.operator_type_id = info.operator_type_id
      this.formCondition.value = info.value
      this.getChannelsenorsList(info.device_type_id)
      this.isDialogHandleConditionShow = true
    },
    FormatDate(timestamp) {
      return FormatDate(timestamp)
    },
    handleConditionSelectionChange(val) {
      this.conditionselection = val
    },
    deleteCondition() {
      this.$confirm('确认删除选中条件吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          condition_id_list: this.conditionselection.map(item => item.id)
        }
        deleteCondition(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getConditionInfoList()
        }).catch(err => {
          console.log(err)
        })
      })
    },

    onConditionSubmit() {
      this.$refs.formCondition.validate(valid => {
        if (valid) {
          if (this.isConditionEdit) {
            const param = {
              project_id: this.selected_project_id,
              channel_id: this.formCondition.channel_id,
              condition_id: this.formCondition.condition_id,
              operator_type_id: this.formCondition.operator_type_id,
              auto_id: this.formCondition.auto_id,
              label: this.formCondition.label,
              value: this.formCondition.value
            }
            updateCondition(param).then(() => {
              this.$message({ type: 'success', message: '新建成功' })
              this.isDialogHandleConditionShow = false
              this.getConditionInfoList()
            }).catch(() => {
              this.isDialogHandleConditionShow = false
            })
          } else {
            const param = {
              project_id: this.selected_project_id,
              channel_id: this.formCondition.channel_id,
              operator_type_id: this.formCondition.operator_type_id,
              auto_id: this.formCondition.auto_id,
              label: this.formCondition.label,
              value: this.formCondition.value
            }
            addCondition(param).then(() => {
              this.$message({ type: 'success', message: '编辑成功' })
              this.isDialogHandleConditionShow = false
              this.getConditionInfoList()
            }).catch(() => {
              this.isDialogHandleConditionShow = false
            })
          }
        }
      })
    },
    handleCondition({ automation, label, auto_id }) {
      this.formCondition.auto_id = auto_id
      this.automationInfo.automation = automation
      this.automationInfo.label = label
      this.paramsGetConditionList.auto_id = auto_id
      this.paramsGetConditionList.project_id = this.selected_project_id
      this.getConditionInfoList()
      this.issceneDialogShow = true
    },
    conditionInit() {
      this.formCondition.channel_id = undefined
      this.formCondition.device_type_id = undefined
      this.formCondition.value = undefined
      this.formCondition.operator_type_id = undefined
    },
    getConditionInfoList() {
      getConditionInfoList(this.paramsGetConditionList).then(res => {
        this.sceneList = res.data.items
        this.sceneTotal = res.data.total
      }).then(() => {

      })
    },
    /**
     * @Description: 列表选中回调
     * @Date: 2019/6/27
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 获取自动化方案信息列表
     * @Date: 2019/6/27
     **/
    getAutomationInfoList() {
      const Params = {
        project_id: this.selected_project_id,
        page: this.paramGetAutomationsInfoList.page,
        limit: this.paramGetAutomationsInfoList.limit,
        automation: this.paramGetAutomationsInfoList.automation
      }
      this.isAutomationsInfoListLoadingShow = true
      getAutomationInfoList(Params).then(res => {
        this.automationInfoList = res.data.items
        this.total = res.data.total
        this.isAutomationsInfoListLoadingShow = false
      }).catch(err => {
        this.isAutomationsInfoListLoadingShow = false
        console.error(err)
      })
    },
    onSearch() {
      this.paramGetAutomationsInfoList.page = 1
      this.getAutomationInfoList()
    },
    /**
     * @Description: 删除指定ID的自动化方案
     * @Date: 2019/6/27
     **/
    onAutomationsSubmitsDelete() {
      this.$confirm('确认删除已选中的自动化方案？', '提示', {
        type: 'warning'
      }).then(() => {
        const Params = {
          project_id: this.selected_project_id,
          auto_id_list: this.multipleSelection.map(item => item.auto_id)
        }
        deleteAutomation(Params).then(() => {
          this.getAutomationInfoList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          console.error(err)
        })
      })
    },
    /**
     * @Description: 打开自动化方案添加对话框
     * @Date: 2019/6/28
     **/
    openDialogAutomationsAdd() {
      this.paramAutomationsInfo.automation = undefined
      this.paramAutomationsInfo.label = undefined
      this.isDialogAutomationsShow = true
      // if (this.$refs.formAutomations !== undefined) {
      //   this.$refs.formAutomations.resetFields()
      // }
    },
    /**
     * @Description: 关闭自动化方案添加对话框
     * @Date: 2019/6/28
     **/
    closeDialogAutomationsAdd() {
      this.isDialogAutomationsShow = false
    },
    /**
     * @Description: 确认添加新自动化方案
     * @Date: 2019/6/28
     **/
    onAutomationsSubmit() {
      this.$refs.formAutomations.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.isDialogAutomationsLoadingShow = true
            const Params = {
              project_id: this.selected_project_id,
              scene_id: this.paramAutomationsInfo.scene_id,
              auto_id: this.paramAutomationsInfo.auto_id,
              automation: this.paramAutomationsInfo.automation,
              label: this.paramAutomationsInfo.label
            }
            updateAutomation(Params).then(() => {
              this.isDialogAutomationsLoadingShow = false
              this.getAutomationInfoList()
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.isDialogAutomationsShow = false
            }).catch(err => {
              this.isDialogAutomationsLoadingShow = false
              console.error(err)
            })
          } else {
            this.isDialogAutomationsLoadingShow = true
            const Params = {
              project_id: this.selected_project_id,
              scene_id: this.paramAutomationsInfo.scene_id,
              automation: this.paramAutomationsInfo.automation,
              label: this.paramAutomationsInfo.label
            }
            addAutomation(Params).then(() => {
              this.isDialogAutomationsLoadingShow = false
              this.getAutomationInfoList()
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.isDialogAutomationsShow = false
            }).catch(err => {
              this.isDialogAutomationsLoadingShow = false
              console.error(err)
            })
          }
        }
      })
    },
    /**
     * @Description: 打开自动化方案编辑对话框
     * @Date: 2019/6/28
     **/
    openDialogAutomationsEdit(info) {
      this.paramAutomationsInfo.auto_id = info.auto_id
      this.paramAutomationsInfo.automation = info.automation
      this.paramAutomationsInfo.scene_id = info.scene_id
      this.paramAutomationsInfo.label = info.label
      this.isEdit = true
      this.isDialogAutomationsShow = true
    },
    /**
     * @Description: 关闭自动化方案编辑对话框
     * @Date: 2019/6/28
     **/
    closeDialogAutomationsEdit() {
      this.isDialogEditAutomationsShow = false
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .body-wrapper {
    flex: 1;
    overflow: auto;
    .device-item {
      /deep/.el-divider--horizontal {
        margin: 0;
      }
      .item {
        .list{
          font-size: 14px;
          .title {
            height: 30px;
            line-height: 30px;
            color:#303133;
          }
          .content {
            height: 30px;
            line-height: 30px;
            color:#909399;
          }
        }
      }
    }
    /deep/.el-form-item__content {
      span {
        color: #99a9bf;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
  }
</style>
