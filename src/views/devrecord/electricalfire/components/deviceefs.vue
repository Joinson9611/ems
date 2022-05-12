<template>
  <div class="app-container">
    <div class="infoList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            基本信息（电气火灾模块）
          </div>
        </div>
        <el-form label-width="140px">
          <div class="infoItem">
            <el-form-item label="设备 ID：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.device_id || '/' }}</span>
            </el-form-item>
            <el-form-item label="设备名称：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.name || '/' }}</span>
            </el-form-item>
            <el-form-item label="设备地址：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.address || '/' }}</span>
            </el-form-item>
            <el-form-item label="信号强度(dBm)：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.signal_value }}</span>
            </el-form-item>
          </div>
          <!-- <div class="infoItem">
            <el-form-item label="温度1值(℃)：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.t1_value }}</span>
            </el-form-item>
            <el-form-item label="温度2值(℃)：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.t2_value }}</span>
            </el-form-item>
            <el-form-item label="温度3值(℃)：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.t3_value }}</span>
            </el-form-item>
            <el-form-item label="温度4值(℃)：" class="item-container">
              <span class="item-text">{{ efsDeviceInfo.t4_value }}</span>
            </el-form-item>
          </div> -->
          <div class="infoItem">
            <el-form-item label="温度1状态：" class="item-container">
              <span :style="{color:tColor[efsDeviceInfo.t1_state]}" class="item-text">{{ tStateMap[efsDeviceInfo.t1_state] }}</span>
            </el-form-item>
            <el-form-item label="温度2状态：" class="item-container">
              <span :style="{color:tColor[efsDeviceInfo.t2_state]}" class="item-text">{{ tStateMap[efsDeviceInfo.t2_state] }}</span>
            </el-form-item>
            <el-form-item label="温度3状态：" class="item-container">
              <span :style="{color:tColor[efsDeviceInfo.t3_state]}" class="item-text">{{ tStateMap[efsDeviceInfo.t3_state] }}</span>
            </el-form-item>
            <el-form-item label="温度4状态：" class="item-container">
              <span :style="{color:tColor[efsDeviceInfo.t4_state]}" class="item-text">{{ tStateMap[efsDeviceInfo.t4_state] }}</span>
            </el-form-item>
          </div>
          <div class="infoItem">
            <el-form-item label="在线状态：" class="item-container">
              <span :style="{color: efsDeviceInfo.online_state !== 0 ? '#67C23A' : '#F56C6C'}" class="item-text">{{ efsDeviceInfo.online_state !== 0 ? '在线' : '离线' }}</span>
            </el-form-item>
            <el-form-item label="漏电流状态：" class="item-container">
              <span :style="{color:tColor[efsDeviceInfo.c_state]}" class="item-text">{{ tStateMap[efsDeviceInfo.c_state] }}</span>
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
        <deviceefsRecord :device_id="$route.query.id"/>
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
// import { getSmokeInfo } from '@/api/historynb'
import { getNowFormatDate } from '@/utils/time.js'
import { mapGetters } from 'vuex'
import deviceefsRecord from './deviceefsRecord'

export default {
  components: {
    Pagination,
    deviceefsRecord
  },

  data() {
    return {
      chartData: {
        lower_limit: [],
        top_limit: [],
        s_time: undefined,
        xData: [],
        yData: []
      },
      tStateMap: ['正常', '未使用', '开路故障', '短路故障', '报警'],
      tColor: ['#67C23A', '#909399', '#E6A23C', '#E6A23C', '#F56C6C'],
      efsDeviceInfo: {
        'device_id': undefined,
        'device_type_id': undefined,
        'device_type': undefined,
        'device_label': undefined,
        'signal_value': undefined,
        'online_state': undefined,
        'c_value': undefined,			// 漏电流值
        't1_value': undefined,				// 温度1值
        't2_value': undefined,				// 温度2值
        't3_value': undefined,			// 温度3值
        't4_value': undefined,			// 温度4值
        'c_state': undefined,
        't1_state': undefined,
        't2_state': undefined,
        't3_state': undefined,
        't4_state': undefined
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
      if (state === 61) {
        return '#E6A23C'
      } else {
        return '#67C23A'
      }
    },
    getAlarmColor(state) {
      if ([51].includes(state)) {
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
      getDevInfoForIot({ project_id: this.selected_project_id, device_id: this.$route.query.id * 1, device_type_id: this.$route.query.device_type_id }).then(res => {
        this.efsDeviceInfo = res.data
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
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
    .infoList {
      margin-bottom: 5px;
      /deep/.el-form {
        flex: 1;
        display: flex;
        flex-direction: row;
        .infoItem {
          flex: 1;
        }
      }
      /deep/.el-card__body {
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /deep/.el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
      // /deep/.el-form-item__label {
      //   width: 280px;
      //   text-align: right;
      //   padding: 0;
      // }
      // /deep/.el-form-item__content{
      //   margin-left: 280px;
      // }
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
