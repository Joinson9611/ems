<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils/echartutils'
// import { FormatDate } from '@/utils/time.js'

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
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ yData, lower_limit, top_limit, xData, s_time, device_type_id } = {}) {
      this.chart.setOption({
        // color: ['#ef4136', '#fcaf17', '#7fb80e', '#009ad6'],
        // title: {
        //   text: `水位监测图（${FormatDate(s_time, 'month')}）`,
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
          // 底部空间 用于放置滚动条
          bottom: 10,
          top: 10,
          containLabel: true
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
          },
          splitLine: {
            lineStyle: {
              color: '#063374'
            }
          }
        },

        yAxis: {
          type: 'value',
          max: (top_limit * 1.3).toFixed(1),
          axisTick: {
            show: false
          }
        },
        series: [{
          name: `${device_type_id === 101 ? '水位(m)' : '水压(MPa)'}`,
          type: 'line',
          stack: 'total',
          showSymbol: false,
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(64, 158, 255, 0.7)'
            }
          },
          data: yData,
          areaStyle: {
            color: 'rgba(46, 198, 201, 0.3)'
          },
          markLine: {
            symbol: 'none',
            data: [
              {
                silent: false,
                lineStyle: {
                  type: 'solid',
                  width: 2,
                  color: '#FA3934'
                },
                label: {
                  position: 'middle',
                  formatter: `低${device_type_id === 101 ? '水位' : '水压'}警报线 (${lower_limit}${device_type_id === 101 ? 'm' : 'MPa'})`
                },
                yAxis: lower_limit || 0
              },
              {
                silent: false,
                lineStyle: {
                  type: 'solid',
                  width: 2,
                  color: '#FA3934'
                },
                label: {
                  position: 'middle',
                  formatter: `高${device_type_id === 101 ? '水位' : '水压'}警报线 (${top_limit}${device_type_id === 101 ? 'm' : 'MPa'})`
                },
                yAxis: top_limit || 0
              }
            ]
          }
        }
        // {
        //   name: '下限',
        //   type: 'line',
        //   showSymbol: false,
        //   barMaxWidth: 35,
        //   barGap: '10%',
        //   itemStyle: {
        //     normal: {
        //       color: '#F56C6C'
        //     }
        //   },
        //   data: lower_limit
        // },
        // {
        //   name: '上限',
        //   showSymbol: false,
        //   type: 'line',
        //   barMaxWidth: 35,
        //   barGap: '10%',
        //   itemStyle: {
        //     normal: {
        //       color: '#F56C6C'
        //     }
        //   },
        //   data: top_limit
        // }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
