<template>
  <div class="container" >
    <div class="filter-container">
      <!--报警类型筛选-->
      <!-- <el-select v-model="tempFilterOptions.alarm_type_id" placeholder="报警类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in waterAlarmOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select> -->
      <!-- 时间筛选 -->
      <div class="filter-item">
        <el-date-picker
          v-model="requestHistoryRecord.timeList"
          :default-time="['00:00:00', '23:59:59']"
          size="mini"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timeChange"/>
      </div>
    </div>

    <!--任务列表-->
    <el-table
      v-loading="ishistoryRecordLoading"
      :data="historyRecordInfoList"
      element-loading-text="Loading"
      style="width: 100%;"
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(requestHistoryRecord.page - 1) * requestHistoryRecord.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="类型" align="center" >
        <template slot-scope="scope">
          <span><i>{{ typeMap[scope.row.type_id] }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <span :style="{color:getMessageText(scope.row).color}" ><i>{{ getMessageText(scope.row).message }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" >
        <template slot-scope="scope">
          <span ><i>{{ getTime(scope.row.alarm_time) }}</i></span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="requestHistoryRecord.page" :limit.sync="requestHistoryRecord.limit" @pagination="getWaterInfoList" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { Formattimestamp } from '@/utils/time.js'
import Pagination from '@/components/Pagination'
import { getHistorydevList } from '@/api/historys'

import { mapGetters } from 'vuex'
export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  props: {
    device_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      typeMap: ['在线状态', '水浸报警状态', '电量状态'],
      total: 0,

      historyRecordInfoList: [],
      ishistoryRecordLoading: false,
      requestHistoryRecord: {
        limit: 20,
        page: 1,
        device_id: this.device_id,
        alarm_type_id: -1,
        timeList: undefined,
        s_time1: undefined,
        s_time2: undefined
      }
    }
  },
  computed: {
    ...mapGetters({
      project_id: 'selected_project_id'
    })
  },
  created() {
    this.getWaterInfoList()
  },

  methods: {
    getAlarmColor(state) {
      if ([71, 32, 45].includes(state)) {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    },
    getMessageText({ alarm_type_id, type_id }) {
      const color = ['#F56C6C', '#67C23A']
      const color1 = ['#67C23A', '#F56C6C']
      const color2 = ['#67C23A', '#F56C6C']
      const online = ['下线', '上线']
      const water = ['水浸恢复', '水浸报警']
      const battery = ['电量恢复', '电量过低']
      if (type_id === 0) {
        return { color: color[alarm_type_id], message: online[alarm_type_id] }
      } else if (type_id === 1) {
        return { color: color1[alarm_type_id], message: water[alarm_type_id] }
      } else if (type_id === 2) {
        return { color: color2[alarm_type_id], message: battery[alarm_type_id] }
      }
    },
    getTime(timeStamp) {
      return Formattimestamp(timeStamp)
    },
    timeChange(time) {
      if (time) {
        this.requestHistoryRecord.s_time1 = this.requestHistoryRecord.timeList[0]
        this.requestHistoryRecord.s_time2 = this.requestHistoryRecord.timeList[1]
      } else {
        this.requestHistoryRecord.s_time1 = undefined
        this.requestHistoryRecord.s_time2 = undefined
      }
      this.getWaterInfoList()
    },
    getWaterInfoList() {
      this.ishistoryRecordLoading = true
      const params = {
        project_id: this.project_id,
        limit: this.requestHistoryRecord.limit,
        page: this.requestHistoryRecord.page,
        device_id: this.requestHistoryRecord.device_id,
        device_type_id: this.$route.query.device_type_id,
        s_time1: this.requestHistoryRecord.s_time1,
        s_time2: this.requestHistoryRecord.s_time2
      }
      getHistorydevList(params).then(response => {
        this.total = response.data.total
        this.historyRecordInfoList = response.data.items
        this.ishistoryRecordLoading = false
      }).catch(err => { console.error(err) })
    }
  }
}
</script>

<style>
  .container {
    padding: 10px;
  }
</style>
