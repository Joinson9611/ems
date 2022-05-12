import request from '@/utils/request'
import qs from 'qs'

export function homepage(params) {
  return request({
    url: '/indexs/homepage',
    method: 'post',
    data: qs.stringify(params)
  })
}
