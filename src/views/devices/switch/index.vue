<template>
  <div class="app-container">
    <!--任务列表-->
    <el-table
      v-loading="isListLoadingShow"
      :data="channelList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"/>
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column label="通道名称" align="center" width="180">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="updateChannel(scope.row)">{{ scope.row.channel_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="组地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属网关" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gateway }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属建筑" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属楼层" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCofig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="ischannelDialogShow" :append-to-body="true" :close-on-click-modal="false" title="通道编辑" @closed="closeDialogGroup">
      <el-form ref="formdata" :model="formdataSwitch" :rules="rules" label-width="120px">
        <el-form-item label="模式类型" class="dialog-form-item" prop="ctrl_type_id" >
          <el-select v-model="formdataSwitch.ctrl_type_id" placeholder="请选择模式类型" >
            <el-option v-for="item in ctrlOptions" :key="item.id" :label="item.type" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开关类型" class="dialog-form-item" prop="channel_type_id" >
          <el-select v-model="formdataSwitch.channel_type_id" placeholder="请选择开关类型" >
            <el-option v-for="item in channelTypeOptions" :key="item.id" :label="item.type" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="ischannelDialogShow = false">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isButtonLoadingShow" type="primary" @click.native="onChannelUpdateSumbit">确定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetGroup.page" :limit.sync="paramsGetGroup.limit" @pagination="getGroupList" />
    <el-dialog :visible.sync="isDialogSwitchShow" :append-to-body="true" :close-on-click-modal="false" title="通道配置" @closed="closeDialogGroup">
      <el-form ref="formdata" :model="formdataSwitch" :rules="rules" label-width="120px">
        <el-form-item label="网关：" class="dialog-form-item">
          <el-input v-model="formdataSwitch.gateway" readonly/>
        </el-form-item>
        <el-form-item label="设备类型" class="dialog-form-item" prop="device_type_id" >
          <el-select v-model="formdataSwitch.device_type_id" placeholder="请选择设备类型" @change="deviceTypeChange">
            <el-option v-for="item in devicetypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formdataSwitch.ctrl_type_id === 2" label="设备" class="dialog-form-item" prop="device_id" >
          <el-select v-model="formdataSwitch.device_id" placeholder="请选择设备" @change="deviceChange">
            <el-option v-for="item in deviceOptions" :key="item.id" :label="item.device_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formdataSwitch.ctrl_type_id === 1" label="组" class="dialog-form-item" prop="group_id_list">
          <el-select v-model="formdataSwitch.group_id_list" multiple placeholder="请选择组" >
            <el-option v-for="item in groupOptions" :key="item.id" :label="item.group_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="通道" class="dialog-form-item" prop="co_id">
          <el-select v-model="formdataSwitch.co_id" placeholder="请选择通道" >
            <el-option v-for="item in channelOptions" :key="item.id" :label="item.channel_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="值" class="dialog-form-item" prop="value">
          <el-radio-group v-if="formdataSwitch.device_type_id === 10" v-model="formdataSwitch.value">
            <el-radio :label="0">关</el-radio>
            <el-radio :label="1">开</el-radio>
          </el-radio-group>
          <el-slider v-else :min="0" :max="100" v-model="formdataSwitch.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isDialogSwitchShow = false">取消</el-button>
        <el-button v-waves :loading="isButtonLoadingShow" type="primary" @click.native="onSumbit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contains } from '@/utils/tools'
import { updateChannelIn } from '@/api/channelIn'
import { getChannelOutInfoList } from '@/api/channelOut'
import { getDeviceList } from '@/api/devices'
import { getGroupsList } from '@/api/groups'
import { CiGroupDetail, updateCiGroup } from '@/api/cigroups'
import { CiCosDetail, updateCiCos } from '@/api/cicos'
import { getChannelInlist } from '@/api/channelIn'
import { Formattimestamp } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getDeviceTypeList } from '@/api/devicetypes'
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
      rules: {
        device_id: { required: true, message: '请选择设备', trigger: 'change' },
        device_type_id: { required: true, message: '请选择设备类型', trigger: 'change' },
        ctrl_type_id: { required: true, message: '请选择模式类型', trigger: 'change' },
        channel_type_id: { required: true, message: '请选择开关类型', trigger: 'change' },
        value: { required: true, message: '请选择值', trigger: 'change' },
        group_id_list: { required: true, message: '请选择组', trigger: 'change' },
        co_id: { required: true, message: '请选择通道', trigger: 'change' }
      },
      isEdit: false,
      isUpdateShow: false,
      isButtonLoadingShow: false,
      list: [],
      isDialogSwitchShow: false,
      ischannelDialogShow: false,
      isListLoadingShow: false,
      devicetypeOptions: [],
      gatewayOptions: [],
      groupOptions: [],

      ctrlOptions: [
        { id: 1, type: '组控模式' },
        { id: 2, type: '单控模式' }
      ],
      channelTypeOptions: [
        { id: 1, type: '普通开关' },
        { id: 2, type: '场景开关' }
      ],
      channelList: [],

      deviceOptions: [],
      channelOptions: [],

      paramsGetChannellist: {
        project_id: undefined,
        device_type_id: -1,
        page: 1,
        limit: 20
      },

      switchInfo: {
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
      formdataSwitch: {
        id: undefined,
        project_id: undefined,
        label: undefined,
        group_id_list: undefined,
        gateway_id: undefined,
        device_type_id: undefined,
        channel_id: undefined,
        ctrl_type_id: undefined,
        channel_type_id: undefined,
        value: undefined,
        co_id: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id', 'roles'])
  },
  created() {
    this.isUpdateShow = contains('332', this.roles)
    this.getChannelInlist()
    this.getDeviceTypeList()
  },
  methods: {
    getChannelOutInfoList(device_id) {
      const params = {
        device_id,
        project_id: this.selected_project_id
      }
      getChannelOutInfoList(params).then(res => {
        this.channelOptions = res.data.items
      }).catch(() => {})
    },

    onChannelUpdateSumbit() {
      const params = {
        project_id: this.selected_project_id,
        channel_id: this.formdataSwitch.id,
        ctrl_type_id: this.formdataSwitch.ctrl_type_id,
        channel_type_id: this.formdataSwitch.channel_type_id
      }
      updateChannelIn(params).then(() => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.getChannelInlist()
        this.ischannelDialogShow = false
      }).catch(() => {})
    },

    updateChannel(info) {
      this.formdataSwitch.id = info.id
      this.formdataSwitch.ctrl_type_id = info.ctrl_type_id
      this.formdataSwitch.channel_type_id = info.channel_type_id
      this.ischannelDialogShow = true
    },
    deviceChange(id) {
      if (id) {
        this.getChannelOutInfoList(id)
      } else {
        this.formdataSwitch.co_id = undefined
      }
    },
    onSumbit() {
      if (this.formdataSwitch.ctrl_type_id === 1) {
        const params = {
          project_id: this.selected_project_id,
          channel_id: this.formdataSwitch.channel_id,
          group_id_list: this.formdataSwitch.group_id_list.join(','),
          value: this.formdataSwitch.value,
          device_type_id: this.formdataSwitch.device_type_id
        }
        updateCiGroup(params).then(() => {
          this.$message({
            type: 'success',
            message: '配置成功'
          })
          this.isDialogSwitchShow = false
        }).catch(() => {})
      } else {
        const params = {
          project_id: this.selected_project_id,
          channel_id: this.formdataSwitch.channel_id,
          value: this.formdataSwitch.value,
          co_id: this.formdataSwitch.co_id
        }
        updateCiCos(params).then(res => {
          this.$message({
            type: 'success',
            message: '配置成功'
          })
          this.isDialogSwitchShow = false
        }).catch(() => {})
      }
    },

    getDeviceList() {
      const params = {
        project_id: this.selected_project_id,
        device_type_group_id: 0,
        gateway_id: this.formdataSwitch.gateway_id,
        device_type_id: this.formdataSwitch.device_type_id
      }
      getDeviceList(params).then(res => {
        this.deviceOptions = res.data.items
      }).catch(() => {})
    },

    deviceTypeChange(id) {
      this.formdataSwitch.group_id_list = []
      if (id) {
        if (this.formdataSwitch.ctrl_type_id === 1) {
          this.getGroupsList(id)
        } else {
          this.getDeviceList()
        }
      }
    },
    getGroupsList(device_type_id) {
      const params = {
        project_id: this.selected_project_id,
        device_type_id
      }
      getGroupsList(params).then(res => {
        this.groupOptions = res.data.items
      }).catch(() => {})
    },
    getChannelInlist() {
      this.isListLoadingShow = true
      this.paramsGetChannellist.project_id = this.selected_project_id
      getChannelInlist(this.paramsGetChannellist).then(res => {
        this.channelList = res.data.items
        this.isListLoadingShow = false
        this.total = res.data.total
      }).catch(() => {
        this.isListLoadingShow = false
      })
    },
    getDeviceTypeList() {
      getDeviceTypeList({
        device_type_group_id: 1
      }).then(res => {
        this.devicetypeOptions = res.data.items
      }).catch(() => {})
    },
    onSavedConfigSubmit() {

    },

    handleCofig(info) {
      this.formdataSwitch.channel_type_id = info.channel_type_id
      this.formdataSwitch.ctrl_type_id = info.ctrl_type_id
      this.formdataSwitch.channel_id = info.id
      this.formdataSwitch.gateway_id = info.gateway_id
      const params = {
        project_id: this.selected_project_id,
        channel_id: info.id
      }
      if (info.ctrl_type_id === 1) {
        CiGroupDetail(params).then(res => {
          const temp = res.data
          this.formdataSwitch.gateway = temp.gateway
          this.formdataSwitch.device_type_id = temp.device_type_id || undefined
          this.getGroupsList(temp.device_type_id)
          this.formdataSwitch.group_id_list = temp.group_id_list.split(',').map(item => item * 1)
          this.formdataSwitch.value = temp.value
          this.formdataSwitch.co_id = temp.co_id
          this.isDialogSwitchShow = true
        }).catch(() => {})
      } else if (info.ctrl_type_id === 2) {
        CiCosDetail(params).then(res => {
          const temp = res.data
          this.formdataSwitch.gateway = temp.gateway_name
          this.formdataSwitch.device_type_id = temp.device_type_id || undefined
          this.formdataSwitch.device_id = temp.device_id
          this.getDeviceList()
          this.getChannelOutInfoList(temp.device_id)
          this.formdataSwitch.co_id = temp.co_id
          this.formdataSwitch.value = temp.value
          this.isDialogSwitchShow = true
        }).catch(() => {})
      }
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
