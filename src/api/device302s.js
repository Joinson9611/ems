import request from '@/utils/request'
import qs from 'qs'

// 设置302设备联动
export function setdevice302output(params) {
  return request({
    url: '/device302s/setautooutput',
    method: 'post',
    data: qs.stringify(params)
  })
}
