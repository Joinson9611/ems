import request from '@/utils/request'
import qs from 'qs'

// 更新303设备定时
export function setdevice303timing(params) {
  return request({
    url: '/devicetiming303s/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 303设备定时详情
export function detaildevice303timing(params) {
  return request({
    url: '/devicetiming303s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}
