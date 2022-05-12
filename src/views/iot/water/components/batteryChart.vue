<template>
  <div style="width: 100%; height: 100%;"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce } from '@/utils/tools'

export default {
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
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
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions(data) {
      const color_1 = ['#FF687D', '#15E09B']
      // const color_2 = ['#FC0C59', '#F7BA2A', '#1DBD6B', '#00CED1']
      data.forEach((v, i) => {
        v.label = {
          normal: {
            show: true,
            formatter: '{b}\n\n{d}%',
            textStyle: {
              fontSize: 12,
              color: color_1[i]
            },
            position: 'outside'
          },
          emphasis: {
            show: true
          }
        }
      })
      this.chart.setOption({
        color: ['#FF687D', '#15E09B'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          right: 0,
          data: ['电量过低', '正常'],
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            name: '电量统计',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '55%'],
            startAngle: 45,
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(255, 255, 255,1)'
              }
            },
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
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
