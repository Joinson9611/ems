<template>
  <div class="app-container">
    <div class="infoList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            基本信息(红外双鉴探测器)
          </div>
        </div>
        <el-form label-width="90px">
          <el-form-item label="设备 ID：" class="item-container">
            <span class="item-text">{{ cameraDeviceInfo.device_id }}</span>
          </el-form-item>
          <el-form-item label="地址：" class="item-container">
            <span class="item-text">{{ cameraDeviceInfo.address || '/' }}</span>
          </el-form-item>
          <el-form-item label="在线状态：" class="item-container">
            <span :style="{color: cameraDeviceInfo.online_state === 1 ? '#67C23A' : '#F56C6C'}" class="item-text">{{ cameraDeviceInfo.online_state === 1 ? '在线' : '离线' }}</span>
          </el-form-item>
          <el-form-item label="报警状态：" class="item-container">
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
import { getDevInfoForIot } from '@/api/devices'
// import { getSmokeInfo } from '@/api/historynb'
import { mapGetters } from 'vuex'
import devicecameraRecord from './record'

export default {
  components: {
    Pagination,
    devicecameraRecord
  },
  filters: {
    alarm_state(state) {
      if ([1].includes(state)) {
        return '报警'
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
      if ([1].includes(state)) {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    },
    getCameraDeviceInfo() {
      getDevInfoForIot({
        project_id: this.selected_project_id,
        device_id: this.$route.query.id,
        device_type_id: this.$route.query.device_type_id
      }).then(res => {
        this.cameraDeviceInfo = res.data
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
    /deep/.el-form-item {
      margin-bottom: 0;
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
