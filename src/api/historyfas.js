import request from '@/utils/request'
import qs from 'qs'

// 设备删除
export function getFasWeekCount(params) {
  return request({
    url: '/index/historyfas',
    method: 'post',
    data: qs.stringify(params)
  })
}

// Fas表格数据
export function getFasInfoList(params) {
  return request({
    url: '/historyfass/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// Fas详情
export function detailFas(params) {
  return request({
    url: '/historyfass/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑Fas详情
export function updateFasDetail(params) {
  return request({
    url: '/historyfass/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 日、月、年图表统计
export function statisticsFas(params) {
  return request({
    url: '/historyfass/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 当天统计
export function statisticsFas2(params) {
  return request({
    url: '/historyfass/detail2',
    method: 'post',
    data: qs.stringify(params)
  })
}

