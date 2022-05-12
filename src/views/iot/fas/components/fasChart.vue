<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils/echartutils'
import { FormatDate } from '@/utils/time'

export default {
  name: 'BarChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '380px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dateMap: ['日', '月', '年'],
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }
    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    resize() {
      if (this.chart) {
        console.log(1)

        this.chart.resize()
      }
    },
    fomateTime() {
      if (this.chartData.dateType === 0) {
        return FormatDate(this.this.chartData.s_time, 'day')
      } else if (this.chartData.dateType === 1) {
        return FormatDate(this.this.chartData.s_time, 'month')
      } else {
        return FormatDate(this.this.chartData.s_time, 'year')
      }
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ xData, fireData, troubleData, normalData, otherData, totalData, s_time, supervision, feedback } = {}) {
      this.chart.setOption({
        // color: ['#ef4136', '#fcaf17', '#7fb80e', '#009ad6'],
        // title: {
        //   text: `FAS系统${this.dateMap[this.chartData.dateType]}变化趋势图`,
        //   textStyle: {
        //     color: '#666666',
        //     fontSize: 16,
        //     fontWeight: 'bold'
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 60,
          containLabel: true
        },
        legend: {
          left: 'right',
          data: ['火警', '监管', '反馈', '故障', '总数']
        },
        calculable: true,
        toolbox: {
          show: true
        },
        xAxis: {
          data: xData,
          type: 'category',
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          }
        },
        series: [{
          name: '火警',
          type: 'bar',
          stack: 'total',
          barGap: '10%',
          itemStyle: {
            normal: {
              color: '#ef4136'
            }
          },
          data: fireData
        },
        {
          name: '监管',
          type: 'bar',
          stack: 'total',
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgb(165,42,42)'
            }
          },
          data: supervision
        },
        {
          name: '反馈',
          type: 'bar',
          stack: 'total',
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(230,26,224, 1)'
            }
          },
          data: feedback
        },
        {
          name: '故障',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: '#fcaf17'
            }
          },
          data: troubleData
        }
        // {
        //   name: '恢复',
        //   type: 'bar',
        //   stack: 'total',
        //   itemStyle: {
        //     normal: {
        //       color: '#7fb80e'
        //     }
        //   },
        //   data: normalData
        // }
        // {
        //   name: '其他',
        //   type: 'bar',
        //   stack: 'total',
        //   itemStyle: {
        //     normal: {
        //       color: '#009ad6'
        //     }
        //   },
        //   data: otherData
        // }
        // {
        //   show: false,
        //   name: '总数',
        //   type: 'line',
        //   symbolSize: 10,
        //   symbol: 'circle',
        //   smooth: true,
        //   itemStyle: {
        //     normal: {
        //       color: '#ef5b9c',
        //       barBorderRadius: 0,
        //       label: {
        //         show: false,
        //         formatter(p) {
        //           return p.value > 0 ? p.value : ''
        //         }
        //       }
        //     }
        //   },
        //   data: totalData
        // }
        ]
      }, true)
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
