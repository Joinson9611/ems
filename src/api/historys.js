import request from '@/utils/request'
import qs from 'qs'

// 获取报警记录列表
export function getHistorydevList(params) {
  return request({
    url: '/historys/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 用于水位水压统计图
export function getHistoryDetail(params) {
  return request({
    url: '/historydatas/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}

