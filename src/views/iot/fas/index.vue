<template>
  <div class="app-container">
    <div class="statistics">
      <div class="day">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              当前统计
            </div>
          </div>
          <div class="detail info">
            <div class="item" style="border:3px solid #ef4136;"><div class="name fire">火警事件</div><div class="count" style="color:#ef4136; font-size: 20px"><count-to :start-val="0" :end-val="currentData.sum_alarm" :duration="3200" class="card-panel-num"/></div></div>
            <div class="item" style="border:3px solid rgb(165,42,42);"><div class="name supervision">监管事件</div><div class="count" style="color:rgb(165,42,42); font-size: 20px"><count-to :start-val="0" :end-val="currentData.sum_supervision" :duration="3200" class="card-panel-num"/></div></div>
            <div class="item" style="border:3px solid rgba(230,26,224, 1);"><div class="name feedback">反馈事件</div><div class="count" style="color:rgba(230,26,224, 1); font-size: 20px"><count-to :start-val="0" :end-val="currentData.sum_feedback" :duration="3200" class="card-panel-num"/></div></div>
            <div class="item" style="border:3px solid #fcaf17;"><div class="name fault">故障事件</div><div class="count" style="color:#fcaf17; font-size: 20px"><count-to :start-val="0" :end-val="currentData.sum_trouble" :duration="3200" class="card-panel-num"/></div></div>
            <!-- <div class="item" style="border:3px solid #409EFF;"><div class="name other">其他事件</div><div class="count" style="color:#409EFF; font-size: 20px"><count-to :start-val="0" :end-val="currentData.sum_other" :duration="3200" class="card-panel-num"/></div></div> -->
          </div>
        </el-card>
      </div>
      <div class="graph">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <div class="title">
              {{ `FAS系统${dateMap[fasData.dateType]}变化统计` }}
            </div>
            <div class="filter">
              <el-radio-group :disabled="isGraphLoading" v-model="paramsGetStatistics.s_date" size="mini" @change="dataChange">
                <el-radio-button :label="0">日</el-radio-button>
                <el-radio-button :label="1">月</el-radio-button>
                <el-radio-button :label="2">年</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-show="paramsGetStatistics.s_date === 0"
                :clearable="false"
                :disabled="isGraphLoading"
                v-model="paramsGetStatistics.s_time"
                class="timePicker"
                size="mini"
                type="date"
                placeholder="请选择时间"
                @change="timeChange"/>
              <el-date-picker
                v-show="paramsGetStatistics.s_date === 1"
                :clearable="false"
                :disabled="isGraphLoading"
                v-model="paramsGetStatistics.s_time"
                class="timePicker"
                type="month"
                size="mini"
                placeholder="选择月"
                @change="timeChange"/>
              <el-date-picker
                v-show="paramsGetStatistics.s_date === 2"
                :clearable="false"
                :disabled="isGraphLoading"
                v-model="paramsGetStatistics.s_time"
                class="timePicker"
                type="year"
                size="mini"
                placeholder="选择年"
                @change="timeChange"/>
            </div>
          </div>
          <div
            v-loading="isGraphLoading"
            element-loading-text="正在加载数据..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <fasChart ref="fasChart" :chart-data="fasData" :height="'280px'" style="margin-top:10px"/>
          </div>
        </el-card>
      </div>
    </div>
    <div class="recordList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <div class="title">
            报警记录
          </div>
        </div>
        <fasRecord :alarm_type_id="alarm_type_id" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { statisticsFas, statisticsFas2 } from '@/api/historyfas'
