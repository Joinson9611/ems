<template>
  <div class="container" >
    <div class="filter-container">
      <!-- 时间筛选 -->
      <div class="filter-item">
        <el-date-picker
          v-model="requestHistoryRecord.timeList"
          :default-time="['00:00:00', '23:59:59']"
          size="mini"
          type="daterange"
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
      border
      fit
      highlight-current-row
    >
      <el-table-column label="类型" align="center" >
        <template slot-scope="scope">
          <span >{{ typeMap[scope.row.type_id] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <span :style="{color: getMessageText(scope.row).color}">{{ getMessageText(scope.row).message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" >
        <template slot-scope="scope">
          <span >{{ getTime(scope.row.alarm_time) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="requestHistoryRecord.page" :limit.sync="requestHistoryRecord.limit" @pagination="getEfsHistoryList" />
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
      type: Number,
      required: true
    }
  },
  data() {
    return {
      total: 0,
      typeMap: ['在线状态', '漏电流状态', '温度1状态', '温度2状态', '温度3状态', '温度4状态'],
      alarmColor: ['#67C23A', '#909399', '#E6A23C', '#E6A23C', '#F56C6C'],
      alarm: ['恢复正常', '未使用', '开路故障', '短路故障', '报警'],
      type: ['漏电流状态', '温度1状态', '温度2状态', '温度3状态', '温度4状态'],
      historyRecordInfoList: [],
      ishistoryRecordLoading: false,
      requestHistoryRecord: {
        limit: 20,
        page: 1,
        device_id: this.device_id,
        alarm_type_id: -1,
        timeList: [],
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
    this.getEfsHistoryList()
  },
  methods: {
    timeChange(time) {
      if (time) {
        this.requestHistoryRecord.s_time1 = this.requestHistoryRecord.timeList[0]
        this.requestHistoryRecord.s_time2 = this.requestHistoryRecord.timeList[1]
      } else {
        this.requestHistoryRecord.s_time1 = undefined
        this.requestHistoryRecord.s_time2 = undefined
      }
      this.getEfsHistoryList()
    },
    getMessageText({ alarm_type_id, type_id }) {
      const color = ['#F56C6C', '#67C23A']
      const online = ['下线', '上线']
      if (type_id === 0) {
        return { color: color[alarm_type_id], message: online[alarm_type_id] }
      } else {
        return { color: this.alarmColor[alarm_type_id], message: this.alarm[alarm_type_id] }
      }
    },
    getTime(timeStamp) {
      if (timeStamp) return Formattimestamp(timeStamp)
      else return '/'
    },
    getEfsHistoryList() {
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
      }).catch(() => {
        this.ishistoryRecordLoading = false
      })
    }
  }
}
</script>

<style>
  .container {
    padding: 10px;
  }
</style>
