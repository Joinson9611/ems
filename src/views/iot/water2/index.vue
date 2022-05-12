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
            设备列表
          </div>
        </div>
        <div class="list">
          <div class="filter-container">
            <div class="filter-container">
              <!--设备ID筛选框-->
              <el-input v-model="tempFilterOptions.device_id" size="mini" placeholder="请输入设备ID" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
              <!-- 建筑选择 -->
              <el-select v-model="tempFilterOptions.building_id" size="mini" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item" @change="buildChange">
                <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id" />
              </el-select>
              <!-- 楼层选择 -->
              <el-select v-model="tempFilterOptions.floor_id" size="mini" filterable placeholder="所属楼层" style="width: 120px" clearable class="filter-item" @change="floorChange">
                <el-option v-for="item in floorOptions" :key="item.floor_id" :label="item.floor" :value="item.floor_id" />
              </el-select>
              <!-- 报警类型选择 -->
              <el-select v-model="tempFilterOptions.alarm_type_id" size="mini" filterable placeholder="报警类型" style="width: 120px" clearable class="filter-item" >
                <el-option v-for="item in alarmTypeOptions" :key="item.alarm_type_id" :label="item.alarm_type" :value="item.alarm_type_id" />
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
                <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDevicewaters.page - 1) * paramsGetDevicewaters.limit + 1 }} </span></template>
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
              <el-table-column label="电量" align="center" width="80px">
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
              <!-- <el-table-column label="监测值" align="center" width="90px" >
                <template slot-scope="scope">
                  <span>{{ scope.row.water_value || '/' }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="监测状态" align="center" width="100px" >
                <template slot-scope="scope">
                  <span :style="{color:getAlarmColor(scope.row.alarm_state )}">{{ scope.row.alarm_state | alarm_state }}</span>
                </template>
              </el-table-column>
            </el-table>
            <!--页码导航-->
            <pagination v-show="total>0" :total="total" :page.sync="paramsGetDevicewaters.page" :limit.sync="paramsGetDevicewaters.limit" @pagination="getDevicewaters" />
          </div>
      </div></el-card>
    </div>
  </div>

</template>

<script>
import { detailDevicewater2s, getDevicewater2sList } from '@/api/devicewater2s'
import { getBuildingList } from '@/api/buildings'
import { getFloorList } from '@/api/floors'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import onlineChart from './components/onlineChart'
import alarmChart from './components/alarmChart'
import batteryChart from './components/batteryChart'
const alarm_name = ['水浸报警', '正常']
const online_name = ['离线', '在线']
const battery_name = ['电量过低', '正常']

export default {
  name: 'Somke',
  components: {
    onlineChart,
    alarmChart,
    batteryChart,
    Pagination
  },
  filters: {
    alarm_state(state) {
      if ([71].includes(state)) {
        return '水浸报警'
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
      alarmTypeOptions: [
        { alarm_type_id: 0, alarm_type: '正常' },
        { alarm_type_id: 1, alarm_type: '报警' }
      ],
      deviceInfoList: [],
      online_state: [],
      alarm_state: [],
      battery_state: [],
      tempFilterOptions: {
        building_id: undefined,
        floor_id: undefined,
        device_id: undefined,
        alarm_type_id: undefined
      },
      paramsGetDevicewaters: {
        project_id: undefined,
        page: 1,
        limit: 10,
        building_id: undefined,
        floor_id: undefined,
        device_id: undefined,
        alarm_type_id: undefined
      },
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  watch: {
    '$route.query.alarm_type_id': {
      handler(id) {
        let aid
        if (id || id === 0) {
          aid = id * 1
        } else {
          aid = id
        }
        this.tempFilterOptions.alarm_type_id = aid
        this.paramsGetDevicewaters.alarm_type_id = aid
        this.getDevicewaters()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getBuildingList()
    this.getDevicewatersDetail()
    this.getDevicewaters()
  },
  methods: {
    getAlarmColor(state) {
      if ([71].includes(state)) {
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
      this.$router.push({ path: '/iot/waterDetail2', query: { id }})
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
    deviceChange(id) {
      this.paramsGetDevicewaters.device_id = id === '' ? undefined : id
      // this.getDevicewaters()
    },
    buildChange(id) {
      this.paramsGetDevicewaters.floor_id = undefined
      // 如果建筑列表清空执行
      if (id === '') {
        this.paramsGetDevicewaters.building_id = undefined
        this.floorOptions = []
      } else {
        this.getFloorList(id)
      }
      this.paramsGetDevicewaters.page = 1
      // this.getDevicewaters()
    },
    floorChange(id) {
      if (id === '') {
        this.paramsGetDevicewaters.floor_id = undefined
      } else {
        this.paramsGetDevicewaters.floor_id = id
      }
      this.paramsGetDevicewaters.page = 1
      // this.getDevicewaters()
    },
    onSearch() {
      this.paramsGetDevicewaters.building_id = [''].includes(this.tempFilterOptions.building_id) ? undefined : this.tempFilterOptions.building_id
      this.paramsGetDevicewaters.floor_id = this.tempFilterOptions.floor_id = [''].includes(this.tempFilterOptions.floor_id) ? undefined : this.tempFilterOptions.floor_id
      this.paramsGetDevicewaters.device_id = this.tempFilterOptions.device_id = this.tempFilterOptions.device_id
      this.paramsGetDevicewaters.alarm_type_id = this.tempFilterOptions.alarm_type_id = [''].includes(this.tempFilterOptions.alarm_type_id) ? undefined : this.tempFilterOptions.alarm_type_id
      this.paramsGetDevicewaters.page = 1
      this.getDevicewaters()
    },
    getDevicewaters() {
      this.isLoading = true
      this.paramsGetDevicewaters.project_id = this.selected_project_id
      getDevicewater2sList(this.paramsGetDevicewaters).then(res => {
        this.total = res.data.total
        this.deviceInfoList = res.data.items
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    getDevicewatersDetail() {
      detailDevicewater2s({ project_id: this.selected_project_id }).then(res => {
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
    min-height: calc(100vh - 50px);
    /deep/.el-card__header {
      padding: 10px 14px;
    }
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
      margin-top: 10px;
      flex: 1;
      /deep/.el-card__body {
        min-height: 260px;
      }
    }
  }
</style>
