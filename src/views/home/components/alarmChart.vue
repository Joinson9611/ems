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
      // const color_2 = ['#FC0C59', '#F7BA2A', '#1DBD6B', '#00CED1']
      const normalper = data[1].per
      const chartData = []
      const color = data.map(item => item.color)
      data.forEach((v, i) => {
        chartData.push({
          label: {
            normal: {
              show: false,
              formatter: '{b}\n\n{d}%',
              textStyle: {
                fontSize: 12,
                color: '#909399'
              },
              position: 'inner'
            },
            emphasis: {
              show: false
            }
          },
          value: v.value,
          name: v.name
        })
      })
      this.chart.setOption({
        color,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        graphic: [{ // 图形中间文字
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: `${normalper === 100 ? '正常' : normalper + '%'}`,
            textAlign: 'center',
            fill: '#15E09B',
            fontSize: 24
          }
        }],
        series: [
          {
            name: `统计`,
            type: 'pie',
            animation: false,
            center: ['50%', '50%'],
            radius: ['65%', '80%'],
            startAngle: 45,
            data: chartData,
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
