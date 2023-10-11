import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取设备信息列表
 * @Date: 2022/5/18
 **/
export function getDeviceInfoList(Params) {
  return request({
    url: '/devices/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取设备列表(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getDeviceList(Params) {
  return request({
    url: '/devices/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取设备详情(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getDeviceInfo(Params) {
  return request({
    url: '/devices/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加设备
 * @Date: 2022/5/18
 **/
export function addDevice(Params) {
  return request({
    url: '/devices/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的设备
 * @Date: 2022/5/18
 **/
export function deleteDevice(Params) {
  return request({
    url: '/devices/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的设备信息
 * @Date: 2022/5/18
 **/
export function updateDevice(Params) {
  return request({
    url: '/devices/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取控制页面控制器列表
 * @Date: 2022/7/28
 **/
export function getCtrlList(Params) {
  return request({
    url: '/devices/ctrllist',
    method: 'post',
    data: qs.stringify(Params)
  })
}
