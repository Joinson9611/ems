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
      <!-- <div slot="header" class="clearfix">
          <div class="title">
            设备列表
          </div>
        </div> -->
      <div class="list">
        <div class="filter-container">
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
          <!--任务列表 -->
          <el-table
            v-loading="isLoading"
            :data="deviceInfoList"
            element-loading-text="Loading"
            style="width: 100%;"
            fit
            highlight-current-row
            max-height="285px"
          >
            <el-table-column label="序号" align="center" width="50px">
              <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDeviceNBs.page - 1) * paramsGetDeviceNBs.limit + 1 }} </span></template>
            </el-table-column>
            <el-table-column label="设备ID" width="220px">
              <template slot-scope="scope">
                <a class="skip" @click="toPageDetail(scope.row.device_id)"><i>{{ scope.row.device_id }}</i></a>
              </template>
            </el-table-column>
            <!-- <el-table-column label="设备名称" >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column> -->
            <el-table-column label="设备地址" >
              <template slot-scope="scope">
                <span>{{ scope.row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="电量" align="center" width="60px">
              <template slot-scope="scope">
                <span :style="batteryColor(scope.row.battery_value)">{{ scope.row.battery_value }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="信号强度" align="center" width="80px">
              <template slot-scope="scope">
                <span>{{ scope.row.signal_value }}</span>
              </template>
            </el-table-column>
            <el-table-column label="在线状态" align="center" width="76px" >
              <template slot-scope="scope">
                <span :style="{color: scope.row.online_state === 1 ? '#67C23A' : '#F56C6C'}">{{ scope.row.online_state === 1 ? '在线' : '离线' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="防拆状态" align="center" width="76px" >
              <template slot-scope="scope">
                <span :style="{color: getTamperColor(scope.row.tamper_state)}">{{ scope.row.tamper_state | tamper_state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="烟雾浓度" align="center" width="76px" >
              <template slot-scope="scope">
                <span>{{ scope.row.alarm_value }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报警状态" align="center" width="76px" >
              <template slot-scope="scope">
                <span :style="{color:getAlarmColor(scope.row.alarm_state)}">{{ scope.row.alarm_state | alarm_state }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--页码导航-->
          <pagination v-show="total>0" :total="total" :page.sync="paramsGetDeviceNBs.page" :limit.sync="paramsGetDeviceNBs.limit" @pagination="getDeviceNBs" />
        </div>
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
import batteryChart from '../components/batteryChart'

export default {
  name: 'Water',
  components: {
    onlineChart,
    alarmChart,
    Pagination,
    batteryChart
  },
  filters: {
    alarm_state(state) {
      if ([1].includes(state)) {
        return '火灾报警'
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
      total: 0,
      deviceTypeOptions: [],
      deviceInfoList: [],
      alarm_state: [
        { name: '火警事件', value: 0, per: 0, color: '#ea263d' },
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
      tempFilterOptions: {
        device_id: undefined,
        address: undefined,
        online_state: undefined,
        alarm_state: undefined
      },
      alarmOptions: [{ id: 0, type: '正常' }, { id: 1, type: '火灾报警' }],
      onlineOptions: [{ id: 0, type: '离线' }, { id: 1, type: '在线' }],
      paramsGetDeviceNBs: {
        project_id: undefined,
        page: 1,
        limit: 10,
        device_id: undefined, // 模糊搜索
        device_type_id: this.$route.meta.roles[0]
      },
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getDeviceNBsDetail()
    this.getDeviceNBs()
  },
  methods: {
    onSearch() {
      this.paramsGetDeviceNBs.page = 1
      this.paramsGetDeviceNBs.device_id = this.tempFilterOptions.device_id
      this.paramsGetDeviceNBs.address = this.tempFilterOptions.address
      this.paramsGetDeviceNBs.online_state = (this.tempFilterOptions.online_state || this.tempFilterOptions.online_state === 0) ? this.tempFilterOptions.online_state : undefined
      this.paramsGetDeviceNBs.alarm_state = (this.tempFilterOptions.alarm_state || this.tempFilterOptions.alarm_state === 0) ? this.tempFilterOptions.alarm_state : undefined
      this.getDeviceNBs()
    },
    getAlarmColor(state) {
      if ([1].includes(state)) {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    },
    getTamperColor(state) {
      if (state === 1) {
        return '#E6A23C'
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
      this.$router.push({ path: '/devrecord/smokeDetail', query: { id, device_type_id: this.$route.meta.roles[0] }})
    },

    deviceChange(id) {
      this.paramsGetDeviceNBs.device_id = id === '' ? undefined : id
      this.getDeviceNBs()
    },
    getDeviceNBs() {
      this.isLoading = true
      this.paramsGetDeviceNBs.project_id = this.selected_project_id
      getDevList2ForIot(this.paramsGetDeviceNBs).then(res => {
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
    getDeviceNBsDetail() {
      getDevicesDetail({ project_id: this.selected_project_id, device_type_id: this.$route.meta.roles[0] }).then(res => {
        const { online_state, alarm_state, battery_state } = res.data
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
