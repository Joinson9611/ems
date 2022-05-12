<template>
  <div class="fasRecord" >
    <div class="filter-container">
      <!--设备ID筛选框-->
      <el-input v-model="tempFilterOptions.device_id" size="mini" placeholder="请输入设备ID" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
      <!--报警类型筛选-->
      <el-select v-model="tempFilterOptions.alarm_type_id" size="mini" placeholder="报警类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in fasAlarmOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <!-- 时间筛选 -->
      <div class="filter-item">
        <el-date-picker
          v-model="tempFilterOptions.timeList"
          :default-time="['00:00:00', '23:59:59']"
          size="mini"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </div>
      <!--筛选按钮-->
      <el-button v-waves size="mini" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
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
      <el-table-column label="设备ID" align="center" >
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="toPageDetail(scope.row.history_id)"><i>{{ scope.row.device_id }}</i></a>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备地址" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.device_label || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="getMessageStyle(scope.row.alarm_type_id)">{{ fasAlarmMap[scope.row.alarm_type_id] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" width="180px" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ getTime(scope.row.alarm_time) }}</span>
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
import { getFasInfoList } from '@/api/historyfas'
import { mapGetters } from 'vuex'
export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  props: {
    alarm_type_id: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      total: 0,
      fasAlarmOptions: [
        { id: 0, name: '正常' },
        { id: 1, name: '火警' },
        { id: 2, name: '反馈' },
        { id: 3, name: '启动' },
        { id: 4, name: '监管' },
        { id: 5, name: '屏蔽' },
        { id: 6, name: '故障' },
        { id: 7, name: '其他' }
      ],
      fasAlarmMap: [
        '正常',
        '火警',
        '反馈',
        '启动',
        '监管',
        '屏蔽',
        '故障',
        '其他'
      ],
      historyRecordInfoList: [],
      ishistoryRecordLoading: false,
      tempFilterOptions: {
        device_id: undefined,
        alarm_type_id: this.alarm_type_id,
        timeList: undefined
      },
      requestHistoryRecord: {
        limit: 20,
        page: 1,
        device_id: undefined,
        alarm_type_id: this.alarm_type_id,
        timeList: undefined
      }
    }
  },
  computed: {
    ...mapGetters({
      project_id: 'selected_project_id'
    })
  },
  watch: {
    'alarm_type_id': {
      handler(aid) {
        this.tempFilterOptions.alarm_type_id = aid
        this.requestHistoryRecord.alarm_type_id = aid
        this.getFasInfoList()
      },
      immediate: true
    }
  },
  created() {
    this.getFasInfoList()
  },
  methods: {
    toPageDetail(hid) {
      this.$router.push({ path: '/iot/fasDetail', query: { hid }})
    },
    getMessageStyle(id) {
      const type = ['success', 'warning', 'danger', '']
      if (id === 0) return type[0]
      else if ([1, 2, 4].includes(id)) return type[2]
      else if ([3, 6].includes(id)) return type[1]
      else return type[3]
    },
    getTime(timeStamp) {
      if (timeStamp) return Formattimestamp(timeStamp)
      else return '/'
    },
    onSearch() {
      if (this.tempFilterOptions.timeList) {
        this.requestHistoryRecord.s_time1 = this.tempFilterOptions.timeList[0]
        this.requestHistoryRecord.s_time2 = this.tempFilterOptions.timeList[1]
      } else {
        this.requestHistoryRecord.s_time1 = undefined
        this.requestHistoryRecord.s_time2 = undefined
      }
      this.requestHistoryRecord.page = 1
      this.requestHistoryRecord.device_id = this.tempFilterOptions.device_id ? this.tempFilterOptions.device_id : undefined
      this.requestHistoryRecord.alarm_type_id = (this.tempFilterOptions.alarm_type_id || this.tempFilterOptions.alarm_type_id === 0) ? this.tempFilterOptions.alarm_type_id : undefined
      this.getFasInfoList()
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
      getFasInfoList(params).then(response => {
        this.total = response.data.total
        this.historyRecordInfoList = response.data.items
        this.ishistoryRecordLoading = false
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style>
  .fasRecord {
    padding :10px;
  }
</style>
