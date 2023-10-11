import request from '@/utils/request'
import qs from 'qs'

// 设备类型下拉菜单
export function getDeviceTypeList(params) {
  return request({
    url: '/devicetypes/menu',
    method: 'post',
    data: qs.stringify(params)
  })
}
