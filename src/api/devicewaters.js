import request from '@/utils/request'
import qs from 'qs'

// 获取水压设备信息
export function getDevicewatersList(params) {
  return request({
    url: '/devicewaters/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取水压设备统计
export function getDevicewatersDetail(params) {
  return request({
    url: '/devicewaters/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取水压设备统计
export function getDevicewatersInfo(params) {
  return request({
    url: '/devicewaters/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

