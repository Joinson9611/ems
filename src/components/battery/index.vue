
<template>
  <div>
    <canvas ref="mycanvas" :width="cWidth" :height="cHeight"/>
  </div>
</template>
<script>
export default {
  name: 'Battery',
  mycanvas: null,
  ctx: null,
  myInterval: null,
  props: {
    proQuantity: {
      type: Number,
      default: 50
    },
    proIsCharge: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cWidth: 66,
      cHeight: 28,
      jd: 0
    }
  },
  watch: {
    // 监听是否变化电量 ，如果是 做一个充电动画
    proIsCharge(newVal, oldVal) {
      console.log('======proIsCharge============', newVal)
      const _this = this
      clearInterval(_this.myInterval)
      this.jd = 0
      if (_this.proIsCharge) {
        _this.myInterval = setInterval(function() {
          _this.drawCharge()
        }, 300)
      }
    }
  },
  created() {
  },
  mounted() {
    this.mycanvas = this.$refs.mycanvas
    this.ctx = this.mycanvas.getContext('2d')
    this.drawBg()
    this.drawPath(this.proQuantity)
  },
  methods: {
    // 画一个背景
    drawBg() {
      this.ctx.strokeStyle = 'rgba(255,255,255,1)'
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(0, 0, 60, 28)
      this.ctx.fillStyle = 'rgba(0,0,0,0.2)'
      this.ctx.fillRect(0, 0, 60, 28)
      this.ctx.fillStyle = 'rgba(0,0,0,1)'
      this.ctx.fillRect(61, 7, 6, 14)
    },
    // 根据电量画出一个块
    drawPath(quantity) {
      if (this.proIsCharge) {
        this.ctx.fillStyle = 'green'
      } else if (quantity < 20) {
        this.ctx.fillStyle = 'red'
      } else {
        this.ctx.fillStyle = 'green'
      }
      this.ctx.fillRect(1, 1, (60 - 2) * quantity / 100, 26)
    },
    drawCharge() {
      this.ctx.clearRect(0, 0, this.cWidth, this.cHeight)
      this.drawBg()
      this.jd = this.jd + 10
      if (this.jd > 100) {
        this.jd = 0
      }
      this.drawPath(this.jd)
    }
  }
}
</script>

