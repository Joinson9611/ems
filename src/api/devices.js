import request from '@/utils/request'
import qs from 'qs'

// 获取设备列表
export function getDevicesList(params) {
  return request({
    url: '/devices/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取设备列表用于物联模块
export function getDevList2ForIot(params) {
  return request({
    url: '/devices/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取物联设备统计
export function getDevicesDetail(params) {
  return request({
    url: '/devices/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取物联设备详情
export function getDevInfoForIot(params) {
  return request({
    url: '/devices/read2',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function getDeviceTypes(params) {
  return request({
    url: '/devicetypes/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 设备添加
export function addDevice(params) {
  return request({
    url: '/devices/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 设备编辑
export function editDevice(params) {
  return request({
    url: '/devices/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 设备删除
export function deleteDevice(params) {
  return request({
    url: '/devices/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导入设备表
export function importDevicesFile(params) {
  return request({
    url: '/devices/import',
    method: 'post',
    data: params
  })
}

// 导出设备Excel表
export function exportDevicesFile(params) {
  return request({
    url: '/devices/export',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify(params)
  })
}
