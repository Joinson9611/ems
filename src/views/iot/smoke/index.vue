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
      <!-- <div class="item">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              电量统计
            </div>
          </div>
          <batteryChart :chart-data="battery_state" />
        </el-card>
      </div> -->
    </div>
    <div class="deviceList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            无线烟感设备列表
          </div>
        </div>
        <div class="list">
          <div class="filter-container">
            <div class="filter-container">
              <!--设备ID筛选框-->
              <el-input v-model="paramsGetDeviceNBs.device_id" size="mini" placeholder="请输入设备ID" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
              <!-- 建筑选择 -->
              <el-select v-model="paramsGetDeviceNBs.building_id" size="mini" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item" @change="buildChange">
                <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id" />
              </el-select>
              <!-- 楼层选择 -->
              <el-select v-model="paramsGetDeviceNBs.floor_id" size="mini" filterable placeholder="所属楼层" style="width: 120px" clearable class="filter-item" @change="floorChange">
                <el-option v-for="item in floorOptions" :key="item.floor_id" :label="item.floor" :value="item.floor_id" />
              </el-select>
              <!--筛选按钮-->
              <el-button size="mini" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
            </div>

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
                <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDeviceNBs.page - 1) * paramsGetDeviceNBs.limit + 1 }} </span></template>
              </el-table-column>
              <el-table-column label="设备ID" align="center" >
                <template slot-scope="scope">
                  <a style="color: #409EFF" @click="toPageDetail(scope.row.device_id)"><i>{{ scope.row.device_id }}</i></a>
                </template>
              </el-table-column>
              <el-table-column label="设备类型" align="center" >
                <template slot-scope="scope">
                  <span>{{ scope.row.device_type }}</span>
                </template>
              </el-table-column>
              <el-table-column label="设备地址" align="center" >
                <template slot-scope="scope">
                  <span>{{ scope.row.device_label }}</span>
                </template>
              </el-table-column>
              <el-table-column label="电量" align="center" >
                <template slot-scope="scope">
                  <span :style="batteryColor(scope.row.battery_value)">{{ scope.row.battery_value }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="信号强度(dBm)" align="center" >
                <template slot-scope="scope">
                  <span>{{ scope.row.signal_value }}</span>
                </template>
              </el-table-column>
              <el-table-column label="在线状态" align="center" width="100px" >
                <template slot-scope="scope">
                  <span :style="{color: scope.row.online_state === 31 ? '#67C23A' : '#F56C6C'}">{{ scope.row.online_state === 31 ? '在线' : '离线' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="防拆状态" align="center" width="100px" >
                <template slot-scope="scope">
                  <span :style="{color: getTamperColor(scope.row.tamper_state)}">{{ scope.row.tamper_state | tamper_state }}</span>
                </template>
              </el-table-column>
              <el-table-column label="监测值" align="center" width="70px" >
                <template slot-scope="scope">
                  <span>{{ scope.row.alarm_value }}</span>
                </template>
              </el-table-column>
              <el-table-column label="监测状态" align="center" width="100px" >
                <template slot-scope="scope">
                  <span :style="{color:getAlarmColor(scope.row.alarm_state)}">{{ scope.row.alarm_state | alarm_state }}</span>
                </template>
              </el-table-column>
            </el-table>
            <!--页码导航-->
            <pagination v-show="total>0" :total="total" :page.sync="paramsGetDeviceNBs.page" :limit.sync="paramsGetDeviceNBs.limit" @pagination="getDeviceNBs" />
          </div>
      </div></el-card>
    </div>
  </div>

</template>

<script>
import { getNBDevicesList, getNBDevicesGraph } from '@/api/devicenbs'
import { getBuildingList } from '@/api/buildings'
import { getFloorList } from '@/api/floors'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import onlineChart from './components/onlineChart'
import alarmChart from './components/alarmChart'
import batteryChart from './components/batteryChart'
const alarm_name = ['火警事件', '正常']
const online_name = ['离线', '在线']
const battery_name = ['电量过低', '正常']

export default {
  name: 'Water',
  components: {
    onlineChart,
    alarmChart,
    batteryChart,
    Pagination
  },
  filters: {
    alarm_state(state) {
      if ([51].includes(state)) {
        return '火警事件'
      } else {
        return '正常'
      }
    },
    tamper_state(state) {
      if (state === 61) {
        return '防拆报警'
      } else {
        return '正常'
      }
    }
  },
  data() {
    return {
      total: 0,
      buildingOptions: [],
      floorOptions: [],
      deviceTypeOptions: [],
      deviceInfoList: [],
      online_state: [],
      alarm_state: [],
      battery_state: [],

      paramsGetDeviceNBs: {
        project_id: undefined,
        page: 1,
        limit: 10,
        building_id: undefined,
        floor_id: undefined,
        device_id: undefined // 模糊搜索
      },

      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getBuildingList()
    this.getDeviceNBsDetail()
    this.getDeviceNBs()
  },
  methods: {
    getAlarmColor(state) {
      if ([51].includes(state)) {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    },
    getTamperColor(state) {
      if (state === 61) {
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
      this.$router.push({ path: '/iot/NBDetail', query: { id }})
    },
    getFloorList(id) {
      getFloorList({ project_id: this.selected_project_id, building_id: id }).then(res => {
        this.floorOptions = res.data.items
      }).catch(() => {})
    },
    getBuildingList() {
      getBuildingList({ project_id: this.selected_project_id }).then(res => {
        this.buildingOptions = res.data.items
      }).catch(() => {})
    },
    // getDevicesList() {
    //   getDeviceTypes({ project_id: this.selected_project_id, system_type_id: 24 }).then(res => {
    //     this.deviceTypeOptions = res.data.items
    //   }).catch(() => {})
    // },
    deviceChange(id) {
      this.paramsGetDeviceNBs.device_id = id === '' ? undefined : id
      this.getDeviceNBs()
    },
    buildChange(id) {
      this.paramsGetDeviceNBs.floor_id = undefined
      // 如果建筑列表清空执行
      if (id === '') {
        this.paramsGetDeviceNBs.building_id = undefined
        this.floorOptions = []
      } else {
        this.getFloorList(id)
      }
      this.paramsGetDeviceNBs.page = 1
      this.getDeviceNBs()
    },
    floorChange(id) {
      if (id === '') {
        this.paramsGetDeviceNBs.floor_id = undefined
      } else {
        this.paramsGetDeviceNBs.floor_id = id
      }
      this.paramsGetDeviceNBs.page = 1
      this.getDeviceNBs()
    },
    onSearch() {
      this.paramsGetDeviceNBs.page = 1
      this.getDeviceNBs()
    },
    getDeviceNBs() {
      this.isLoading = true
      this.paramsGetDeviceNBs.project_id = this.selected_project_id
      getNBDevicesList(this.paramsGetDeviceNBs).then(res => {
        this.total = res.data.total
        this.deviceInfoList = res.data.items
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    getDeviceNBsDetail() {
      getNBDevicesGraph({ project_id: this.selected_project_id }).then(res => {
        const { online_state, alarm_state, battery_state } = res.data
        this.alarm_state = this.convertData(alarm_state, alarm_name)
        this.online_state = this.convertData(online_state, online_name)
        this.battery_state = this.convertData(battery_state, battery_name)
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
