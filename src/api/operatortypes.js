import request from '@/utils/request'
import qs from 'qs'

export function getOperatortypes(params) {
  return request({
    url: '/operatortypes/menu',
    method: 'post',
    data: qs.stringify(params)
  })
}
