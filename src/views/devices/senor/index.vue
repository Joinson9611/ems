<template>
  <div class="app-container">
    <div class="filter-container">
      <!--设备ID筛选框-->
      <el-input v-model="tempFilterOptions.device_num" clearable placeholder="设备地址编码" style="width: 145px;" class="filter-item" @keyup.enter.native="onSearch"/>
      <!-- <el-select v-model="tempFilterOptions.building_id" style="width: 140px" placeholder="请选择控制器类型" class="filter-item" clearable>
        <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id"/>
      </el-select> -->
      <!-- <el-select v-model="tempFilterOptions.device_type_group_id" placeholder="请选择设备组" style="width: 140px" class="filter-item" clearable >
        <el-option v-for="item in channelOptions" :key="item.gateway_id" :label="item.channel" :value="item.channel_id"/>
      </el-select> -->
      <el-select v-model="tempFilterOptions.device_type_id" placeholder="设备类型" clearable style="width: 135px" class="filter-item">
        <el-option v-for="item in devicetypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id"/>
      </el-select>
      <el-select v-model="tempFilterOptions.gateway_id" placeholder="请选择网关" style="width: 120px" class="filter-item" clearable >
        <el-option v-for="item in gatewayOptions" :key="item.gateway_id" :label="item.gateway" :value="item.gateway_id"/>
      </el-select>
      <el-select v-model="tempFilterOptions.building_id" placeholder="请选择建筑" style="width: 120px" class="filter-item" clearable @change="buildingChange">
        <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id"/>
      </el-select>
      <el-select v-model="tempFilterOptions.floor_id" placeholder="请选择楼层" style="width: 120px" class="filter-item" clearable >
        <el-option v-for="item in floorOptions" :key="item.floor_id" :label="item.floor" :value="item.floor_id"/>
      </el-select>
      <!--筛选按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
      <!--删除按钮-->
      <el-button v-waves v-if="isUpdateShow" :disabled="deviceSelection.length===0" class="filter-item" type="danger" @click="onDeleteDevices">删除</el-button>
      <!--新建按钮-->
      <el-button v-waves v-if="isUpdateShow" class="filter-item" type="primary" @click="onAddDevice">新建</el-button>
    </div>

    <el-table
      v-loading="isDeviceInfoListLoadingShow"
      :data="deviceInfoList"
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
          {{ scope.$index + 1 + (paramGetDeviceInfoList.page - 1) * paramGetDeviceInfoList.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="控制器名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogDeviceEdit(scope.row)"><i>{{ scope.row.device }}</i></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码地址">
        <template slot-scope="scope">
          <span>{{ scope.row.device_num }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="网关名称">
        <template slot-scope="scope">
          <span>{{ scope.row.gateway }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属建筑">
        <template slot-scope="scope">
          <span>{{ scope.row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属楼层">
        <template slot-scope="scope">
          <span>{{ scope.row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column v-waves v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleChannel(scope.row)">通道管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="paramGetDeviceInfoList.page" :limit.sync="paramGetDeviceInfoList.limit" @pagination="getDeviceInfoList" />

    <el-dialog :visible.sync="isDialogDevicesShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit? '编辑控制器' : '新建控制器'" @close="closeDialogDevice">
      <el-form ref="formDevice" :model="formDataDevice" :rules="DeviceInfoRules" label-width="100px">
        <el-form-item label="设备名称" class="dialog-form-item" prop="device">
          <el-input v-model="formDataDevice.device" type="text" />
        </el-form-item>
        <el-form-item label="地址编码" class="dialog-form-item" prop="device">
          <el-input :disabled="isEdit" :maxlength="8" v-model="formDataDevice.device_num" type="text" />
        </el-form-item>
        <el-form-item label="设备类型" class="dialog-form-item" prop="device_type_id">
          <el-select :disabled="isEdit" v-model="formDataDevice.device_type_id" placeholder="请选择控制器类型" >
            <el-option v-for="item in devicetypeOptions" :key="item.device_type_id" :label="item.device_type" :value="item.device_type_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="网关" class="dialog-form-item" prop="gateway_id">
          <el-select :disabled="isEdit" v-model="formDataDevice.gateway_id" placeholder="请选择网关" >
            <el-option v-for="item in gatewayOptions" :key="item.gateway_id" :label="item.gateway" :value="item.gateway_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属建筑" class="dialog-form-item" prop="building_id">
          <el-select v-model="formDataDevice.building_id" placeholder="请选择建筑" @change="dialogBuildingChange">
            <el-option v-for="item in dialogBuildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属楼层" class="dialog-form-item" prop="floor_id">
          <el-select v-model="formDataDevice.floor_id" placeholder="请选择楼层" >
            <el-option v-for="item in dialogFloorOptions" :key="item.floor_id" :label="item.floor" :value="item.floor_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述" class="dialog-form-item">
          <el-input v-model="formDataDevice.label" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogDevice">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isDeviceLoadingShow" type="primary" @click.native="onDeviceSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="ischannelDialogShow"
      title="通道管理"
      direction="ltr"
      size="50%"
    >
      <div class="body-wrapper">
        <el-form label-width="100px">
          <el-form-item label="设备名称" class="dialog-form-item" prop="device">
            <span>{{ deviceInfo.device }}</span>
          </el-form-item>
          <el-form-item label="设备描述" class="dialog-form-item">
            <span>{{ deviceInfo.label }}</span>
          </el-form-item>
          <el-form-item label="设备类型" class="dialog-form-item">
            <span>{{ deviceInfo.device_type }}</span>
          </el-form-item>
          <el-card shadow="never" class="project-list" body-style="padding: 0;">
            <div slot="header" class="clearfix">
              <span style="line-height: 29px">通道列表</span>
              <div class="button" style="float: right">
                <!--新建-->
                <el-button v-waves class="filter-item" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-plus" @click="isDialogHandleChannelShow = true">新建通道</el-button>
                <!--删除-->
                <el-button v-waves v-loading="isChannelDeleteLoading" :disabled="channelselection.length===0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteChannel">删除通道</el-button>
              </div>
            </div>
            <el-table
              v-loading="isChannelLoadingShow"
              :data="channelList"
              element-loading-text="Loading"
              style="width: 100%;"
              fit
              highlight-current-row
              max-height="500"
              @selection-change="handleChannelSelectionChange"
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
                  <a style="color: #409EFF" @click="openEditChannel(scope.row)">{{ scope.row.channel_name }}</a>
                </template>
              </el-table-column>
              <el-table-column label="通道描述" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.label || '/' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="通道地址" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.channel_num || '/' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="isDialogHandleChannelShow" :append-to-body="true" :close-on-click-modal="false" :title="isChannelEdit? '编辑通道' : '新建通道'" @close="closeChannelDialog">
      <el-form ref="formChannel" :model="channelInfo" :rules="ChannelInfoRules" label-width="100px">
        <el-form-item label="通道名称" class="dialog-form-item" prop="channel_name">
          <el-input v-model="channelInfo.channel_name" type="text" />
        </el-form-item>
        <el-form-item label="通道地址" class="dialog-form-item" prop="channel_num">
          <el-input v-model="channelInfo.channel_num" type="text" onkeyup="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="通道描述" class="dialog-form-item" prop="label">
          <el-input v-model="channelInfo.label" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="isDialogHandleChannelShow = false">取消</el-button>
        <el-button v-waves :loading="isDialogChannelLoadingShow" type="primary" @click.native="onChannelSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { contains } from '@/utils/tools'
import { getBuildingList } from '@/api/buildings'
import { getFloorList } from '@/api/floors'
import { getDeviceTypeList } from '@/api/devicetypes'
import { getGatewaysList } from '@/api/gateways'
import { getDeviceInfoList, deleteDevice, addDevice, updateDevice, getDeviceInfo } from '@/api/devices'
import { getChannelsenorsInfoList, addChannelsenors, updateChannelsenors, deleteChannelsenors } from '@/api/channelsenors'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Device',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      buildingOptions: [],
      dialogBuildingOptions: [],
      floorOptions: [],
      dialogFloorOptions: [],
      devicetypeOptions: [],
      gatewayOptions: [],
      deviceSelection: [],
      channelselection: [],
      deviceInfoList: [],
      channelList: [],
      isEdit: false,
      isChannelLoadingShow: false,
      isChannelDeleteLoading: false,
      isDeviceInfoListLoadingShow: false,
      isDialogDevicesShow: false,
      isDeviceLoadingShow: false,
      isDialogChannelLoadingShow: false,
      ischannelDialogShow: false,
      isDialogHandleChannelShow: false,
      isUpdateShow: false,
      isChannelEdit: false,

      total: 0,
      channelTotal: 0,

      paramsGetChannelList: {
        device_id: undefined,
        project_id: undefined,
        device_type_group_id: undefined
      },
      tempFilterOptions: {
        device_num: undefined,
        gateway_id: undefined,
        device_type_id: undefined,
        floor_id: undefined,
        building_id: undefined,
        device_type_group_id: undefined
      },
      deviceInfo: {
        device: undefined,
        label: undefined,
        device_type: undefined
      },
      channelInfo: {
        project_id: undefined,
        channel_num: undefined,
        channel_name: undefined,
        label: undefined,
        channel_id: undefined
      },
      paramGetDeviceInfoList: {
        page: 1,
        limit: 20,
        project_id: undefined,
        device_num: undefined,
        device_type_id: undefined,
        floor_id: undefined,
        building_id: undefined,
        device_type_group_id: 3,
        gateway_id: undefined
      },
      formDataDevice: {
        device: undefined,
        device_id: undefined,
        label: undefined,
        floor_id: undefined,
        building_id: undefined,
        gateway_id: undefined,
        device_num: undefined,
        device_type_id: undefined
      },

      ChannelInfoRules: {
        channel_name: [{ required: true, trigger: 'blur', message: '请输入通道名称' }],
        channel_num: [{ required: true, trigger: 'blur', message: '请输入通道地址' }],
        label: [{ required: true, trigger: 'blur', message: '请输入通道描述' }]
      },
      DeviceInfoRules: {
        device: [{ required: true, trigger: 'blur', message: '请输入控制器名称' }],
        gateway_id: [{ required: true, trigger: 'change', message: '请选择网关' }],
        device_num: [{ required: true, trigger: 'blur', message: '请输入地址编码' }],
        device_type_id: [{ required: true, trigger: 'change', message: '请输入设备类型' }],
        floor_id: [{ required: true, trigger: 'change', message: '请选择楼层' }],
        building_id: [{ required: true, trigger: 'change', message: '请选择建筑' }]
      }
    }
  },

  computed: {
    ...mapGetters([
      'selected_project_id',
      'roles'
    ])
  },

  watch: {
    'tempFilterOptions.device_type_id': {
      handler(curVal) {
        if (curVal === '') {
          this.tempFilterOptions.device_type_id = undefined
        }
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.isUpdateShow = contains('312', this.roles)
    this.getDeviceInfoList()
    this.getDeviceTypeList()
    this.getGatewaysList()
    this.getBuildingList()
  },
  methods: {
    getChannelsenorsInfoList() {
      this.isChannelLoadingShow = true
      const params = {
        project_id: this.selected_project_id,
        device_id: this.paramsGetChannelList.device_id
      }
      getChannelsenorsInfoList(params).then(res => {
        this.isChannelLoadingShow = false
        this.channelList = res.data.items
        this.channelTotal = res.data.total
      }).catch(() => {
        this.isChannelLoadingShow = false
      })
    },

    buildingChange(id) {
      this.tempFilterOptions.floor_id = undefined
      // 如果建筑列表清空执行
      if (id === '') {
        this.floorOptions = []
      } else this.getFloorList(id)
    },
    init() {
      this.formDataDevice.building_id = undefined
      this.formDataDevice.label = undefined
      this.formDataDevice.channel_id = undefined
      this.formDataDevice.device_type_id = undefined
      this.formDataDevice.device_num = undefined
      this.formDataDevice.system_type_id = undefined
      this.formDataDevice.device_type_group_id = undefined
      this.formDataDevice.gateway_id = undefined
    },
    onSearch() {
      this.paramGetDeviceInfoList.building_id = this.tempFilterOptions.building_id !== '' ? this.tempFilterOptions.building_id : undefined
      this.paramGetDeviceInfoList.floor_id = this.tempFilterOptions.floor_id !== '' ? this.tempFilterOptions.channel_id : undefined
      this.paramGetDeviceInfoList.device_type_id = this.tempFilterOptions.device_type_id !== '' ? this.tempFilterOptions.device_type_id : undefined
      this.paramGetDeviceInfoList.device_num = this.tempFilterOptions.device_num !== '' ? this.tempFilterOptions.device_num : undefined
      this.paramGetDeviceInfoList.gateway_id = this.tempFilterOptions.gateway_id !== '' ? this.tempFilterOptions.gateway_id : undefined
      this.paramGetDeviceInfoList.page = 1
      this.getDeviceInfoList()
    },
    dialogBuildingChange(id) {
      this.formDataDevice.floor_id = undefined
      // 如果建筑列表清空执行
      if (id === '') {
        this.dialogChannelOptions = []
      } else this.getDialogFloorList(id)
    },
    getDeviceInfo(device_id) {
      const params = {
        project_id: this.selected_project_id,
        device_id
      }
      getDeviceInfo(params).then(res => {
        const info = res.data
        this.formDataDevice.device = info.device
        this.formDataDevice.device_num = info.device_num
        this.formDataDevice.device_type_id = info.device_type_id
        this.formDataDevice.building_id = info.building_id
        this.formDataDevice.gateway_id = info.gateway_id
        this.formDataDevice.floor_id = info.floor_id
        this.formDataDevice.label = info.label
        this.getDialogFloorList(info.building_id)
      }).catch(() => {

      })
    },
    onAddDevice() {
      this.isDialogDevicesShow = true
    },
    getBuildingList() {
      const params = {
        project_id: this.selected_project_id
      }
      getBuildingList(params).then(res => {
        this.buildingOptions = res.data.items
        this.dialogBuildingOptions = res.data.items
      }).catch(err => {
        console.log(err)
      })
    },
    getFloorList(bid) {
      const params = {
        building_id: bid,
        project_id: this.selected_project_id
      }
      getFloorList(params).then(res => {
        this.floorOptions = res.data.items
      }).catch(err => {
        console.log(err)
      })
    },

    getDialogFloorList(bid) {
      const params = {
        building_id: bid,
        project_id: this.selected_project_id
      }
      getFloorList(params).then(res => {
        this.dialogFloorOptions = res.data.items
      }).catch(err => {
        console.log(err)
      })
    },

    onDeleteDevices() {
      this.$confirm('确认删除选中设备吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          device_id_list: this.deviceSelection.map(item => item.id)
        }

        deleteDevice(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getDeviceInfoList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    getDeviceTypeList() {
      getDeviceTypeList({ device_type_group_id: 3 }).then(res => {
        this.devicetypeOptions = res.data.items
      }).catch(() => {})
    },
    getGatewaysList() {
      getGatewaysList({ project_id: this.selected_project_id }).then(res => {
        this.gatewayOptions = res.data.items
      }).catch(() => {})
    },
    closeChannelDialog() {
      this.isDialogHandleChannelShow = false
      this.channelInit()
      if (this.$refs.formChannel !== undefined) this.$refs.formChannel.resetFields()
      this.isChannelEdit = false
    },
    openEditChannel(info) {
      this.isDialogHandleChannelShow = true
      this.channelInfo.channel_num = info.channel_num
      this.channelInfo.channel_name = info.channel_name
      this.channelInfo.channel_id = info.id
      this.channelInfo.label = info.label
      this.isChannelEdit = true
    },
    handleChannelSelectionChange(val) {
      this.channelselection = val
    },
    deleteChannel() {
      this.$confirm('确认删除选中通道吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          channel_id_list: this.channelselection.map(item => item.id)
        }
        deleteChannelsenors(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getChannelsenorsInfoList()
        }).catch(err => {
          console.log(err)
        })
      })
    },

    onChannelSubmit() {
      this.$refs.formChannel.validate(valid => {
        if (valid) {
          let param = {}
          if (this.isChannelEdit) {
            param = {
              project_id: this.selected_project_id,
              channel_id: this.channelInfo.channel_id,
              channel_num: this.channelInfo.channel_num,
              channel_name: this.channelInfo.channel_name,
              label: this.channelInfo.label
            }
            updateChannelsenors(param).then(() => {
              this.$message({ type: 'success', message: '编辑成功' })
              this.isDialogHandleChannelShow = false
              this.getChannelsenorsInfoList()
            }).catch(() => {
              this.isDialogHandleChannelShow = false
            })
          } else {
            param = {
              project_id: this.selected_project_id,
              device_id: this.paramsGetChannelList.device_id,
              label: this.channelInfo.label,
              channel_num: this.channelInfo.channel_num,
              channel_name: this.channelInfo.channel_name
            }
            addChannelsenors(param).then(() => {
              this.$message({ type: 'success', message: '新建成功' })
              this.isDialogHandleChannelShow = false
              this.getChannelsenorsInfoList()
            }).catch(() => {

            })
          }
        }
      })
    },

    handleChannel({ device, label, id: device_id, device_type_group_id, device_type }) {
      this.deviceInfo.device = device
      this.deviceInfo.label = label
      this.deviceInfo.device_type = device_type
      this.paramsGetChannelList.project_id = this.selected_project_id
      this.paramsGetChannelList.device_id = device_id
      this.paramsGetChannelList.device_type_group_id = device_type_group_id
      this.getChannelsenorsInfoList()
      this.ischannelDialogShow = true
    },
    channelInit() {
      this.channelInfo.label = undefined
      this.channelInfo.channel = undefined
    },
    /**
     * @Description: 列表选中回调
     * @Date: 2019/6/27
     **/
    handleSelectionChange(val) {
      this.deviceSelection = val
    },
    /**
     * @Description: 获取控制器信息列表
     * @Date: 2019/6/27
     **/
    getDeviceInfoList() {
      const Params = {
        project_id: this.selected_project_id,
        page: this.paramGetDeviceInfoList.page,
        limit: this.paramGetDeviceInfoList.limit,
        gateway_id: this.paramGetDeviceInfoList.gateway_id,
        device_type_group_id: this.paramGetDeviceInfoList.device_type_group_id,
        device_type_id: this.paramGetDeviceInfoList.device_type_id,
        building_id: this.paramGetDeviceInfoList.building_id,
        channel_id: this.paramGetDeviceInfoList.channel_id,
        device_num: this.paramGetDeviceInfoList.device_num
      }
      this.isDeviceInfoListLoadingShow = true
      getDeviceInfoList(Params).then(res => {
        this.deviceInfoList = res.data.items
        this.total = res.data.total
        this.isDeviceInfoListLoadingShow = false
      }).catch(err => {
        this.isDeviceInfoListLoadingShow = false
        console.error(err)
      })
    },
    /**
     * @Description: 删除指定ID的控制器
     * @Date: 2019/6/27
     **/
    onDevicesDelete() {
      this.$confirm('确认删除已选中的控制器？', '提示', {
        type: 'warning'
      }).then(() => {
        const Params = {
          device_id_list: this.deviceSelection.map(item => item.device_id)
        }
        deleteDevice(Params).then(() => {
          this.getDeviceInfoList()
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
     * @Description: 打开控制器添加对话框
     * @Date: 2019/6/28
     **/
    openDialogDeviceAdd() {
      this.isDialogAddDeviceShow = true
    },
    /**
     * @Description: 关闭控制器添加对话框
     * @Date: 2019/6/28
     **/
    closeDialogDeviceAdd() {
      this.isDialogAddDeviceShow = false
    },
    /**
     * @Description: 确认添加新控制器
     * @Date: 2019/6/28
     **/
    onDeviceSubmit() {
      this.$refs.formDevice.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.isDeviceLoadingShow = true
            const Params = {
              project_id: this.selected_project_id,
              device_id: this.formDataDevice.device_id,
              device: this.formDataDevice.device,
              label: this.formDataDevice.label,
              gateway_id: this.formDataDevice.gateway_id,
              device_type_id: this.formDataDevice.device_type_id,
              building_id: this.formDataDevice.building_id,
              floor_id: this.formDataDevice.floor_id,
              device_num: this.formDataDevice.device_num,
              device_type_group_id: this.formDataDevice.device_type_group_id
            }
            updateDevice(Params).then(() => {
              this.isDeviceLoadingShow = false
              this.getDeviceInfoList()
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.isDialogDevicesShow = false
            }).catch(err => {
              this.isDeviceLoadingShow = false
              console.error(err)
            })
          } else {
            this.isDeviceLoadingShow = true
            const Params = {
              project_id: this.selected_project_id,
              device: this.formDataDevice.device,
              label: this.formDataDevice.label,
              gateway_id: this.formDataDevice.gateway_id,
              device_type_id: this.formDataDevice.device_type_id,
              building_id: this.formDataDevice.building_id,
              floor_id: this.formDataDevice.floor_id,
              device_num: this.formDataDevice.device_num,
              device_type_group_id: this.formDataDevice.device_type_group_id
            }
            addDevice(Params).then(() => {
              this.isDeviceLoadingShow = false
              this.getDeviceInfoList()
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.isDialogDevicesShow = false
            }).catch(err => {
              this.isDeviceLoadingShow = false
              console.error(err)
            })
          }
        }
      })
    },
    /**
     * @Description: 打开控制器编辑对话框
     * @Date: 2019/6/28
     **/
    openDialogDeviceEdit({ id: device_id }) {
      this.isEdit = true
      this.formDataDevice.device_id = device_id
      this.getDeviceInfo(device_id)
      this.isDialogDevicesShow = true
    },
    /**
     * @Description: 关闭控制器编辑对话框
     * @Date: 2019/6/28
     **/
    closeDialogDevice() {
      this.isEdit = false
      this.init()
      if (this.$refs.formDevice !== undefined) {
        this.$refs.formDevice.resetFields()
      }
      this.isDialogDevicesShow = false
    }
  }
}
</script>

