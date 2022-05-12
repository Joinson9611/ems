import request from '@/utils/request'
import qs from 'qs'

// 获取用户绑定的项目列表
export function getUserProjectList(params) {
  return request({
    url: '/userprojects/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 绑定项目
export function bindProject(params) {
  return request({
    url: '/userprojects/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 解绑项目
export function unbindProject(params) {
  return request({
    url: '/userprojects/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

