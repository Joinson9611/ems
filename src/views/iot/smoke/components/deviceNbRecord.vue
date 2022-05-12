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
      <el-table-column label="报警类型" align="center" >
        <template slot-scope="scope">
          <span ><i>{{ scope.row.alarm_type_id | alarm_type }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" >
        <template slot-scope="scope">
          <span ><i>{{ getTime(scope.row.alarm_time) }}</i></span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="requestHistoryRecord.page" :limit.sync="requestHistoryRecord.limit" @pagination="getFasInfoList" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { Formattimestamp } from '@/utils/time.js'
import Pagination from '@/components/Pagination'
import { getNbInfoList } from '@/api/historyNB'
import { mapGetters } from 'vuex'
export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  filters: {
    alarm_type(aid) {
      if ([31].includes(aid)) {
        return '设备上线'
      } else if ([32].includes(aid)) {
        return '设备下线'
      } else if ([41, 43].includes(aid)) {
        return '过高'
      } else if ([42, 44].includes(aid)) {
        return '过低'
      } else if ([47, 48].includes(aid)) {
        return '恢复'
      } else if ([45].includes(aid)) {
        return '电量过低'
      } else if ([46].includes(aid)) {
        return '电量恢复'
      } else {
        return '未知'
      }
    }
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
      nbAlarmOptions: [
        { id: 45, name: '电量过低' },
        { id: 46, name: '电量恢复' },
        { id: 51, name: '火警事件' },
        { id: 52, name: '火警恢复' },
        { id: 61, name: '防拆报警' },
        { id: 62, name: '防拆恢复' }
      ],
      MessageStyle: [
        'danger',
        'warning',
        'success',
        'gray'
      ],
      MessageStatus: [
        '火警',
        '火警恢复',
        '防拆报警',
        '防拆恢复',
        '低电量',
        '电量恢复',
        '异常数据'
      ],
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
    this.getFasInfoList()
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
      this.getFasInfoList()
    },
    getMessageText(status) {
      if (status === 51) {
        return this.MessageStatus[0]
      } else if (status === 52) {
        return this.MessageStatus[1]
      } else if (status === 61) {
        return this.MessageStatus[2]
      } else if (status === 62) {
        return this.MessageStatus[3]
      } else if (status === 45) {
        return this.MessageStatus[4]
      } else if (status === 46) {
        return this.MessageStatus[5]
      } else {
        return this.MessageStatus[6]
      }
    },
    // 获取报警类型文本
    getMessageStyle(status) {
      if (status === 51) {
        return this.MessageStyle[0]
      } else if (status === 52 || status === 62 || status === 46) {
        return this.MessageStyle[2]
      } else if (status === 61 || status === 45) {
        return this.MessageStyle[1]
      } else {
        return this.MessageStyle[3]
      }
    },
    getTime(timeStamp) {
      if (timeStamp) return Formattimestamp(timeStamp)
      else return '/'
    },
    getFasInfoList() {
      this.ishistoryRecordLoading = true
      const params = {
        project_id: this.project_id,
        limit: this.requestHistoryRecord.limit,
        page: this.requestHistoryRecord.page,
        device_id: this.requestHistoryRecord.device_id,
        alarm_type_id: this.requestHistoryRecord.alarm_type_id,
        s_time1: this.requestHistoryRecord.s_time1,
        s_time2: this.requestHistoryRecord.s_time2
      }
      getNbInfoList(params).then(response => {
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
