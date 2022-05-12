import request from '@/utils/request'
import qs from 'qs'

// 获取楼层列表 下拉框使用
export function getFloorList(params) {
  return request({
    url: '/floors/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}
