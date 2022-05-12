import request from '@/utils/request'
import qs from 'qs'

// 设置303设备联动
export function setdevice303output(params) {
  return request({
    url: '/device303s/setautooutput',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 设置303设备布防
export function setdeivcei303arming(params) {
  return request({
    url: '/device303s/setarming',
    method: 'post',
    data: qs.stringify(params)
  })
}
