import request from '@/utils/request'
import qs from 'qs'

export function getWaterMessage(params) {
  return request({
    url: '/historywater/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 无线水位水压表格数据
export function getWaterInfoList(params) {
  return request({
    url: '/historywaters/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获得单个设备图标统计
export function getWaterDeviceGraph(params) {
  return request({
    url: '/historywaters/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}
