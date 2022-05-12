import request from '@/utils/request'
import qs from 'qs'

// 水浸设备列表
export function getDevicewater2sList(params) {
  return request({
    url: '/devicewater2s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 水浸设备统计
export function detailDevicewater2s(params) {
  return request({
    url: '/devicewater2s/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 水浸设备详情
export function devicewater2sInfo(params) {
  return request({
    url: '/devicewater2s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单个水浸报警记录
export function historywater2s(params) {
  return request({
    url: '/historywater2s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
