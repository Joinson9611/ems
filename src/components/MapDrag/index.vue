<template>
  <div class="m-map">
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>

<script>
import remoteLoad from '@/utils/remoteLoad.js'

const PointList = [
  { 'name': '北京市', 'center': '116.407394,39.904211' },
  { 'name': '天津市', 'center': '117.200983,39.084158' },
  { 'name': '河北省', 'center': '114.530235,38.037433' },
  { 'name': '山西省', 'center': '112.562678,37.873499' },
  { 'name': '内蒙古自治区', 'center': '111.76629,40.81739' },
  { 'name': '辽宁省', 'center': '123.431382,41.836175' },
  { 'name': '吉林省', 'center': '125.32568,43.897016' }
]

export default {
  props: {
    lat: {
      type: String,
      default: '23.126754'
    },
    lng: {
      type: String,
      default: '113.265977'
    }
  },
  data() {
    return {
      Loca: null,
      AMapUI: null,
      AMap: null
    }
  },
  async created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI && window.Loca) {
      this.test()
    } else {
      // await remoteLoad('http://webapi.amap.com/maps?v=1.4.14&key=21d2805b1b3b94b2c35975460006531f')
      await remoteLoad('http://webapi.amap.com/loca?v=1.2.0&key=21d2805b1b3b94b2c35975460006531f')
      // await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
      this.test()
    }
  },
  methods: {
    test() {
      // const AMapUI = this.AMapUI = window.AMapUI
      // const AMap = this.AMap = window.AMap
      const Loca = this.Loca = window.Loca

      const map = Loca.create('js-container', {
        mapStyle: 'amap://styles/midnight',
        zoom: 4,
        center: [107.4976, 32.1697]
      })

      const layer = Loca.visualLayer({
        eventSupport: true,
        container: map,
        type: 'point',
        shape: 'circle'
      })

      layer.on('mousemove', function(ev) {
        console.log(ev)

        // 事件类型
        // var type = ev.type
        // 当前元素的原始数据
        // const rawData = ev.rawData
        // 原始鼠标事件
        // const originalEvent = ev.originalEvent
        // openInfoWin(map.getMap(), originalEvent, {
        //   '名称': rawData.name,
        //   '位置': rawData.center
        // })
      })

      layer.on('mouseleave', function(ev) {
        // closeInfoWin()
      })

      layer.setData(PointList, {
        lnglat: 'center'
      })

      layer.setOptions({
        style: {
          radius: 10,
          color: '#4fc2ff',
          borderColor: '#ffffff',
          borderWidth: 1.5,
          opacity: 0.8
        },
        selectStyle: {
          radius: 14,
          color: '#ffe30a'
        }
      })
      layer.render()
    }
  }
}
</script>

<style lang="css">
  .m-map{ min-width: 1000px; min-height: 600px; position: relative; margin: 20px }
  .m-map .map{ width: 100%; height: 100%; }
</style>
