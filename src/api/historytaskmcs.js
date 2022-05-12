import request from '@/utils/request'
import qs from 'qs'

// 获取保养记录
export function getHistorytaskmcs(params) {
  return request({
    url: '/historytaskmcs/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
// 删除取保养记录
export function deleteHistorytaskmcs(params) {
  return request({
    url: '/historytaskmcs/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导出取保养记录
export function exportHistorytaskmcs(params) {
  return request({
    url: '/historytaskmcs/export',
    method: 'post',
    data: qs.stringify(params),
    responseType: 'blob'
  })
}

// 获取保养记录详情
export function getHistorytaskmcsDetail(params) {
  return request({
    url: '/historytaskmcs/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

