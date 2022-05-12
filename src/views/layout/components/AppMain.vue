<template>
  <section class="app-main">
    <!--转场方式-->
    <div>
      <el-scrollbar id="scroller-box" class="sidebar">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="include" >
            <router-view v-if="needKey" :key="key"/>
            <router-view v-else/>
          </keep-alive>
        </transition>
      </el-scrollbar>
      <el-tooltip placement="top" content="回到顶部" style="z-index: 999">
        <ScrollTop/>
      </el-tooltip>
    </div>
    <!-- or name="fade" -->
    <!-- <router-view :key="key"></router-view> -->
  </section>
</template>

<script>
import ScrollTop from '@/components/ElBackToTop'
export default {
  components: {
    ScrollTop
  },
  data() {
    return {
      // 路由跳转缓存状态的组件，可以保证跳转到详情页返回时保持原状态
      include: [
        'Fas',
        'Water',
        'Record',
        'Devrecord'
      ],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  // 不同路由跳转同一组件可以重新触发渲染生命周期钩子
  computed: {
    needKey() {
      const page = []
      return page.includes(this.$route.name)
    },
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
// 解决路由跳转时动画特效产生的滚动条
/deep/.el-scrollbar__view{
  overflow: hidden;
}
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  z-index: 0;
}
</style>
