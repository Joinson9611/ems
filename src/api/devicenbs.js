import request from '@/utils/request'
import qs from 'qs'

// 获取NB设备列表
export function getNBDevicesList(params) {
  return request({
    url: '/devicenbs/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取NB设备详情
export function getNBDevicesInfo(params) {
  return request({
    url: '/devicenbs/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取NB设备统计图信息
export function getNBDevicesGraph(params) {
  return request({
    url: '/devicenbs/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}
