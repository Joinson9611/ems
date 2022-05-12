<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="tempFilterOptions.device_id" clearable placeholder="设备ID" style="width: 145px;" class="filter-item" @keyup.enter.native="onSearch"/> -->
      <el-button v-waves v-if="isEditAllow" :size="size" class="filter-item" type="primary" icon="el-icon-plus" @click="openDialog">添加</el-button>
      <!--删除按钮-->
      <el-button v-waves v-if="isEditAllow" :size="size" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDelete">删除</el-button>
    </div>
    <el-table
      v-loading="isDevicesLoadingShow"
      :data="devicesInfoList"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="45"/>
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDevices.page - 1) * paramsGetDevices.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="设备ID" width="200px">
        <template slot-scope="scope">
          <a class="skip" @click="onEdit(scope.row)"><i>{{ scope.row.device_id }}</i></a>
        </template>
      </el-table-column>
      <!-- <el-table-column label="设备名称" width="100px" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column> -->
      <el-table-column label="设备描述" >
        <template slot-scope="scope">
          {{ scope.row.label }}
        </template>
      </el-table-column>
      <el-table-column label="设备地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetDevices.page" :limit.sync="paramsGetDevices.limit" @pagination="getDevicesList" />
    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑设备' : '添加设备'" @closed="closeDialog">
      <el-form ref="formDevices" :model="paramsDevicesInfo" :rules="devicesInfoRules" label-width="120px">
        <el-form-item label="设备ID" class="dialog-form-item" prop="device_id">
          <el-input :disabled="isEdit" v-model="paramsDevicesInfo.device_id" placeholder="请填写设备ID" type="text"/>
        </el-form-item>
        <el-form-item label="设备名称" class="dialog-form-item" prop="name">
          <el-input v-model="paramsDevicesInfo.name" placeholder="请填写设备名称" type="text"/>
        </el-form-item>
        <el-form-item label="设备描述" class="dialog-form-item" prop="label">
          <el-input v-model="paramsDevicesInfo.label" placeholder="请填写设备描述" type="textarea"/>
        </el-form-item>
        <el-form-item label="设备位置" class="dialog-form-item" prop="address">
          <el-input v-model="paramsDevicesInfo.address" placeholder="请填写设备位置" type="text"/>
        </el-form-item>
        <el-form-item v-if="['302','303'].includes(paramsDevicesInfo.device_type_id)" label="是否联动输出" class="dialog-form-item" >
          <el-checkbox :true-label="1" :disabled="issetoutputLoading" :false-label="0" v-model="paramsDevicesInfo.is_auto_output" @change="outputChange" />
        </el-form-item>
        <el-form-item v-if="['303'].includes(paramsDevicesInfo.device_type_id)" label="是否布防护" class="dialog-form-item" >
          <el-checkbox :true-label="1" :disabled="issetarmingLoading" :false-label="0" v-model="paramsDevicesInfo.is_arming" @change="alarmChange"/>
        </el-form-item>
        <el-form-item v-if="['303'].includes(paramsDevicesInfo.device_type_id) && paramsDevicesInfo.is_arming" label="布防时间" class="dialog-form-item" >
          <el-button type="primary" size="mini" @click="setTime">设置</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="dialogVisible = false">取消</el-button>
        <el-button v-waves v-if="isEditAllow" :loading="isBtnEditLoading" type="primary" @click.native="onSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isTimeSettingShow" :append-to-body="true" :close-on-click-modal="false" title="布防时间设置" >
      <el-form ref="formDevices" :model="paramsDevicesInfo" :rules="devicesInfoRules" label-width="120px">
        <el-form-item label="布防时间点" class="dialog-form-item" >
          <el-checkbox v-for="(time,key) in times" :true-label="1" :false-label="0" :key="key" v-model="timesTag[key]" size="mini" style="margin-left:0" border @change="timingChange">{{ time }}</el-checkbox>
        </el-form-item>
        <el-form-item label="是否周末布防" class="dialog-form-item" >
          <el-checkbox :true-label="1" :false-label="0" v-model="paramsDevicesInfo.is_weekend_enable" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isTimeSettingShow = false">取消</el-button>
        <el-button v-waves :loading="isBtnSetTimeingLoading" type="primary" @click.native="onSettingTimeSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { contains } from '@/utils/tools'