import fasChart from './components/fasChart.vue'
import fasRecord from './components/fasRecord'
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { getNowFormatDate, Formattimestamp, FormatDate, FormatDateTime } from '@/utils/time'

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout(() => {
        vm.$refs.fasChart.resize()
      }, 1000)
    })
  },
  name: 'Fas',
  components: {
    CountTo,
    fasChart,
    fasRecord
  },
  data() {
    return {
      fromName: '',
      isGraphLoading: false,

      fasDataTimer: null,
      fasData: {
        s_time: 0,
        xData: [],
        fireData: [],
        troubleData: [],
        normalData: [],
        supervision: [],
        feedbackL: [],
        otherData: [],
        totalData: [],
        dateType: 0
      },

      paramsGetStatistics: {
        project_id: undefined,
        s_date: 0, 		// 0=日、1=月、2=年
        s_time: getNowFormatDate()		// 选择的时间yy-mm-dd hh:mm:ss:
      },
      dateMap: ['日', '月', '年'],

      currentDataTimer: null,
      currentData: {
        'sum_alarm': 0,			// 火警事件(总)
        'sum_trouble': 0,			// 故障事件(总)
        'sum_normal': 0,			// 恢复事件(总)
        'sum_other': 0
      },
      totalData: {
        'sum_alarm': 0,			// 火警事件(总)
        'sum_trouble': 0,			// 故障事件(总)
        'sum_normal': 0,			// 恢复事件(总)
        'sum_other': 0
      }
    }
  },

  computed: {
    ...mapGetters(['selected_project_id']),
    alarm_type_id() {
      const id = this.$route.query.alarm_type_id
      let aid
      if (id || id === 0) {
        aid = id * 1
      } else {
        aid = id
      }
      return aid
    }
  },
  watch: {
    'paramsGetStatistics.s_date'(date) {
      this.fasData.dateType = date
    }
  },
  destroyed() {
    this.clearTimer()
  },
  created() {
    this.getDailyFas()
    this.getStatisticsFas()
  },
  methods: {
    clearTimer() {
      this.currentDataTimer = null
      clearInterval(this.currentDataTimer)
      this.fasDataTimer = null
      clearInterval(this.fasDataTimer)
    },
    getStatisticsFas() {
      this.isGraphLoading = true
      this.paramsGetStatistics.project_id = this.selected_project_id
      statisticsFas(this.paramsGetStatistics).then(res => {
        this.totalData = res.data.header
        const value_list = res.data.chart.value_list
        this.fasData.xData = []
        this.fasData.fireData = []
        this.fasData.troubleData = []
        this.fasData.normalData = []
        this.fasData.otherData = []
        this.fasData.totalData = []
        this.fasData.supervision = []
        this.fasData.feedback = []
        for (let i = 0; i < value_list.length; i++) {
          if (this.paramsGetStatistics.s_date === 0) {
            this.fasData.xData.push(FormatDate(value_list[i].sub_time, 'day'))
          } else if (this.paramsGetStatistics.s_date === 1) {
            this.fasData.xData.push(FormatDate(value_list[i].sub_time, 'month'))
          } else {
            this.fasData.xData.push(FormatDate(value_list[i].sub_time, 'year'))
          }
          this.fasData.fireData.push(value_list[i].subsum_alarm)
          this.fasData.troubleData.push(value_list[i].subsum_trouble)
          this.fasData.supervision.push(value_list[i].subsum_supervision)
          this.fasData.feedback.push(value_list[i].subsum_feedback)
          this.fasData.normalData.push(value_list[i].subsum_normal)
          this.fasData.otherData.push(value_list[i].subsum_other)
          this.fasData.totalData.push(value_list[i].subsum_alarm + value_list[i].subsum_trouble + value_list[i].subsum_normal + value_list[i].subsum_other)
        }
        this.isGraphLoading = false
      }).catch(() => { this.isGraphLoading = false })
    },
    dataChange() {
      this.getStatisticsFas()
    },
    timeChange(time) {
      this.paramsGetStatistics.s_time = FormatDateTime(time)
      this.getStatisticsFas()
    },
    getTime(time) {
      return Formattimestamp(time)
    },
    getDailyFas() {
      const params = {
        project_id: this.selected_project_id
      }
      statisticsFas2(params).then(res => {
        this.currentData = res.data
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .app-container{
    /deep/.el-card__header {
      padding: 10px 14px;
    }
    min-height: calc(100vh - 50px);
    padding: 10px;
    background-color: rgb(240, 242, 245);
    display: flex;
    flex-direction: column;
    .box-card {
      width: 100%;
    }
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
    .statistics {
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      flex: 0 0 250px;
      .detail {
        div {
          color:#606266;
          font-size: 16px;
        }
      }
      .info {
        padding: 0;
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 35px;
          line-height: 50px;
          width: 210px;
          border-radius: 10px;
          .name {
            height: 35px;
            line-height: 35px;
            padding: 0 8px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 10px 0 0 10px;
            display: inline-block;
            color: white;
          }
          .fire {
            background-color: #ef4136;
          }
          .fault {
            background-color: #fcaf17;
          }
          .other {
            background-color: #409EFF;
          }
          .supervision {
            background-color: rgb(165,42,42);
          }
          .feedback{
            background-color:rgba(230,26,224, 1);
          }
          .count {
            flex: 1;
            text-align: center;
          }
        }
      }
      .cartogram {
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        height: 40px;
        line-height: 40px;
        div {
          margin-bottom: 0 !important;
        }
        .item {
          flex: 1;
          margin-right: 15px;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 36px;
          line-height: 36px;
          border-radius: 10px;
          &:last-child {
            margin-right: 0
          }
          .name {
            font-size: 14px;
            border-radius: 10px 0 0 10px;
            display: inline-block;
            color: white;
          }
          .fire {
            background-color: #ef4136;
          }
          .fault {
            background-color: #fcaf17;
          }
          .other {
            background-color: #409EFF;
          }
          .recover {
            background-color: #7fb80e;
          }
          .count {
            flex: 1;
            text-align: center;
          }
        }
      }
      .split {
        border-bottom: 1px solid rgba(144,147,153,0.3);
      }
      .filter {
        float:right
      }
      .day {
        margin-right: 10px;
        flex: 0 0 280px;
        /deep/.el-card__body {
          height: 310px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
      .graph {
        flex: 1;
        .timePicker {
          width: 140px;
        }
      }
    }
    .recordList {
      flex:1;
    }
  }
</style>
