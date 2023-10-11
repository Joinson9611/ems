import request from '@/utils/request'
import qs from 'qs'

export function getUserscenesInfoList(Params) {
  return request({
    url: '/userscenes/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function addUserscenes(Params) {
  return request({
    url: '/userscenes/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function deleteUserscenes(Params) {
  return request({
    url: '/userscenes/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}
