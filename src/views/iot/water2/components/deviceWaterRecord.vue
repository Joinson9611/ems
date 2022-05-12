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
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(requestHistoryRecord.page - 1) * requestHistoryRecord.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="报警类型" align="center" >
        <template slot-scope="scope">
          <span :style="{color:getAlarmColor(scope.row.alarm_type_id)}" ><i>{{ scope.row.alarm_type_id | alarm_type }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" >
        <template slot-scope="scope">
          <span ><i>{{ getTime(scope.row.alarm_time) }}</i></span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="设备类型" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备描述" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.device_label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" align="center" >
        <template slot-scope="scope">
          <el-tag :type="getMessageStyle(scope.row.alarm_type_id)">{{ getMessageText(scope.row.alarm_type_id) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" width="180px" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ getTime(scope.row.alarm_time) }}</span>
        </template>
      </el-table-column> -->
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="requestHistoryRecord.page" :limit.sync="requestHistoryRecord.limit" @pagination="getWaterInfoList" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { Formattimestamp } from '@/utils/time.js'
import Pagination from '@/components/Pagination'
import { historywater2s } from '@/api/devicewater2s'
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
      switch (aid) {
        case 31:
          return '设备上线'
        case 32:
          return '设备下线'
        case 71:
          return '水浸报警'
        case 72:
          return '水浸恢复'
        case 45:
          return '电量过低'
        case 46:
          return '电量恢复'
        default:
          return '未知'
      }
    }
  },
  props: {
    device_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // MessageStatus: [
      //   '水位过高',
      //   '水位过低',
      //   '水压过高',
      //   '水压过低',
      //   '低电量',
      //   '电量恢复',
      //   '水位恢复',
      //   '水压恢复',
      //   '其他事件'
      // ],
      MessageStyle: [
        'danger',
        'warning',
        'success',
        'gray'
      ],
      total: 0,
      // waterAlarmOptions: [
      //   { id: 41, name: '水位过高' },
      //   { id: 42, name: '水位过低' },
      //   { id: 43, name: '水压过高' },
      //   { id: 44, name: '水压过低' },
      //   { id: 45, name: '电量过低' },
      //   { id: 46, name: '电量恢复' },
      //   { id: 47, name: '水位恢复' },
      //   { id: 48, name: '水压恢复' }
      // ],
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
    getMessageStyle(status) {
      if (status === 41 || status === 42 || status === 43 || status === 44) {
        return this.MessageStyle[0]
      } else if (status === 45) {
        return this.MessageStyle[1]
      } else if (status === 46 || status === 47 || status === 48) {
        return this.MessageStyle[2]
      } else {
        return this.MessageStyle[3]
      }
    },
    getMessageText(status) {
      if (status === 41) {
        return this.MessageStatus[0]
      } else if (status === 42) {
        return this.MessageStatus[1]
      } else if (status === 43) {
        return this.MessageStatus[2]
      } else if (status === 44) {
        return this.MessageStatus[3]
      } else if (status === 45) {
        return this.MessageStatus[4]
      } else if (status === 46) {
        return this.MessageStatus[5]
      } else if (status === 47) {
        return this.MessageStatus[6]
      } else if (status === 48) {
        return this.MessageStatus[7]
      } else {
        return this.MessageStatus[8]
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
        alarm_type_id: this.requestHistoryRecord.alarm_type_id,
        s_time1: this.requestHistoryRecord.s_time1,
        s_time2: this.requestHistoryRecord.s_time2
      }
      historywater2s(params).then(response => {
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
