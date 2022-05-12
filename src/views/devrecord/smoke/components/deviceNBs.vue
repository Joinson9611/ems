<template>
  <div class="app-container">
    <div class="infoList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            基本信息（无线烟感）
          </div>
        </div>
        <el-form label-width="90px">
          <div class="infoItem">
            <el-form-item label="设备 ID：" class="item-container">
              <span class="item-text">{{ nbDeviceInfo.device_id }}</span>
            </el-form-item>
            <el-form-item label="设备名称：" class="item-container">
              <span class="item-text">{{ nbDeviceInfo.name || '/' }}</span>
            </el-form-item>
            <el-form-item label="设备地址：" class="item-container">
              <span class="item-text">{{ nbDeviceInfo.address || '/' }}</span>
            </el-form-item>
          </div>
          <div class="infoItem">
            <el-form-item label="信号强度：" class="item-container">
              <span class="item-text">{{ nbDeviceInfo.signal_value }}dBm</span>
            </el-form-item>
            <el-form-item label="在线状态：" class="item-container">
              <span :style="{color: nbDeviceInfo.online_state === 1 ? '#67C23A' : '#F56C6C'}" class="item-text">{{ nbDeviceInfo.online_state === 1 ? '在线' : '离线' }}</span>
            </el-form-item>
            <el-form-item label="电量：" class="item-container">
              <span :style="batteryColor(nbDeviceInfo.battery_value)" class="item-text">{{ nbDeviceInfo.battery_value }}%</span>
            </el-form-item>
          </div>
          <div class="infoItem">
            <el-form-item label="报警状态：" class="item-container">
              <span :style="{color:getAlarmColor(nbDeviceInfo.alarm_state)}" class="item-text">{{ nbDeviceInfo.alarm_state | alarm_state }}</span>
            </el-form-item>
            <el-form-item label="烟雾浓度：" class="item-container">
              <span class="item-text">{{ nbDeviceInfo.alarm_value }}</span>
            </el-form-item>
            <el-form-item label="防拆状态：" class="item-container">
              <span :style="{color:getTamperColor(nbDeviceInfo.tamper_state)}" class="item-text">{{ nbDeviceInfo.tamper_state | tamper_state }}</span>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <div class="recordList">
      <el-card class="box-card" shadow="never" style="min-height: 350px;">
        <div slot="header" class="clearfix">
          <div class="title">
            报警记录
          </div>
        </div>
        <deviceNBRecord :device_id="$route.query.id"/>
      </el-card>
    </div>
    <div class="back">
      <el-button round @click="$router.go(-1)">返回前页</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getDevInfoForIot } from '@/api/devices'
import { getNowFormatDate } from '@/utils/time.js'
import { mapGetters } from 'vuex'
import deviceNBRecord from './deviceNBRecord'

export default {
  components: {
    Pagination,
    deviceNBRecord
  },
  filters: {
    alarm_state(state) {
      if ([1].includes(state)) {
        return '火警事件'
      } else {
        return '正常'
      }
    },
    tamper_state(state) {
      if (state === 1) {
        return '防拆报警'
      } else {
        return '正常'
      }
    }
  },
  data() {
    return {
      nbDeviceInfo: {
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
        s_time: getNowFormatDate()
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getNBDeviceInfo()
  },
  methods: {
    getTamperColor(state) {
      if (state === 1) {
        return '#E6A23C'
      } else {
        return '#67C23A'
      }
    },
    getAlarmColor(state) {
      if ([1].includes(state)) {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
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
    getNBDeviceInfo() {
      getDevInfoForIot({ project_id: this.selected_project_id, device_id: this.$route.query.id, device_type_id: this.$route.query.device_type_id }).then(res => {
        this.nbDeviceInfo = res.data
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/devicerecord.scss";
  .app-container {
    /deep/.el-card__header {
      padding: 10px 14px;
    }
    min-height: calc(100vh - 50px);
    padding: 10px;
    background-color: rgb(240, 242, 245);
    display: flex;
    flex-direction: column;
    /deep/.el-card__body {
      padding: 10px;
    }
    .title {
      float: left;
      color: $themeColor;
      line-height: 28px;
      font-size: 16px;
      font-weight: 500;
    }
    .filter {
      float:right
    }
    .infoList {
      margin-bottom: 5px;
      /deep/.el-form {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      /deep/.el-card__body {
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /deep/.el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
      // /deep/.el-card__body {
      //   width: 100%;
      // }
      // display: flex;
      // flex-direction: columns;
      // /deep/.el-form-item {
      //   margin: 0;
      // }
    }
    .recordList {
      flex: 1;
    }
    .back {
      position: fixed;
      right: 40px;
      bottom: 40px;
    }

  }
</style>
