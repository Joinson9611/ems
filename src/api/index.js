import request from '@/utils/request'
import qs from 'qs'

export function getHomeCount(params) {
  return request({
    url: '/index/count',
    method: 'post',
    data: qs.stringify(params)
  })
}
