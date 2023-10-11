import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取定时器信息列表
 * @Date: 2022/5/18
 **/
export function getTimerscenesInfoList(Params) {
  return request({
    url: '/timerscenes/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 定时器列表(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getTimerscenesList(Params) {
  return request({
    url: '/timerscenes/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加定时器
 * @Date: 2022/5/18
 **/
export function addTimerscenes(Params) {
  return request({
    url: '/timerscenes/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的定时器
 * @Date: 2022/5/18
 **/
export function deleteTimerscenes(Params) {
  return request({
    url: '/timerscenes/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的定时器信息
 * @Date: 2022/5/18
 **/
export function updateTimerscenes(Params) {
  return request({
    url: '/timerscenes/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
