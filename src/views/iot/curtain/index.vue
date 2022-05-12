<template>
  <div class="app-container">
    <div class="filter-container">
      <!--设备ID筛选框-->
      <el-input v-model="tempFilterOptions.device_id" clearable placeholder="设备ID" style="width: 155px;" class="filter-item" @keyup.enter.native="onSearch"/>
      <el-select v-model="tempFilterOptions.building_id" style="width: 120px" placeholder="请选择建筑" class="filter-item" clearable @change="buildingChange">
        <el-option v-for="item in buildingOptions" :key="item.building_id" :label="item.building" :value="item.building_id"/>
      </el-select>
      <el-select v-model="tempFilterOptions.floor_id" placeholder="请选择楼层" style="width: 120px" class="filter-item" clearable @change="floorChange">
        <el-option v-for="item in floorOptions" :key="item.floor_id" :label="item.floor" :value="item.floor_id"/>
      </el-select>
      <!--筛选按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
    </div>

    <el-table
      v-loading="isDeviceLinkLoading"
      :data="deviceLinkList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(paramGetDeviceLink.page - 1) * paramGetDeviceLink.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="设备ID" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.device_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属建筑" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属楼层" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <span :style="{color: stateColor[scope.row.device_state]}">{{ device_state[scope.row.device_state] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="paramGetDeviceLink.page" :limit.sync="paramGetDeviceLink.limit" @pagination="paramGetDeviceLink" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getBuildingList } from '@/api/buildings'
import { getFloorList } from '@/api/floors'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getDeviceLinkList } from '@/api/deviceLink'

export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,

      tempFilterOptions: {
        device_id: undefined,
        building_id: undefined,
        floor_id: undefined,
        linkage_system_type_id: undefined
      },
      deviceLinkList: [],
      stateColor: ['#67C23A', '#409EFF'],
      device_state: ['正常', '联动'],
      buildingOptions: [],
      floorOptions: [],
      paramGetDeviceLink: {
        page: 1,
        limit: 20,
        project_id: undefined,
        linkage_system_type_id: '1', // -1=所有  联动系统	（目前只有：1=防火卷帘）
        building_id: undefined,	// -1=所有
        floor_id: undefined,	// -1=所有
        device_id: undefined	// 模糊搜索
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getDeviceLinkList()
    this.getBuildingList()
  },
  methods: {
    onSearch() {
      this.paramGetDeviceLink.device_id = this.tempFilterOptions.device_id
      this.paramGetDeviceLink.floor_id = this.tempFilterOptions.floor_id
      this.paramGetDeviceLink.building_id = this.tempFilterOptions.building_id
      this.paramGetDeviceLink.page = 1
      this.getDeviceLinkList()
    },
    getBuildingList() {
      this.isBuildingSelectLoading = true
      const params = {
        project_id: this.selected_project_id
      }
      getBuildingList(params).then(response => {
        this.isBuildingSelectLoading = false
        this.buildingOptions = response.data.items
        this.buildingOptions1 = response.data.items
      })
    },
    // 获取楼层选项列表
    getFloorList(bid) {
      this.isFloorSelectLoading = true
      const params = {
        project_id: this.selected_project_id,
        building_id: bid
      }
      getFloorList(params).then(response => {
        this.floorOptions = response.data.items
      }).catch(() => {
      })
    },
    buildingChange(id) {
      this.tempFilterOptions.floor_id = undefined
      if (id === '') {
        this.tempFilterOptions.building_id = undefined
        this.floorOptions = []
      } else {
        this.getFloorList(id)
      }
      this.getDevicesList()
    },
    floorChange(id) {
      if (id === '') {
        this.tempFilterOptions.floor_id = undefined
      }
      this.getDevicesList()
    },
    // 获取联动设备列表
    getDeviceLinkList() {
      this.paramGetDeviceLink.project_id = this.selected_project_id
      this.isDeviceLinkLoading = true
      getDeviceLinkList(this.paramGetDeviceLink).then(({ data }) => {
        this.deviceLinkList = data.items
        this.total = data.total
        this.isDeviceLinkLoading = false
      }).catch(() => {
        this.isDeviceLinkLoading = false
      })
    }
  }
}
</script>

<style>

</style>
