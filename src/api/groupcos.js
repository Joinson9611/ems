import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取组列表
 * @Date: 2022/5/27
 **/
export function getGroupcoList(Params) {
  return request({
    url: '/groupcos/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 更新通道与组绑定关系
 * @Date: 2022/5/27
 **/
export function updateGroupcos(Params) {
  return request({
    url: '/groupcos/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
