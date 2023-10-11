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
  { path: '/test', component: () => import('../views/test/index.vue'), hidden: true },
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
    }
    ]
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
    path: '/fullscreen',
    component: Layout,
    name: 'platformSetting',
    redirect: 'noredirect',
    hidden: true,
    children: [
      {
        path: 'setting',
        component: () => import('@/views/platformSetting'),
        name: 'setting',
        meta: {
          title: '大屏设置'
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
    path: '/ctrl',
    name: 'ctrl',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/ctrl/index'),
        meta: { title: '灯光控制', icon: 'ctrl' }
      }
    ]
  },
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
        meta: { title: '操作日志', icon: 'recordperation', roles: ['481'] }
      }
    ]
  },

  {
    path: '/device',
    name: 'device',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '设备管理',
      icon: 'devices',
      roles: ['191', '301', '311', '321', '331']
    },
    children: [
      {
        path: 'building',
        name: 'building',
        component: () => import('@/views/building/index'),
        meta: { title: '建筑管理', icon: 'building', roles: ['191'] }
      },
      {
        path: 'gateways',
        name: 'gateways',
        component: () => import('@/views/devices/gateways'),
        meta: { title: '网关管理', icon: 'gateways', roles: ['301'] }
      },
      {
        path: 'controller',
        name: 'controller',
        component: () => import('@/views/devices/device'),
        meta: { title: '设备管理', icon: 'controller', roles: ['311'] }
      },
      {
        path: 'senor',
        name: 'senor',
        component: () => import('@/views/devices/senor'),
        meta: { title: '传感器管理', icon: 'senor', roles: ['311'] }
      },
      {
        path: 'group',
        name: 'group',
        component: () => import('@/views/devices/group'),
        meta: { title: '组管理', icon: 'group', roles: ['321'] }
      },
      {
        path: 'switch',
        name: 'switch',
        component: () => import('@/views/devices/switch'),
        meta: { title: '开关绑定', icon: 'switch', roles: ['331'] }
      }
    ]
  },

  {
    path: '/scene',
    name: 'scene',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '场景管理',
      icon: 'devices',
      roles: ['341', '343']
    },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/scene/management/index'),
        meta: { title: '场景管理', icon: 'scene', roles: ['341'] }
      },
      {
        path: 'distribution',
        name: 'distribution',
        component: () => import('@/views/scene/distribution/index'),
        meta: { title: '场景分配', icon: 'distribution', roles: ['343'] }
      }
    ]
  },

  {
    path: '/time',
    name: 'time',
    component: Layout,
    children: [
      {
        path: 'timer',
        name: 'timer',
        component: () => import('@/views/timer/index'),
        meta: { title: '定时管理', icon: 'timer', roles: ['351'] }
      }
    ]
  },
  {
    path: '/automation',
    name: 'automation',
    component: Layout,
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/automation/index'),
        meta: { title: '自动化管理', icon: 'automations', roles: ['371'] }
      }
    ]
  },

  {
    path: '/config',
    name: 'config',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '配置下发',
      icon: 'config',
      roles: ['361']
    },

    children: [
      {
        path: 'switch',
        name: 'switch',
        component: () => import('@/views/config/switch.vue'),
        meta: { title: '开关', icon: 'switch', type: 0 }
      },
      {
        path: 'device',
        name: 'device',
        component: () => import('@/views/config/device.vue'),
        meta: { title: '控制器', icon: 'devices', type: 1 }
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
