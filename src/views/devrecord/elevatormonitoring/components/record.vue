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
          <span :style="{color:getMessageText(scope.row).color}" ><i>{{ getMessageText(scope.row).message }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" >
        <template slot-scope="scope">
          <span ><i>{{ getTime(scope.row.alarm_time) }}</i></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="checkImg(scope.row.image)">查看图片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="requestHistoryRecord.page" :limit.sync="requestHistoryRecord.limit" @pagination="getCameraInfoList" />

    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="true" title="现场图片" >
      <viewer v-if="fireImg.length !== 0" :images="fireImg">
        <img v-for="(img,index) in fireImg" :key="index" :src="img" class="item-image">
      </viewer>
      <el-image v-else class="item-image"/>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { Formattimestamp } from '@/utils/time.js'
import { getHistorydevList } from '@/api/historys'
import Pagination from '@/components/Pagination'
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
      typeMap: ['在线状态', '报警状态'],
      total: 0,
      dialogVisible: false,
      historyRecordInfoList: [],
      fireImg: [],
      ishistoryRecordLoading: false,
      requestHistoryRecord: {
        limit: 20,
        page: 1,
        device_id: this.device_id
      }
    }
  },
  computed: {
    ...mapGetters({
      project_id: 'selected_project_id'
    })
  },
  created() {
    this.getCameraInfoList()
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
      this.getCameraInfoList()
    },
    getMessageText({ alarm_type_id, type_id }) {
      const color = ['#F56C6C', '#67C23A']
      const color1 = ['#67C23A', '#F56C6C']
      const online = ['下线', '上线']
      const alarm = ['恢复', '报警']
      if (type_id === 0) {
        return { color: color[alarm_type_id], message: online[alarm_type_id] }
      } else {
        if (alarm_type_id === 10) {
          return { color: '#E6A23C', message: '故障' }
        } else {
          return { color: color1[alarm_type_id], message: alarm[alarm_type_id] }
        }
      }
    },
    getTime(timeStamp) {
      if (timeStamp) return Formattimestamp(timeStamp)
      else return '/'
    },
    checkImg(url) {
      this.dialogVisible = true
      let arr = []
      if (url) {
        arr = url.split(',')
        arr = arr.map(item => process.env.FILE_URL + item)
      } else {
        arr = []
      }
      this.fireImg = arr
    },
    getCameraInfoList() {
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

<style lang="scss" scoped>
  /deep/.el-dialog {
    overflow: auto;
    width: 730px;
  }
  .item-image{
    display: inline-block;
    margin-top: 5px;
    margin-right: 5px;
    width: 220px;
    height: 220px;
    &:last-child {
      margin-right: 0;
    }
  }
</style>
