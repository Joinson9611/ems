import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import '@/styles/reset.css'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import 'default-passive-events'

import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import LightTimeline from 'vue-light-timeline'
import VueParticles from 'vue-particles'

Vue.use(VueParticles)
Vue.use(LightTimeline)
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': false, 'toolbar': true, 'tooltip': true, 'movable': false, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': false, 'keyboard': true, 'url': 'data-source' }
})
const el_scrollBar = (el) => {
  // 在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    // el上挂一份属性
    el._ps_ = new PerfectScrollbar(el, {})
  }
}

Vue.config.productionTip = false
Vue.directive('scrollBar', {
  // 使用inserted钩子函数（初次创建dom）获取使用自定义指令处的dom
  inserted(el, binding, vnode) {
    const { arg } = binding
    if (arg === 'el-table') {
      el = el.querySelector('.el-table__body-wrapper')
      !el && console.warn('未发现className为el-table__body-wrapper的dom')
      // 启用x轴后不让原生滚动条出来作乱
      vnode.context.$nextTick(() => {
        el.classList.add('ps')
        el.addEventListener('ps-scroll-y', () =>
          el.classList.add('ps')
        )
        el.addEventListener('ps-scroll-x', () =>
          el.classList.add('ps')
        )
      })
    }
    // 判断其样式是否存在position 并且position为"fixed", "absolute"或"relative"
    // 如果不符合条件，抛个错误。当然你也可以抛个警告然顺便给其position自动加上"relative"
    // 为什么要这么做呢，因为PerfectScrollbar实现原理就是对dom注入两个div，一个是x轴一个是y轴，他们两的position都是absolute。
    // 对css稍有常识的人都知道，absolute是相对于所有父节点里设置了position属性的最近的一个节点来定位的，为了能够正确定位，我们要给其设置position属性
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    // el上挂一份属性
    el_scrollBar(el)
  },
  // 更新dom的时候
  componentUpdated(el, binding, vnode, oldVnode) {
    try {
      // vnode.context其实就是vue实例，这里其实无需实例也直接用Vue的静态方法
      // 故而也可以写成Vue.nextTick
      vnode.context.$nextTick(
        () => {
          el_scrollBar(el)
        }
      )
    } catch (error) {
      console.error(error)
      el_scrollBar(el)
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

