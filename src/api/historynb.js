import request from '@/utils/request'
import qs from 'qs'

export function getSmokeInfo(params) {
  return request({
    url: '/historynb/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// Nb表格数据
export function getNbInfoList(params) {
  return request({
    url: '/historynbs/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
