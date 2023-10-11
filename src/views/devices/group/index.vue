<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="paramsGetGroup.gateway" style="width:200px" placeholder="组名称" class="filter-item" @keyup.enter.native="onSearch" />
      <el-input v-model="paramsGetGroup.mac" style="width:200px" placeholder="Mac地址" class="filter-item" @keyup.enter.native="onSearch" /> -->
      <el-button v-waves v-if="isUpdateShow" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="newGroup">新建</el-button>
      <el-button v-waves v-if="isUpdateShow" :disabled="groupSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteGroups">删除</el-button>
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
      <el-table-column label="组名" align="center" width="180">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="editGroup(scope.row)">{{ scope.row.group_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="组地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.group_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属网关" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gateway }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-waves v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCofig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetGroup.page" :limit.sync="paramsGetGroup.limit" @pagination="getGroupList" />
    <el-dialog :visible.sync="isDialogGroupsShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑组' : '新建组' " @closed="closeDialogGroup">
      <el-form ref="formdata" :model="formdataGroup" :rules="groupRules" label-width="120px">
        <el-form-item label="组名：" class="dialog-form-item" prop="group_name">
          <el-input v-model="formdataGroup.group_name"/>
        </el-form-item>
        <el-form-item label="组地址：" class="dialog-form-item" prop="group_num">
          <el-input :disabled="isEdit" v-model="formdataGroup.group_num"/>
        </el-form-item>
        <el-form-item label="设备类型" class="dialog-form-item" prop="device_type_id">
          <el-select :disabled="isEdit" v-model="formdataGroup.device_type_id" placeholder="请选择设备类型" >
            <el-option v-for="item in devicetypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属网关" class="dialog-form-item" prop="gateway_id">
          <el-select :disabled="isEdit" v-model="formdataGroup.gateway_id" placeholder="请选择网关" >
            <el-option v-for="item in gatewayOptions" :key="item.gateway_id" :label="item.gateway" :value="item.gateway_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：" class="dialog-form-item" >
          <el-input v-model="formdataGroup.label" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isDialogGroupsShow = false">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isButtonLoadingShow" type="primary" @click.native="onSumbit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="ischannelDialogShow"
      title="通道管理"
      direction="ltr"
      size="700"
    >
      <div class="body-wrapper">
        <el-form label-width="100px">
          <el-form-item label="组名称" class="dialog-form-item" >
            <span>{{ groupInfo.group_name || '/' }}</span>
          </el-form-item>
          <el-form-item label="组地址" class="dialog-form-item" >
            <span>{{ groupInfo.group_name || '/' }}</span>
          </el-form-item>
          <el-form-item label="所属网关" class="dialog-form-item">
            <span>{{ groupInfo.gateway|| '/' }}</span>
          </el-form-item>
          <el-form-item label="组设备类型" class="dialog-form-item">
            <span>{{ groupInfo.device_type || '/' }}</span>
          </el-form-item>
          <el-form-item label="描述" class="dialog-form-item">
            <span>{{ groupInfo.label|| '/' }}</span>
          </el-form-item>
          <el-card shadow="never" class="project-list" body-style="padding: 0;">
            <div slot="header" class="clearfix">
              <span style="line-height: 29px">通道配置</span>
            </div>
            <el-transfer
              v-model="paramsUpdateChannel.channel_id_list"
              :filter-method="filterMethod"
              :titles="['通道', '选中的通道']"
              :button-texts="['到左边', '到右边']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              :render-content="renderFunc"
              :props="props"
              :data="channelList"
              target-order="push"
              style="text-align: left; display: inline-block"
              filterable
            >
              <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
            </el-transfer>
          </el-card>
        </el-form>
        <div class="save-button">
          <el-button :disabled="paramsUpdateChannel.channel_id_list.length === 0" type="primary" plain @click="onSavedConfigSubmit">保存配置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { contains } from '@/utils/tools'
import { getGroupcoList, updateGroupcos } from '@/api/groupcos'
import { Formattimestamp } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getDeviceTypeList } from '@/api/devicetypes'
import { getGatewaysList } from '@/api/gateways'
import { getChannelListByID } from '@/api/channelOut'
import { getGroupsInfoList, addGroups, deleteGroups, updateGroups, getGroupsInfo } from '@/api/groups'
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
        gateway_id: { required: true, message: '请选择网关', trigger: 'change' },
        device_type_id: { required: true, message: '请选择设备类型', trigger: 'change' },
        group_name: [{ required: true, message: '请填写组名', trigger: 'blur' }],
        group_num: { required: true, message: '请填写组地址', trigger: 'blur' }
      },
      isEdit: false,
      isButtonLoadingShow: false,
      list: [],
      isUpdateShow: false,
      ischannelDialogShow: false,
      isDialogGroupsShow: false,
      isListLoadingShow: false,
      groupSelection: [],
      devicetypeOptions: [],
      gatewayOptions: [],
      channelList: [],
      groupInfo: {
        device_type: undefined,
        device_type_id: undefined,
        gateway: undefined,
        gateway_id: undefined,
        group_name: undefined,
        group_num: undefined,
        id: undefined,
        label: undefined
      },
      paramsUpdateChannel: {
        project_id: undefined,
        group_id: undefined,
        channel_id_list: []
      },

      questionbankOptions: [],
      tempFilterOptions: {
        question_bank_type: undefined
      },
      // 组总数
      total: 0,
      // 请求组列表信息参数
      paramsGetGroup: {
        project_id: undefined,
        page: 1,
        limit: 20
      },
      props: {
        key: 'id'
      },
      formdataGroup: {
        id: undefined,
        gateway_id: undefined,
        project_id: undefined,
        label: undefined,
        device_type_id: undefined,
        group_name: undefined,
        group_num: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['roles', 'selected_project_id'])
  },
  created() {
    this.isUpdateShow = contains('322', this.roles)
    this.getGroupList()
    this.getDeviceTypeList()
    this.getGatewaysList()
  },
  methods: {
    onSavedConfigSubmit() {
      updateGroupcos(this.paramsUpdateChannel).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }).catch(() => {})
    },
    getGroupcoList(group_id) {
      const params = {
        project_id: this.selected_project_id,
        group_id
      }
      getGroupcoList(params).then(res => {
        this.paramsUpdateChannel.channel_id_list = res.data.items.map(item => item.id)
      }).catch(() => {})
    },
    filterMethod(query, option) {
      if (query) {
        const str = `${option.building}${option.floor}(${option.channel_num})-${option.channel_name}`
        return str.indexOf(query) !== -1
      } else {
        return true
      }
    },
    // 穿梭框配置
    renderFunc(h, option) {
      return <span>{option.building}{option.floor}({ option.channel_num })-{ option.channel_name }</span>
    },

    handleCofig(info) {
      this.groupInfo = info
      this.paramsUpdateChannel.project_id = this.selected_project_id
      this.paramsUpdateChannel.group_id = info.id
      this.getGroupcoList(info.id)
      const params = {
        project_id: this.selected_project_id,
        device_type_id: info.device_type_id,
        gateway_id: info.gateway_id
      }
      getChannelListByID(params).then(res => {
        this.channelList = res.data.items
        this.ischannelDialogShow = true
      }).catch(() => {

      })
    },

    getDeviceTypeList() {
      getDeviceTypeList({ device_type_group_id: 1 }).then(res => {
        this.devicetypeOptions = res.data.items
      }).catch(() => {})
    },
    getGatewaysList() {
      getGatewaysList({ project_id: this.selected_project_id }).then(res => {
        this.gatewayOptions = res.data.items
      }).catch(() => {})
    },
    onSearch() {
      this.getGroupList()
    },
    questionBankChange(val) {
      if (val === '') {
        this.paramsGetGroup.question_bank_type_id = undefined
      } else {
        this.paramsGetGroup.question_bank_type_id = val
      }
      this.getGroupList()
    },
    handleSelectionChange(arr) {
      this.groupSelection = arr
    },

    // 提交表单
    onSumbit() {
      this.$refs.formdata.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            const params = {
              group_id: this.formdataGroup.id,
              gateway_id: this.formdataGroup.gateway_id,
              device_type_id: this.formdataGroup.device_type_id,
              project_id: this.selected_project_id,
              label: this.formdataGroup.label,
              group_name: this.formdataGroup.group_name,
              group_num: this.formdataGroup.group_num
            }
            updateGroups(params).then(() => {
              this.isDialogGroupsShow = false
              this.getGroupList()
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
              gateway_id: this.formdataGroup.gateway_id,
              device_type_id: this.formdataGroup.device_type_id,
              project_id: this.selected_project_id,
              label: this.formdataGroup.label,
              group_name: this.formdataGroup.group_name,
              group_num: this.formdataGroup.group_num
            }
            addGroups(params).then(() => {
              this.isDialogGroupsShow = false
              this.getGroupList()
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
    newGroup() {
      this.isDialogGroupsShow = true
    },
    editGroup({ id: group_id }) {
      this.formdataGroup.id = group_id
      getGroupsInfo({
        project_id: this.selected_project_id,
        group_id
      }).then(res => {
        const info = res.data
        this.formdataGroup.label = info.label
        this.formdataGroup.gateway_id = info.gateway_id
        this.formdataGroup.device_type_id = info.device_type_id
        this.formdataGroup.group_name = info.group_name
        this.formdataGroup.group_num = info.group_num
        this.isDialogGroupsShow = true
        this.isEdit = true
      }).catch(() => {

      })
    },
    closeDialogGroup() {
      if (this.isEdit) {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.resetFields()
        this.init()
      } else {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.clearValidate()
      }
      this.isEdit = false
    },
    init() {
      this.formdataGroup.label = undefined
      this.formdataGroup.gateway_id = undefined
      this.formdataGroup.group_name = undefined
      this.formdataGroup.group_num = undefined
      this.formdataGroup.device_type_id = undefined
    },
    deleteGroups() {
      this.$confirm('确认删除选中的组吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isListLoadingShow = true
        const deleteParam = {
          group_id_list: this.groupSelection.map(item => item.id),
          project_id: this.selected_project_id
        }
        deleteGroups(deleteParam).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.isListLoadingShow = false
          this.getGroupList()
        }).catch(err => {
          console.error(err)
          this.isListLoadingShow = false
        })
      })
    },
    getGroupList() {
      this.paramsGetGroup.project_id = this.selected_project_id
      this.isListLoadingShow = true
      getGroupsInfoList(this.paramsGetGroup).then(res => {
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

<style lang="scss" scoped>
  /deep/.el-transfer-panel {
    width: 300px;
  }
  .body-wrapper {
    .save-button {
      margin-top: 10px;
      text-align: center;
    }
  }
</style>
