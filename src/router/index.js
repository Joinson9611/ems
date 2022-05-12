import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import PlatformLayout from '@/views/platformlayout/PlatformLayout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/test', component: () => import('../views/test/test.vue'), hidden: true },
  { path: '/login', component: () => import('../views/login/index'), hidden: true },
  { path: '/404', component: () => import('../views/404'), hidden: true },

  {
    path: '/platform',
    component: PlatformLayout,
    name: 'Platform',
    hidden: true,
    children: [{
      path: 'projects',
      component: () => import('@/views/platform/projects')
    },
    {
      path: 'newproject',
      component: () => import('@/views/platform/newproject')
    },
    {
      path: 'mangment',
      component: () => import('@/views/platform/mangment')
    }]
  },

  {
    path: '/userinfo',
    component: Layout,
    name: 'UserInfo',
    redirect: 'noredirect',
    hidden: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/userinfo/password'),
        name: 'Password',
        meta: {
          title: '密码修改'
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: false,
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      meta: {
        title: '项目首页',
        icon: 'home'
      }
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/project',
    component: Layout,
    redirect: 'noredirect',
    name: 'Project',
    alwaysShow: true,
    meta: {
      title: '项目管理',
      icon: 'project'
    },
    children: [
      {
        path: 'member',
        name: 'project_member',
        component: () => import('@/views/project/member'),
        meta: { title: '项目成员', icon: 'member' }
      },
      {
        path: 'recordperation',
        name: 'project_recordperation',
        component: () => import('@/views/project/recordperation'),
        meta: { title: '操作日志', icon: 'recordperation', roles: ['10101'] }
      }
    ]
  },
  {
    path: '/devices',
    component: Layout,
    redirect: 'noredirect',
    name: 'Devices',
    alwaysShow: true,
    meta: {
      title: '设备管理',
      icon: 'devices',
      roles: ['10061']
    },
    children: [
      {
        path: 'smoke',
        name: 'smoke',
        component: () => import('@/views/devices/smoke'),
        meta: { title: '无线烟感', icon: 'smoke', roles: ['51'] }
      },
      {
        path: 'waterline',
        name: 'waterline',
        component: () => import('@/views/devices/waterline'),
        meta: { title: '水位监测模块', icon: 'waterLine', roles: ['101'] }
      },
      {
        path: 'waterpressure',
        name: 'waterpressure',
        component: () => import('@/views/devices/waterpressure'),
        meta: { title: '水压监测模块', icon: 'waterPressure', roles: ['102'] }
      },
      {
        path: 'waterlogging',
        name: 'waterlogging',
        component: () => import('@/views/devices/waterlogging'),
        meta: { title: '水浸监测模块', icon: 'water2', roles: ['103'] }
      },
      {
        path: 'electricalfire',
        name: 'electricalfire',
        component: () => import('@/views/devices/electricalfire'),
        meta: { title: '电气火灾模块', icon: 'electricalfire', roles: ['104'] }
      },
      {
        path: 'firerecognition',
        name: 'firerecognition',
        component: () => import('@/views/devices/firerecognition'),
        meta: { title: 'AI火灾识别', icon: 'fire', roles: ['201'] }
      },
      {
        path: 'fireaccess',
        name: 'fireaccess',
        component: () => import('@/views/devices/fireaccess'),
        meta: { title: 'AI消防通道', icon: 'fireaccess', roles: ['202'] }
      },
      {
        path: 'elevatormonitoring',
        name: 'elevatormonitoring',
        component: () => import('@/views/devices/elevatormonitoring'),
        meta: { title: 'AI电梯监视', icon: 'elevator', roles: ['203'] }
      },
      {
        path: 'keypart',
        name: 'keypart',
        component: () => import('@/views/devices/keypart'),
        meta: { title: 'AI监护', icon: 'keypart', roles: ['204'] }
      },
      {
        path: 'WIFIsmoke',
        name: 'WIFIsmoke',
        component: () => import('@/views/devices/WIFIsmoke'),
        meta: { title: 'WIFI烟感', icon: 'WIFIsmoke', roles: ['301'] }
      },
      {
        path: 'gasdetector',
        name: 'gasdetector',
        component: () => import('@/views/devices/gasdetector'),
        meta: { title: '可燃气体探测器', icon: 'gasdetector', roles: ['302'] }
      },
      {
        path: 'infrareddetector',
        name: 'infrareddetector',
        component: () => import('@/views/devices/infrareddetector'),
        meta: { title: '红外双鉴探测器', icon: 'infrareddetector', roles: ['303'] }
      }
    ]
  },
  {
    path: '/devrecord',
    component: Layout,
    redirect: 'noredirect',
    name: 'devrecord',
    alwaysShow: true,
    meta: {
      title: '设备记录',
      icon: 'devrecord'
    },
    children: [
      {
        path: 'smoke',
        name: 'smoke',
        component: () => import('@/views/devrecord/smoke/index'),
        meta: { title: '无线烟感', icon: 'smoke', roles: ['51'] }
      },
      {
        path: 'smokeDetail',
        name: 'smoke_detail',
        hidden: true,
        component: () => import('@/views/devrecord/smoke/components/deviceNBs'),
        meta: { title: '无线烟感设备详情' }
      },
      {
        path: 'waterline',
        name: 'waterline',
        component: () => import('@/views/devrecord/waterline/index'),
        meta: { title: '水位监测模块', icon: 'waterLine', roles: ['101'] }
      },
      {
        path: 'waterpressure',
        name: 'waterpressure',
        component: () => import('@/views/devrecord/waterpressure/index'),
        meta: { title: '水压监测模块', icon: 'waterPressure', roles: ['102'] }
      },
      {
        path: 'waterDetail',
        name: 'waterDetail',
        hidden: true,
        component: () => import('@/views/devrecord/components/devicewaters'),
        meta: { title: '设备详情' }
      },
      {
        path: 'waterlogging',
        name: 'waterlogging',
        component: () => import('@/views/devrecord/waterlogging/index'),
        meta: { title: '水浸监测模块', icon: 'water2', roles: ['103'] }
      },
      {
        path: 'waterDetail2',
        name: 'water_detail2',
        hidden: true,
        component: () => import('@/views/devrecord/waterlogging/components/devicewaters'),
        meta: { title: '水浸设备详情' }
      },
      {
        path: 'electricalfire',
        name: 'electricalfire',
        component: () => import('@/views/devrecord/electricalfire/index'),
        meta: { title: '电气火灾模块', icon: 'electricalfire', roles: ['104'] }
      },
      {
        path: 'elefireDetail',
        name: 'elefireDetail',
        hidden: true,
        component: () => import('@/views/devrecord/electricalfire/components/deviceefs'),
        meta: { title: '电气火灾模块详情' }
      },
      {
        path: 'firerecognition',
        name: 'firerecognition',
        component: () => import('@/views/devrecord/firerecognition/index'),
        meta: { title: 'AI火灾识别', icon: 'fire', roles: ['201'] }
      },
      {
        path: 'firerecDetail',
        name: 'firerecDetail',
        hidden: true,
        component: () => import('@/views/devrecord/firerecognition/components/device'),
        meta: { title: 'AI火灾识别详情' }
      },
      {
        path: 'fireaccess',
        name: 'fireaccess',
        component: () => import('@/views/devrecord/fireaccess/index'),
        meta: { title: 'AI消防通道', icon: 'fireaccess', roles: ['202'] }
      },
      {
        path: 'fireaccDetail',
        name: 'fireaccDetail',
        hidden: true,
        component: () => import('@/views/devrecord/fireaccess/components/device'),
        meta: { title: 'AI消防通道详情' }
      },
      {
        path: 'elevatormonitoring',
        name: 'elevatormonitoring',
        component: () => import('@/views/devrecord/elevatormonitoring/index'),
        meta: { title: 'AI电梯监视', icon: 'elevator', roles: ['203'] }
      },
      {
        path: 'elemonDetail',
        name: 'elemonDetail',
        hidden: true,
        component: () => import('@/views/devrecord/elevatormonitoring/components/device'),
        meta: { title: 'AI电梯监视详情' }
      },
      {
        path: 'keypart',
        name: 'keypart',
        component: () => import('@/views/devrecord/keypart/index'),
        meta: { title: 'AI监护', icon: 'keypart', roles: ['204'] }
      },
      {
        path: 'keypartDetail',
        name: 'keypartDetail',
        hidden: true,
        component: () => import('@/views/devrecord/keypart/components/device'),
        meta: { title: 'AI监护详情' }
      },
      {
        path: 'WIFIsmoke',
        name: 'WIFIsmoke',
        component: () => import('@/views/devrecord/WIFIsmoke/index'),
        meta: { title: 'WIFI烟感', icon: 'WIFIsmoke', roles: ['301'] }
      },
      {
        path: 'WIFIsmokeDetail',
        name: 'WIFIsmokeDetail',
        hidden: true,
        component: () => import('@/views/devrecord/WIFIsmoke/components/device'),
        meta: { title: 'WIFI烟感详情' }
      },
      {
        path: 'gasdetector',
        name: 'gasdetector',
        component: () => import('@/views/devrecord/gasdetector/index'),
        meta: { title: '可燃气体探测器', icon: 'gasdetector', roles: ['302'] }
      },
      {
        path: 'gasdetDetail',
        name: 'gasdetDetail',
        hidden: true,
        component: () => import('@/views/devrecord/gasdetector/components/device'),
        meta: { title: '可燃气体探测器详情' }
      },
      {
        path: 'infrareddetector',
        name: 'infrareddetector',
        component: () => import('@/views/devrecord/infrareddetector/index'),
        meta: { title: '红外双鉴探测器', icon: 'infrareddetector', roles: ['303'] }
      },
      {
        path: 'infdetDetail',
        name: 'infdetDetail',
        hidden: true,
        component: () => import('@/views/devrecord/infrareddetector/components/device'),
        meta: { title: '红外双鉴探测器详情' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: (to, from, savedPosition) => {
    return { y: 0 }
  },
  routes: constantRouterMap
})

export const createRouter = () => new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRouterMap
})
