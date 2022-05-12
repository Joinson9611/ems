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
              电量统计
            </div>
          </div>
          <div class="chart-wrapper">
            <div class="half left">
              <div class="chart">
                <batteryChart :chart-data="battery_state" />
              </div>
            </div>
            <div class="half right">
              <div class="data-wrapper">
                <div class="data-item">
                  <div :style="{color: battery_state[0].color}" class="item" >
                    <div class="header">
                      {{ battery_state[0].name }}<span class="percentage">{{ battery_state[0].per }}%</span>
                    </div>
                    <div :style="{color: battery_state[0].color}" class="number">
                      {{ battery_state[0].value }}项
                    </div>
                  </div>
                  <div :style="{color: battery_state[1].color}" class="item" >
                    <div class="header">
                      {{ battery_state[1].name }}<span class="percentage">{{ battery_state[1].per }}%</span>
                    </div>
                    <div :style="{color: battery_state[1].color}" class="number">
                      {{ battery_state[1].value }}项
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
            <div class="half left" style="flex: 1">
              <div class="chart">
                <alarmChart :chart-data="alarm_state" />
              </div>
            </div>
            <div class="half right" style="flex: 1">
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
                  <div :style="{color: alarm_state[2].color}" class="item" >
                    <div class="header">
                      {{ alarm_state[2].name }}<span class="percentage">{{ alarm_state[2].per }}%</span>
                    </div>
                    <div :style="{color: alarm_state[2].color}" class="number">
                      {{ alarm_state[2].value }}项
                    </div>
                  </div>

                </div>
                <div class="data-item">
                  <div :style="{color: alarm_state[1].color}" class="item" >
                    <div class="header">
                      {{ alarm_state[1].name }}<span class="percentage">{{ alarm_state[1].per }}%</span>
                    </div>
                    <div :style="{color: alarm_state[1].color}" class="number">
                      {{ alarm_state[1].value }}项
                    </div>
                  </div>
                  <div class="item" />
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="deviceList">
      <!-- <div slot="header" class="clearfix">
          <div class="title">
            设备列表
          </div>
        </div> -->
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
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDevicewaters.page - 1) * paramsGetDevicewaters.limit + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="设备ID" width="220">
            <template slot-scope="scope">
              <a class="skip" @click="toPageDetail(scope.row.device_id)"><i>{{ scope.row.device_id }}</i></a>
            </template>
          </el-table-column>
          <!-- <el-table-column label="设备名称" align="center" >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column> -->
          <el-table-column label="设备地址" >
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电量" align="center" width="76px">
            <template slot-scope="scope">
              <span :style="batteryColor(scope.row.battery_value)">{{ scope.row.battery_value }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="信号强度" align="center" width="76px">
            <template slot-scope="scope">
              <span>{{ scope.row.signal_value }}</span>
            </template>
          </el-table-column>
          <el-table-column label="在线状态" align="center" width="76px" >
            <template slot-scope="scope">
              <span :style="{color: scope.row.online_state === 1 ? '#67C23A' : '#F56C6C'}">{{ scope.row.online_state === 1 ? '在线' : '离线' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="监测值" align="center" width="85px" >
            <template slot-scope="scope">
              <span>{{ scope.row.alarm_value }}{{ $route.meta.roles[0] ==='101'?'m':'MPa' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报警状态" align="center" width="76px" >
            <template slot-scope="scope">
              <span :style="{color:getAlarmColor(scope.row.alarm_state )}">{{ alarmMap[scope.row.alarm_state] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--页码导航-->
        <pagination v-show="total>0" :total="total" :page.sync="paramsGetDevicewaters.page" :limit.sync="paramsGetDevicewaters.limit" @pagination="getDevicewaters" />
      </div>

    </div>
  </div>

</template>

<script>
import { getDevList2ForIot, getDevicesDetail } from '@/api/devices'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import onlineChart from './onlineChart'
import alarmChart from './wateralarmChart'
import batteryChart from './batteryChart'
// const alarm_name = ['过高', '过低', '正常']
// const online_name = ['离线', '在线']
// const battery_name = ['电量过低', '正常']

export default {
  name: 'Somke',
  components: {
    onlineChart,
    alarmChart,
    batteryChart,
    Pagination
  },

  data() {
    return {
      total: 0,
      deviceTypeOptions: [],
      deviceInfoList: [],
      alarm_state: [
        { name: '过高', value: 0, per: 0, color: '#ea263d' },
        { name: '过低', value: 0, per: 0, color: '#f29600' },
        { name: '正常', value: 0, per: 0, color: '#28ce9f' }
      ],
      battery_state: [
        { name: '电量过低', value: 0, per: 0, color: '#f29600' },
        { name: '正常', value: 0, per: 0, color: '#28ce9f' }
      ],
      online_state: [
        { name: '离线', value: 0, per: 0, color: '#232323' },
        { name: '在线', value: 0, per: 0, color: '#28ce9f' }
      ],
      alarmMap: ['正常', '过高', '过低'],
      alarmOptions: [{ id: 0, type: '正常' }, { id: 1, type: '过高' }, { id: 2, type: '过低' }],
      onlineOptions: [{ id: 0, type: '离线' }, { id: 1, type: '在线' }],
      tempFilterOptions: {
        device_id: undefined,
        address: undefined,
        online_state: undefined,
        alarm_state: undefined
      },
      paramsGetDevicewaters: {
        project_id: undefined,
        device_type_id: this.$route.meta.roles[0],
        page: 1,
        limit: 10,
        device_id: undefined,
        address: undefined,
        online_state: undefined,
        alarm_state: undefined
      },
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getDevicesDetail()
    this.getDevicewaters()
  },
  methods: {
    onSearch() {
      this.paramsGetDevicewaters.page = 1
      this.paramsGetDevicewaters.device_id = this.tempFilterOptions.device_id
      this.paramsGetDevicewaters.address = this.tempFilterOptions.address
      this.paramsGetDevicewaters.online_state = (this.tempFilterOptions.online_state || this.tempFilterOptions.online_state === 0) ? this.tempFilterOptions.online_state : undefined
      this.paramsGetDevicewaters.alarm_state = (this.tempFilterOptions.alarm_state || this.tempFilterOptions.alarm_state === 0) ? this.tempFilterOptions.alarm_state : undefined
      this.getDevicewaters()
    },
    getAlarmColor(state) {
      if (state === 0) {
        return '#67C23A'
      } else if (state === 1) {
        return '#F56C6C'
      } else {
        return '#F56C6C'
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
      this.$router.push({ path: '/devrecord/waterDetail', query: { id, device_type_id: this.$route.meta.roles[0] }})
    },

    deviceChange(id) {
      this.paramsGetDevicewaters.device_id = id === '' ? undefined : id
      // this.getDevicewaters()
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
    getDevicewaters() {
      this.isLoading = true
      this.paramsGetDevicewaters.project_id = this.selected_project_id
      getDevList2ForIot(this.paramsGetDevicewaters).then(res => {
        this.total = res.data.total
        this.deviceInfoList = res.data.items
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    getDevicesDetail() {
      getDevicesDetail({ project_id: this.selected_project_id, device_type_id: this.$route.meta.roles[0] }).then(res => {
        const { online_state, alarm_state, battery_state } = res.data
        const alarmTotal = alarm_state[0] + alarm_state[1] + alarm_state[2]
        this.alarm_state[0].per = this.getPercentage(alarm_state[0], alarmTotal)
        this.alarm_state[1].per = this.getPercentage(alarm_state[1], alarmTotal)
        this.alarm_state[2].per = this.getPercentage(alarm_state[2], alarmTotal)
        this.alarm_state[0].value = alarm_state[0]
        this.alarm_state[1].value = alarm_state[1]
        this.alarm_state[2].value = alarm_state[2]
        const onlineTotal = online_state[0] + online_state[1]
        this.online_state[0].per = this.getPercentage(online_state[0], onlineTotal)
        this.online_state[1].per = this.getPercentage(online_state[1], onlineTotal)
        this.online_state[0].value = online_state[0]
        this.online_state[1].value = online_state[1]
        const batteryTotal = battery_state[0] + battery_state[1]
        this.battery_state[0].per = this.getPercentage(battery_state[0], batteryTotal)
        this.battery_state[1].per = this.getPercentage(battery_state[1], batteryTotal)
        this.battery_state[0].value = battery_state[0]
        this.battery_state[1].value = battery_state[1]
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../styles/devicerecord.scss";
</style>
