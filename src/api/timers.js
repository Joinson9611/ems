import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取定时器信息列表
 * @Date: 2022/5/18
 **/
export function getTimersInfoList(Params) {
  return request({
    url: '/timers/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 定时器列表(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getTimersList(Params) {
  return request({
    url: '/timers/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加定时器
 * @Date: 2022/5/18
 **/
export function addTimers(Params) {
  return request({
    url: '/timers/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的定时器
 * @Date: 2022/5/18
 **/
export function deleteTimers(Params) {
  return request({
    url: '/timers/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的定时器信息
 * @Date: 2022/5/18
 **/
export function updateTimers(Params) {
  return request({
    url: '/timers/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
