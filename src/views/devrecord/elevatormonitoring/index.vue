<template>
  <div class="app-container">
    <div class="graph">
      <div class="graph-item">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              在线统计
            </div>
          </div>
          <!-- <onlineChart :chart-data="online_state" /> -->
          <div class="chart-wrapper">
            <div class="half left">
              <div class="chart">
                <onlineChart :chart-data="online_state" />
              </div>
            </div>
            <div class="half right">
              <div class="data-wrapper">
                <div class="data-item">
                  <div :style="{color: online_state[0].color}" class="item" >
                    <div class="header">
                      {{ online_state[0].name }}<span class="percentage">{{ online_state[0].per }}%</span>
                    </div>
                    <div :style="{color: online_state[0].color}" class="number">
                      {{ online_state[0].value }}项
                    </div>
                  </div>
                  <div :style="{color: online_state[1].color}" class="item" >
                    <div class="header">
                      {{ online_state[1].name }}<span class="percentage">{{ online_state[1].per }}%</span>
                    </div>
                    <div :style="{color: online_state[1].color}" class="number">
                      {{ online_state[1].value }}项
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="graph-item">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              报警统计
            </div>
          </div>
          <div class="chart-wrapper">
            <div class="half left">
              <div class="chart">
                <alarmChart :chart-data="alarm_state" />
              </div>
            </div>
            <div class="half right">
              <div class="data-wrapper">
                <div class="data-item">
                  <div :style="{color: alarm_state[0].color}" class="item" >
                    <div class="header">
                      {{ alarm_state[0].name }}<span class="percentage">{{ alarm_state[0].per }}%</span>
                    </div>
                    <div :style="{color: alarm_state[0].color}" class="number">
                      {{ alarm_state[0].value }}项
                    </div>
                  </div>
                  <div :style="{color: alarm_state[1].color}" class="item" >
                    <div class="header">
                      {{ alarm_state[1].name }}<span class="percentage">{{ alarm_state[1].per }}%</span>
                    </div>
                    <div :style="{color: alarm_state[1].color}" class="number">
                      {{ alarm_state[1].value }}项
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="deviceList">
      <div class="list">
        <div class="filter-container">
          <el-input v-model="tempFilterOptions.device_id" size="mini" placeholder="请输入设备ID" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
          <el-input v-model="tempFilterOptions.address" size="mini" placeholder="请输入设备地址" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
          <el-select v-model="tempFilterOptions.online_state" size="mini" placeholder="在线状态" style="width: 120px" class="filter-item" clearable >
            <el-option v-for="item in onlineOptions" :key="item.id" :label="item.type" :value="item.id"/>
          </el-select>
          <el-select v-model="tempFilterOptions.alarm_state" size="mini" placeholder="报警状态" style="width: 120px" class="filter-item" clearable >
            <el-option v-for="item in alarmOptions" :key="item.id" :label="item.type" :value="item.id"/>
          </el-select>
          <el-button size="mini" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        </div>
        <!--任务列表-->
        <el-table
          v-loading="isLoading"
          :data="deviceInfoList"
          element-loading-text="Loading"
          style="width: 100%;"
          fit
          highlight-current-row
        >
          <el-table-column label="序号" align="center" width="70">
            <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDeviceCameras.page - 1) * paramsGetDeviceCameras.limit + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="设备ID" width="220">
            <template slot-scope="scope">
              <a style="color: #409EFF" @click="toPageDetail(scope.row.device_id)"><i>{{ scope.row.device_id }}</i></a>
            </template>
          </el-table-column>

          <el-table-column label="设备地址" >
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="在线状态" align="center" width="76px" >
            <template slot-scope="scope">
              <span :style="{color: scope.row.online_state === 1 ? '#67C23A' : '#F56C6C'}">{{ scope.row.online_state === 1 ? '在线' : '离线' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警状态" align="center" width="76px" >
            <template slot-scope="scope">
              <span :style="{color:getAlarmColor(scope.row.alarm_state)}">{{ scope.row.alarm_state | alarm_state }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--页码导航-->
        <pagination v-show="total>0" :total="total" :page.sync="paramsGetDeviceCameras.page" :limit.sync="paramsGetDeviceCameras.limit" @pagination="getDeviceCameras" />
      </div>
    </div>
  </div>
</template>

<script>
import { getDevList2ForIot, getDevicesDetail } from '@/api/devices'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import onlineChart from '../components/onlineChart'
import alarmChart from '../components/alarmChart'

export default {
  name: 'Water',
  components: {
    onlineChart,
    alarmChart,
    Pagination
  },
  filters: {
    alarm_state(state) {
      switch (state) {
        case 0:
          return '正常'
        case 1:
          return '报警'
        case 10:
          return '故障'
      }
    }
  },
  data() {
    return {
      total: 0,
      deviceInfoList: [],
      alarm_state: [
        { name: '报警', value: 0, per: 0, color: '#ea263d' },
        { name: '正常', value: 0, per: 0, color: '#28ce9f' }
      ],

      online_state: [
        { name: '离线', value: 0, per: 0, color: '#232323' },
        { name: '在线', value: 0, per: 0, color: '#28ce9f' }
      ],
      alarmOptions: [{ id: 0, type: '正常' }, { id: 1, type: '报警' }, { id: 10, type: '故障' }],
      onlineOptions: [{ id: 0, type: '离线' }, { id: 1, type: '在线' }],
      tempFilterOptions: {
        device_id: undefined,
        address: undefined,
        online_state: undefined,
        alarm_state: undefined
      },
      paramsGetDeviceCameras: {
        project_id: undefined,
        page: 1,
        limit: 10,
        device_type_id: this.$route.meta.roles[0],
        online_state: undefined,
        alarm_state: undefined,
        device_id: undefined
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
    onSearch() {
      this.paramsGetDeviceCameras.page = 1
      this.paramsGetDeviceCameras.device_id = this.tempFilterOptions.device_id
      this.paramsGetDeviceCameras.address = this.tempFilterOptions.address
      this.paramsGetDeviceCameras.online_state = (this.tempFilterOptions.online_state || this.tempFilterOptions.online_state === 0) ? this.tempFilterOptions.online_state : undefined
      this.paramsGetDeviceCameras.alarm_state = (this.tempFilterOptions.alarm_state || this.tempFilterOptions.alarm_state === 0) ? this.tempFilterOptions.alarm_state : undefined
      this.getDeviceCameras()
    },

    getAlarmColor(state) {
      switch (state) {
        case 0:
          return '#67C23A'
        case 1:
          return '#F56C6C'
        case 10:
          return '#E6A23C'
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
      this.$router.push({ path: '/devrecord/elemonDetail', query: { id, device_type_id: this.$route.meta.roles[0] }})
    },
    getDeviceCameras() {
      this.isLoading = true
      this.paramsGetDeviceCameras.project_id = this.selected_project_id
      getDevList2ForIot(this.paramsGetDeviceCameras).then(res => {
        this.total = res.data.total
        this.deviceInfoList = res.data.items
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    getPercentage(num, total) {
      if (total === 0) {
        return 0
      } else {
        const per = num / total
        if ([0, 1].includes(per)) {
          return per * 100
        } else {
          return (per * 100).toFixed(2)
        }
      }
    },
    getDeviceCamerasDetail() {
      getDevicesDetail({ project_id: this.selected_project_id, device_type_id: this.$route.meta.roles[0] }).then(res => {
        const { online_state, alarm_state } = res.data
        const alarmTotal = alarm_state[0] + alarm_state[1]
        this.alarm_state[0].per = this.getPercentage(alarm_state[0], alarmTotal)
        this.alarm_state[1].per = this.getPercentage(alarm_state[1], alarmTotal)
        this.alarm_state[0].value = alarm_state[0]
        this.alarm_state[1].value = alarm_state[1]
        const onlineTotal = online_state[0] + online_state[1]
        this.online_state[0].per = this.getPercentage(online_state[0], onlineTotal)
        this.online_state[1].per = this.getPercentage(online_state[1], onlineTotal)
        this.online_state[0].value = online_state[0]
        this.online_state[1].value = online_state[1]
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/devicerecord.scss";
</style>
