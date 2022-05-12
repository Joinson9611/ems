import request from '@/utils/request'
import qs from 'qs'

// 获取操作日志
export function getRecordOperations(params) {
  return request({
    url: '/recordoperations/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
