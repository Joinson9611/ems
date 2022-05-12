<template>
  <div class="app-container">
    <div class="graph">
      <div class="item">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              在线统计
            </div>
          </div>
          <onlineChart :chart-data="online_state" />
        </el-card>
      </div>
      <div class="item">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              报警统计
            </div>
          </div>
          <alarmChart :chart-data="alarm_state" />
        </el-card>
      </div>
    </div>
    <div class="deviceList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            设备列表
          </div>
        </div>
        <div class="list">
          <div class="filter-container">
            <!--任务列表-->
            <el-table
              v-loading="isLoading"
              :data="deviceInfoList"
              element-loading-text="Loading"
              style="width: 100%;"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDeviceCameras.page - 1) * paramsGetDeviceCameras.limit + 1 }} </span></template>
              </el-table-column>
              <el-table-column label="设备ID" align="center" >
                <template slot-scope="scope">
                  <a style="color: #409EFF" @click="toPageDetail(scope.row.device_id)"><i>{{ scope.row.device_id }}</i></a>
                </template>
              </el-table-column>
              <el-table-column label="设备地址" align="center" >
                <template slot-scope="scope">
                  <span>{{ scope.row.label }}</span>
                </template>
              </el-table-column>
              <el-table-column label="在线状态" align="center" width="100px" >
                <template slot-scope="scope">
                  <span :style="{color: scope.row.online_state === 31 ? '#67C23A' : '#F56C6C'}">{{ scope.row.online_state === 31 ? '在线' : '离线' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="监测状态" align="center" width="100px" >
                <template slot-scope="scope">
                  <span :style="{color:getAlarmColor(scope.row.alarm_state)}">{{ scope.row.alarm_state | alarm_state }}</span>
                </template>
              </el-table-column>
            </el-table>
            <!--页码导航-->
            <pagination v-show="total>0" :total="total" :page.sync="paramsGetDeviceCameras.page" :limit.sync="paramsGetDeviceCameras.limit" @pagination="getDeviceCameras" />
          </div>
      </div></el-card>
    </div>
  </div>

</template>

<script>
import { getCamerasList2, detailCameras } from '@/api/cameras'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import onlineChart from './components/onlineChart'
import alarmChart from './components/alarmChart'
const alarm_name = ['火警事件', '正常']
const online_name = ['离线', '在线']

export default {
  name: 'Water',
  components: {
    onlineChart,
    alarmChart,
    Pagination
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
      total: 0,
      deviceInfoList: [],
      online_state: [],
      alarm_state: [],
      paramsGetDeviceCameras: {
        project_id: undefined,
        page: 1,
        limit: 10
      },

      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getDeviceCamerasDetail()
    this.getDeviceCameras()
  },
  methods: {
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
    convertData(data, nameList) {
      const temp = []
      for (let i = 0; i < 4; i++) {
        const item = {
          name: nameList[i],
          value: data[i]
        }
        temp.push(item)
      }
      return temp
    },
    toPageDetail(id) {
      this.$router.push({ path: '/iot/cameraDetail', query: { id }})
    },
    getDeviceCameras() {
      this.isLoading = true
      this.paramsGetDeviceCameras.project_id = this.selected_project_id
      getCamerasList2(this.paramsGetDeviceCameras).then(res => {
        this.total = res.data.total
        this.deviceInfoList = res.data.items
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    getDeviceCamerasDetail() {
      detailCameras({ project_id: this.selected_project_id }).then(res => {
        const { online_state, alarm_state } = res.data
        this.alarm_state = this.convertData(alarm_state, alarm_name)
        this.online_state = this.convertData(online_state, online_name)
      }).catch(() => {})
    }
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
    .title {
      float: left;
      color: #409EFF;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
    }
    .graph {
      display: flex;
      flex-direction: row;
      .item {
        flex: 1;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
        /deep/.el-card__body {
          padding: 0;
          height: 250px;
        }
      }
    }
    .deviceList {
      .list {
        padding: 10px;
      }
      flex: 1;
      margin-top: 10px;
      /deep/.el-card__body {
        min-height: 260px;
      }
    }
  }
</style>
