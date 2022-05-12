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
              温度统计
            </div>
          </div>
          <div class="chart-wrapper">
            <div class="half left">
              <div class="chart">
                <alarmChart :chart-data="t_state" />
              </div>
            </div>
            <div class="half right">
              <div class="data-wrapper">
                <div class="data-item">
                  <div :style="{color: t_state[0].color}" class="item" >
                    <div class="header">
                      {{ t_state[0].name }}<span class="percentage">{{ t_state[0].per }}%</span>
                    </div>
                    <div :style="{color: t_state[0].color}" class="number">
                      {{ t_state[0].value }}项
                    </div>
                  </div>
                  <div :style="{color: t_state[1].color}" class="item" >
                    <div class="header">
                      {{ t_state[1].name }}<span class="percentage">{{ t_state[1].per }}%</span>
                    </div>
                    <div :style="{color: t_state[1].color}" class="number">
                      {{ t_state[1].value }}项
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
              漏电统计
            </div>
          </div>
          <div class="chart-wrapper">
            <div class="half left">
              <div class="chart">
                <alarmChart :chart-data="c_state" />
              </div>
            </div>
            <div class="half right">
              <div class="data-wrapper">
                <div class="data-item">
                  <div :style="{color: c_state[0].color}" class="item" >
                    <div class="header">
                      {{ c_state[0].name }}<span class="percentage">{{ c_state[0].per }}%</span>
                    </div>
                    <div :style="{color: c_state[0].color}" class="number">
                      {{ c_state[0].value }}项
                    </div>
                  </div>
                  <div :style="{color: c_state[1].color}" class="item" >
                    <div class="header">
                      {{ c_state[1].name }}<span class="percentage">{{ c_state[1].per }}%</span>
                    </div>
                    <div :style="{color: c_state[1].color}" class="number">
                      {{ c_state[1].value }}项
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
      <el-card class="box-card" shadow="never">
        <div class="list">
          <div class="filter-container">
            <el-input v-model="tempFilterOptions.device_id" size="mini" placeholder="请输入设备ID" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
            <el-input v-model="tempFilterOptions.address" size="mini" placeholder="请输入设备地址" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
            <el-select v-model="tempFilterOptions.online_state" size="mini" placeholder="在线状态" style="width: 120px" class="filter-item" clearable >
              <el-option v-for="item in onlineOptions" :key="item.id" :label="item.type" :value="item.id"/>
            </el-select>

            <el-button size="mini" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
          </div>
          <!-- <div class="filter-container">
              <el-input v-model="paramsGetDeviceefs.device_id" size="mini" placeholder="请输入设备ID" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
              <el-select v-model="paramsGetDeviceefs.building_id" size="mini" filterable placeholder="所属建筑" style="width: 150px" clearable class="filter-item" @change="buildChange">
                <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id" />
              </el-select>
              <el-select v-model="paramsGetDeviceefs.floor_id" size="mini" filterable placeholder="所属楼层" style="width: 120px" clearable class="filter-item" @change="floorChange">
                <el-option v-for="item in floorOptions" :key="item.floor_id" :label="item.floor" :value="item.floor_id" />
              </el-select>
              <el-button size="mini" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
            </div> -->
          <!--任务列表-->
          <el-table
            v-loading="isLoading"
            :data="deviceInfoList"
            element-loading-text="Loading"
            style="width: 100%;"
            fit
            highlight-current-row
          >
            <el-table-column label="序号" align="center" width="55">
              <template slot-scope="scope"><span>{{ scope.$index+(paramsGetDeviceefs.page - 1) * paramsGetDeviceefs.limit + 1 }} </span></template>
            </el-table-column>
            <el-table-column label="设备ID" width="210">
              <template slot-scope="scope">
                <a class="skip" @click="toPageDetail(scope.row.device_id)"><i>{{ scope.row.device_id }}</i></a>
              </template>
            </el-table-column>
            <el-table-column label="设备地址" >
              <template slot-scope="scope">
                <span>{{ scope.row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="信号强度" width="76" align="center" >
              <template slot-scope="scope">
                <span>{{ scope.row.signal_value }}</span>
              </template>
            </el-table-column>
            <el-table-column label="在线状态" align="center" width="78" >
              <template slot-scope="scope">
                <span :style="{color: scope.row.online_state !== 0 ? '#67C23A' : '#F56C6C'}">{{ scope.row.online_state !== 0 ? '在线' : '离线' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="漏电流" width="78" align="center" >
              <template slot-scope="scope">
                <span :style="{color:tColor[scope.row.c_state]}">{{ tStateMap[scope.row.c_state] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="温度1" width="76" align="center" >
              <template slot-scope="scope">
                <span :style="{color:tColor[scope.row.t1_state]}">{{ tStateMap[scope.row.t1_state] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="温度2" width="76" align="center" >
              <template slot-scope="scope">
                <span :style="{color:tColor[scope.row.t2_state]}">{{ tStateMap[scope.row.t2_state] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="温度3" width="76" align="center" >
              <template slot-scope="scope">
                <span :style="{color:tColor[scope.row.t3_state]}">{{ tStateMap[scope.row.t3_state] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="温度4" width="76" align="center" >
              <template slot-scope="scope">
                <span :style="{color:tColor[scope.row.t4_state]}">{{ tStateMap[scope.row.t4_state] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--页码导航-->
          <pagination v-show="total>0" :total="total" :page.sync="paramsGetDeviceefs.page" :limit.sync="paramsGetDeviceefs.limit" @pagination="getDeviceefs" />
        </div>
      </el-card>
    </div>
  </div>

</template>

<script>
import CountTo from 'vue-count-to'
import { getDevList2ForIot, getDevicesDetail } from '@/api/devices'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import alarmChart from '../components/alarmChart'
import onlineChart from '../components/onlineChart'

export default {
  name: 'Water',
  components: {
    onlineChart,
    Pagination,
    CountTo,
    alarmChart
  },
  data() {
    return {
      deviceTypeOptions: [],
      deviceInfoList: [],
      online_state: [
        { name: '离线', value: 0, per: 0, color: '#232323' },
        { name: '在线', value: 0, per: 0, color: '#28ce9f' }
      ],
      c_state: [
        { name: '报警', value: 0, per: 0, color: '#ea263d' },
        { name: '正常', value: 0, per: 0, color: '#28ce9f' }
      ],
      t_state: [
        { name: '报警', value: 0, per: 0, color: '#ea263d' },
        { name: '正常', value: 0, per: 0, color: '#28ce9f' }
      ],
      onlineOptions: [{ id: 0, type: '离线' }, { id: 1, type: '在线' }],
      tempFilterOptions: {
        device_id: undefined,
        address: undefined,
        online_state: undefined
      },
      tStateMap: ['正常', '未使用', '开路故障', '短路故障', '报警'],
      tColor: ['#67C23A', '#909399', '#E6A23C', '#E6A23C', '#F56C6C'],

      total: 0,

      paramsGetDeviceefs: {
        project_id: undefined,
        page: 1,
        limit: 10,
        device_type_id: this.$route.meta.roles[0],
        building_id: undefined,
        floor_id: undefined,
        device_id: undefined, // 模糊搜索
        address: undefined,
        online_state: undefined
      },

      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getDeviceefsDetail()
    this.getDeviceefs()
  },
  methods: {
    onSearch() {
      this.paramsGetDeviceefs.page = 1
      this.paramsGetDeviceefs.device_id = this.tempFilterOptions.device_id
      this.paramsGetDeviceefs.address = this.tempFilterOptions.address
      this.paramsGetDeviceefs.online_state = (this.tempFilterOptions.online_state || this.tempFilterOptions.online_state === 0) ? this.tempFilterOptions.online_state : undefined
      this.getDeviceefs()
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
      this.$router.push({ path: '/devrecord/elefireDetail', query: { id, device_type_id: this.$route.meta.roles[0] }})
    },
    deviceChange(id) {
      this.paramsGetDeviceefs.device_id = id === '' ? undefined : id
      this.getDeviceefs()
    },
    getDeviceefs() {
      this.isLoading = true
      this.paramsGetDeviceefs.project_id = this.selected_project_id
      getDevList2ForIot(this.paramsGetDeviceefs).then(res => {
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
    getDeviceefsDetail() {
      getDevicesDetail({ project_id: this.selected_project_id, device_type_id: this.$route.meta.roles[0] }).then(res => {
        const { online_state, c_state, t_state } = res.data
        const cStateTotal = c_state[0] + c_state[1]
        this.c_state[0].per = this.getPercentage(c_state[0], cStateTotal)
        this.c_state[1].per = this.getPercentage(c_state[1], cStateTotal)
        this.c_state[0].value = c_state[0]
        this.c_state[1].value = c_state[1]
        const onlineTotal = online_state[0] + online_state[1]
        this.online_state[0].per = this.getPercentage(online_state[0], onlineTotal)
        this.online_state[1].per = this.getPercentage(online_state[1], onlineTotal)
        this.online_state[0].value = online_state[0]
        this.online_state[1].value = online_state[1]
        const tStateTotal = t_state[0] + t_state[1]
        this.t_state[0].per = this.getPercentage(t_state[0], tStateTotal)
        this.t_state[1].per = this.getPercentage(t_state[1], tStateTotal)
        this.t_state[0].value = t_state[0]
        this.t_state[1].value = t_state[1]
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/devicerecord.scss";
</style>