import waves from '@/directive/waves'
import { getDevicesList, deleteDevice, editDevice, addDevice } from '@/api/devices'
import Pagination from '@/components/Pagination'
import { setdevice302output } from '@/api/device302s'
import { setdevice303output, setdeivcei303arming } from '@/api/device303s'
import { setdevice303timing, detaildevice303timing } from '@/api/devicetiming303s'

export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  data() {
    return {
      size: 'mini',
      times: [
        '00:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00', '03:00 - 04:00',
        '04:00 - 05:00', '05:00 - 06:00', '06:00 - 07:00', '07:00 - 08:00',
        '08:00 - 09:00', '09:00 - 10:00', '10:00 - 03:00', '11:00 - 12:00',
        '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
        '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00',
        '20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00', '23:00 - 00:00'
      ],
      timesTag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      isBtnSetTimeingLoading: false,
      issetoutputLoading: false,
      issetarmingLoading: false,
      isTimeSettingShow: false,
      isEditAllow: false,
      isEdit: false,
      isBtnEditLoading: false,
      dialogVisible: false,
      isDevicesLoadingShow: false,
      paramsGetDevices: {
        project_id: undefined,
        device_type_id: undefined,
        page: 1,
        limit: 20
      },
      total: 0,
      paramsDevicesInfo: {
        project_id: undefined,
        device_id: undefined,
        device_type_id: undefined,
        name: undefined,
        address: undefined,
        label: undefined,
        is_auto_output: 0, // 设置是否联动输出
        is_arming: 0, // 设置是否布防
        timing_time: [], // 定时时间
        is_weekend_enable: 0 // 周末使能
      },
      tempFilterOptions: {
        device_id: undefined,
        address: undefined
      },
      devicesInfoList: [],
      multipleSelection: [],
      devicesInfoRules: {
        device_id: { required: true, trigger: 'blur', message: '填写设备ID' },
        label: { required: true, trigger: 'blur', message: '请输入设备描述' },
        address: { required: true, trigger: 'blur', message: '请输入设备地址' },
        name: { required: true, trigger: 'blur', message: '请输入设备名称' }
      }
    }
  },

  computed: {
    ...mapGetters(['selected_project_id', 'roles'])
  },

  created() {
    this.isEditAllow = contains('10062', this.roles)
    this.getDevicesList()
    if (this.$route.meta.roles) this.paramsDevicesInfo.device_type_id = this.$route.meta.roles[0]
  },
  methods: {
    setInt() {
      let result = 0
      for (let i = 0; i < this.timesTag.length; i++) {
        result = result + (this.timesTag[i] << i)
      }
      return result
    },
    getInt(result) {
      for (let i = 0; i < this.timesTag.length; i++) {
        this.timesTag[i] = (result >> i) & 1
      }
    },

    onSettingTimeSubmit() {
      this.isBtnSetTimeingLoading = true
      setdevice303timing({
        project_id: this.selected_project_id,
        device_id: this.paramsDevicesInfo.device_id,
        timing_time: this.setInt(),
        is_weekend_enable: this.paramsDevicesInfo.is_weekend_enable
      }).then(() => {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        this.isBtnSetTimeingLoading = false
        this.isTimeSettingShow = false
      }).catch(() => {
        this.isBtnSetTimeingLoading = false
      })
    },
    timingChange() {
      console.log(this.setInt())
    },
    outputChange(val) {
      const params = {
        project_id: this.selected_project_id,
        device_id: this.paramsDevicesInfo.device_id,
        is_auto_output: val
      }
      this.issetoutputLoading = true
      if (this.paramsDevicesInfo.device_type_id === '302') {
        setdevice302output(params).then(() => {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.getDevicesList()
          this.issetoutputLoading = false
        }).catch(() => {
          this.issetoutputLoading = false
        })
      } else {
        setdevice303output(params).then(() => {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.getDevicesList()
          this.issetoutputLoading = false
        }).catch(() => {
          this.issetoutputLoading = false
        })
      }
    },
    alarmChange(val) {
      this.issetarmingLoading = true
      const params = {
        project_id: this.selected_project_id,
        device_id: this.paramsDevicesInfo.device_id,
        is_arming: val
      }
      setdeivcei303arming(params).then(() => {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        this.getDevicesList()
        this.issetarmingLoading = false
      }).catch(() => {
        this.issetarmingLoading = false
      })
    },
    setTime() {
      this.isTimeSettingShow = true
    },
    openDialog() {
      this.isEdit = false
      this.dialogVisible = true
    },
    onEdit(info) {
      if (this.paramsDevicesInfo.device_type_id === '303') {
        detaildevice303timing({
          project_id: this.selected_project_id,
          device_id: info.device_id,
          is_arming: info.is_arming
        }).then(res => {
          this.getInt(res.data.timing_time)
          this.paramsDevicesInfo.timing_time = this.timesTag
          this.paramsDevicesInfo.is_weekend_enable = res.data.is_weekend_enable
          this.dialogVisible = true
        })
      }

      this.isEdit = true
      this.paramsDevicesInfo.device_id = info.device_id
      this.paramsDevicesInfo.label = info.label
      this.paramsDevicesInfo.name = info.name
      this.paramsDevicesInfo.address = info.address
      this.paramsDevicesInfo.is_arming = info.is_arming
      // this.paramsDevicesInfo.is_weekend_enable = info.is_weekend_enable
      // this.paramsDevicesInfo.timing_time = info.timing_time
      this.paramsDevicesInfo.is_auto_output = info.is_auto_output
      this.dialogVisible = true
    },

    onDelete() {
      this.$confirm('确认删除选中的设备吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const deleteParam = {
          device_id_list: this.multipleSelection.map(item => item.device_id),
          project_id: this.selected_project_id,
          device_type_id: this.$route.meta.roles[0]
        }
        deleteDevice(deleteParam).then(() => {
          this.getDevicesList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    closeDialog() {
      this.init()
      if (this.isEdit) {
        this.paramsDevicesInfo.device_id = undefined
      }
      if (this.$refs.formDevices !== undefined) this.$refs.formDevices.resetFields()
      this.dialogVisible = false
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    init() {
      this.paramsDevicesInfo.device_id = undefined
      this.paramsDevicesInfo.label = undefined
      this.paramsDevicesInfo.name = undefined
      this.paramsDevicesInfo.address = undefined
    },
    onSubmit() {
      this.$refs.formDevices.validate(valid => {
        if (valid) {
          let param = {}
          if (this.isEdit) {
            param = {
              project_id: this.selected_project_id,
              device_type_id: this.paramsDevicesInfo.device_type_id,
              device_id: this.paramsDevicesInfo.device_id,
              label: this.paramsDevicesInfo.label,
              address: this.paramsDevicesInfo.address,
              name: this.paramsDevicesInfo.name
            }
            editDevice(param).then(() => {
              this.$message({ type: 'success', message: '编辑成功' })
              this.init()
              this.dialogVisible = false
              this.getDevicesList()
            })
          } else {
            param = {
              project_id: this.selected_project_id,
              device_id: this.paramsDevicesInfo.device_id,
              device_type_id: this.paramsDevicesInfo.device_type_id,
              label: this.paramsDevicesInfo.label,
              address: this.paramsDevicesInfo.address,
              name: this.paramsDevicesInfo.name
            }
            addDevice(param).then(() => {
              this.$message({ type: 'success', message: '新建成功' })
              this.dialogVisible = false
              this.getDevicesList()
            })
          }
        }
      })
    },
    getDevicesList() {
      this.paramsGetDevices.project_id = this.selected_project_id
      this.paramsGetDevices.device_type_id = this.$route.meta.roles[0]
      this.isDevicesLoadingShow = true
      getDevicesList(this.paramsGetDevices).then(res => {
        this.total = res.data.total
        this.devicesInfoList = res.data.items
        this.isDevicesLoadingShow = false
      }).catch(() => {
        this.isDevicesLoadingShow = false
      })
    }
  }
}
</script>

<style>

</style>
