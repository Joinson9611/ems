import router, { createRouter } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from './utils/auth' // 验权

const whiteList = ['/login', '/tasks/devices', '/app/download', '/taskcr/generalqrcode'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 判断是否已有token（是否已登录）

  if (getToken()) {
    if (to.path === '/login') {
      // 用户已登录的情况下，to路由指向登录页面时，直接跳往主页
      next({ path: '/platform/projects' })
      NProgress.done()
    } else if (to.path === '/platform/projects' || to.path === '/platform/newproject' || to.path === '/platform/mangment') {
      // 用户已登录的情况下，to路由指向项目内部以外的非登录页时，仅获取用户类型而不进行权限信息判断
      if (store.getters.Account_Type.length === 0) {
        store.dispatch('GetUserLevel').then(() => { // 拉取用户信息
          next()
        }).catch(() => {
          // 异常 前端 登出
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败，请重新登录。')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    } else {
      // 判断是否已经拉取了用户信息
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(res => { // 拉取用户信息
          const roles = res
          // 根据roles权限生成可访问的路由表
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.matcher = createRouter().matcher
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          })
        }).catch(() => {
          // 异常 前端 登出
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败，请重新登录。')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 判断即将跳转去的路由是否不为登录页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
