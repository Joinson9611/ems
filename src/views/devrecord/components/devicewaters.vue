<template>
  <div class="app-container">
    <div class="header">
      <div class="info">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              基本信息{{ `（${$route.query.device_type_id === '101' ? '水位' : '水压'}监测模块）` }}
            </div>
          </div>
          <el-form label-width="120px">
            <el-form-item label="设备ID：" class="item-container">
              <span class="item-text">{{ waterDeviceInfo.device_id }}</span>
            </el-form-item>

            <el-form-item label="设备地点：" class="item-container">
              <el-tooltip :content="waterDeviceInfo.device_label" class="item" effect="dark" placement="top-start">
                <span class="item-text">{{ waterDeviceInfo.address || '/' }}</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item class="item-container" label="电量：">
              <span :style="batteryColor(waterDeviceInfo.battery_value)" class="item-text"><span> {{ waterDeviceInfo.battery_value }}</span>%</span>
            </el-form-item>
            <el-form-item label="信号强度(dBm)：" class="item-container">
              <span class="item-text"><span> {{ waterDeviceInfo.signal_value }}</span></span>
            </el-form-item>
            <el-form-item label="在线状态：" class="item-container">
              <span :style="{color: waterDeviceInfo.online_state === 1 ? '#67C23A' : '#F56C6C'}" class="item-text">{{ waterDeviceInfo.online_state === 1 ? '在线' : '离线' }}</span>
            </el-form-item>
            <el-form-item label="监测值：" class="item-container">
              <span class="item-text">{{ waterDeviceInfo.alarm_value }}{{ $route.query.device_type_id ==='101'?'m':'MPa' }}</span>
            </el-form-item>
            <el-form-item label="报警状态：" class="item-container">
              <span :style="{color:getAlarmColor(waterDeviceInfo.alarm_state)}" class="item-text">{{ alarmMap[waterDeviceInfo.alarm_state] }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="graph" style="margin-left:10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              {{ `${$route.query.device_type_id === '101' ? '水位' : '水压'}监测图（${Formattimestamp2(chartData.s_time)}）` }}
            </div>
            <div class="filter">
              <el-date-picker
                :disabled="isGraphLoading"
                :clearable="false"
                v-model="paramsGetGraph.s_time"
                style="width: 140px"
                value-format="timestamp"
                type="date"
                size="mini"
                placeholder="选择日期"
                @change="timeChange"/>
            </div>
          </div>
          <div
            v-loading="isGraphLoading"
            element-loading-text="正在加载数据..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <waterDeviceChart :chart-data="chartData" :height="'320px'"/>
          </div>
        </el-card>
      </div>
    </div>
    <div class="recordList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            报警记录
          </div>
        </div>
        <deviceWaterRecord :device_type_id="$route.query.device_type_id" :device_id="$route.query.id"/>
      </el-card>
    </div>
    <div class="back">
      <el-button round @click="$router.go(-1)">返回前页</el-button>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import Pagination from '@/components/Pagination'
import deviceWaterRecord from './deviceWaterRecord'
import { getHistoryDetail } from '@/api/historys'
import { getDevInfoForIot } from '@/api/devices'
import { Formattimestamp2, FormatDate, getNowTimestamp } from '@/utils/time.js'
import { mapGetters } from 'vuex'
import waterDeviceChart from './waterDeviceChart'

export default {
  components: {
    SvgIcon,
    Pagination,
    waterDeviceChart,
    deviceWaterRecord
  },
  filters: {
    alarm_state(state) {
      if ([43, 41].includes(state)) {
        return '过高'
      } else if ([42, 44].includes(state)) {
        return '过低'
      } else {
        return '正常'
      }
    }
  },
  data() {
    return {
      isGraphLoading: false,
      alarmMap: ['正常', '过高', '过低'],
      chartData: {
        device_type_id: this.$route.query.device_type_id,
        lower_limit: undefined,
        top_limit: undefined,
        s_time: undefined,
        xData: [],
        yData: []
      },
      graphTime: {
        disabledDate(time) {
          const _now = Date.now()
          return time.getTime() >= _now - 8.64e7
        }
      },
      waterDeviceInfo: {
        device_type_id: this.$route.query.device_type_id,
        device_id: undefined,
        device_type: undefined,
        device_label: undefined,
        signal_value: undefined,
        battery_value: undefined,
        water_value: undefined,
        online_state: undefined,
        alarm_state: undefined
      },
      paramsGetGraph: {
        project_id: undefined,
        device_id: undefined,
        device_type_id: this.$route.query.device_type_id,
        s_time: getNowTimestamp()
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getWaterDeviceInfo()
  },
  methods: {
    getAlarmColor(state) {
      if (state === 0) {
        return '#67C23A'
      } else if (state === 1) {
        return '#F56C6C'
      } else {
        return '#F56C6C'
      }
    },
    Formattimestamp2(time) {
      return Formattimestamp2(time)
    },
    batteryColor(val) {
      const ele = parseInt(val)
      if (ele >= 0 && ele < 20) {
        return { color: '#F56C6C' }
      } else if (ele >= 20 && ele <= 60) {
        return { color: '#E6A23C' }
      } else {
        return { color: '#67C23A' }
      }
    },
    getWaterDeviceInfo() {
      getDevInfoForIot({ project_id: this.selected_project_id, device_id: this.$route.query.id, device_type_id: this.$route.query.device_type_id }).then(res => {
        this.waterDeviceInfo = res.data
        this.getHistoryDetail()
      }).catch(() => {})
    },
    timeChange(time) {
      this.paramsGetGraph.s_time = time
      this.getHistoryDetail()
    },
    getHistoryDetail() {
      this.isGraphLoading = true
      this.paramsGetGraph.device_id = this.$route.query.id
      this.chartData.xData = []
      this.chartData.yData = []
      const params = {
        project_id: this.selected_project_id,
        device_id: this.$route.query.id,
        device_type_id: this.$route.query.device_type_id,
        s_time: parseInt(this.paramsGetGraph.s_time / 1000)
      }
      getHistoryDetail(params).then(res => {
        const value_list = res.data.value_list
        this.chartData.s_time = res.data.s_time * 1
        this.chartData.lower_limit = res.data.lower_limit
        this.chartData.top_limit = res.data.top_limit
        this.chartData.device_type_id = this.$route.query.device_type_id
        for (let i = 0; i < value_list.length; i++) {
          this.chartData.xData.push(FormatDate(value_list[i].update_time, 'day'))
          this.chartData.yData.push(value_list[i].value)
        }
        this.isGraphLoading = false
      }).catch(() => { this.isGraphLoading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
//  @import "~@/styles/devicerecord.scss";
  .app-container {
    /deep/.el-card__header {
      padding: 10px 14px;
      border-bottom: none;
    }
    min-height: calc(100vh - 50px);
    padding: 10px;
    background-color: rgb(240, 242, 245);
    display: flex;
    flex-direction: column;
    /deep/.el-card__body {
      padding: 10px;
    }
    .back {
      position: fixed;
      right: 40px;
      bottom: 40px;
    }
    .title {
      float: left;
      color: #3d44c0;
      line-height: 28px;
      font-size: 16px;
      font-weight: 500;
    }
    .filter {
      float:right
    }
    .header {
      display: flex;
      flex: 0 0 380px;
      margin-bottom: 10px;
      .info {
        word-break: break-word;
        width: 280px;
        flex: 0 0 320px;
        /deep/.el-form-item {
          margin: 0;
        }
        /deep/.el-card__body {
          white-space:nowrap;
          height: 340px;
          /deep/.el-form-item__content {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
        }
      }
      .graph {
        flex: 1
      }
    }
    .recordList {
      flex: 1;
    }
    .item-text {
      line-height: 30px;
      height: 30px;
    }
  }
</style>
