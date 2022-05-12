<template>
  <div class="app-container">
    <div class="infoList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            基本信息
          </div>
        </div>
        <el-form label-width="90px">
          <el-form-item label="设备 ID：" class="item-container">
            <span class="item-text">{{ cameraDeviceInfo.device_id }}</span>
          </el-form-item>
          <el-form-item label="地址：" class="item-container">
            <span class="item-text">{{ cameraDeviceInfo.label || '/' }}</span>
          </el-form-item>
          <el-form-item label="在线状态：" class="item-container">
            <span :style="{color: cameraDeviceInfo.online_state === 31 ? '#67C23A' : '#F56C6C'}" class="item-text">{{ cameraDeviceInfo.online_state === 31 ? '在线' : '离线' }}</span>
          </el-form-item>
          <el-form-item label="监测状态：" class="item-container">
            <span :style="{color:getAlarmColor(cameraDeviceInfo.alarm_state)}" class="item-text">{{ cameraDeviceInfo.alarm_state | alarm_state }}</span>
          </el-form-item>
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
        <devicecameraRecord :device_id="$route.query.id"/>
      </el-card>
    </div>
    <div class="back">
      <el-button round @click="$router.go(-1)">返回前页</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { camerasInfo } from '@/api/cameras'
// import { getSmokeInfo } from '@/api/historynb'
import { mapGetters } from 'vuex'
import devicecameraRecord from './devicecameraRecord'

export default {
  components: {
    Pagination,
    devicecameraRecord
  },
  filters: {
    alarm_state(state) {
      if ([51].includes(state)) {
        return '火警事件'
      } else {
        return '正常'
      }
    }
  },
  data() {
    return {
      cameraDeviceInfo: {
        'device_id': undefined,
        'label': undefined,
        'online_state': undefined,			// 31=在线、其他=离线
        'alarm_state': undefined
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getCameraDeviceInfo()
  },
  methods: {
    getAlarmColor(state) {
      if ([51].includes(state)) {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    },
    getCameraDeviceInfo() {
      camerasInfo({ project_id: this.selected_project_id, device_id: this.$route.query.id }).then(res => {
        this.cameraDeviceInfo = res.data
      }).catch(() => {})
    }
    // timeChange(time) {
    //   this.paramsGetGraph.s_time = FormatDateTime(time)
    //   this.getWaterDeviceGraph()
    // }
    // getWaterDeviceGraph() {
    //   this.paramsGetGraph.project_id = this.selected_project_id
    //   this.paramsGetGraph.device_id = this.$route.query.id
    //   this.chartData.xData = []
    //   this.chartData.yData = []
    //   this.chartData.lower_limit = []
    //   this.chartData.top_limit = []
    //   getWaterDeviceGraph(this.paramsGetGraph).then(res => {
    //     const value_list = res.data.chart.value_list
    //     this.chartData.s_time = res.data.chart.s_time
    //     for (let i = 0; i < value_list.length; i++) {
    //       this.chartData.xData.push(FormatDate(value_list[i].alarm_time, 'day'))
    //       this.chartData.yData.push(value_list[i].value)
    //       this.chartData.lower_limit.push(res.data.chart.lower_limit)
    //       this.chartData.top_limit.push(res.data.chart.top_limit)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
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
    /deep/.el-form-item {
      margin-bottom: 0;
    }
    .title {
      float: left;
      color: #409EFF;
      line-height: 28px;
      font-size: 20px;
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
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/.el-form {
          display: flex;
          justify-content: space-around;
          align-items: center;
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
