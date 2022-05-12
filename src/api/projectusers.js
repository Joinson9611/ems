import request from '@/utils/request'
import qs from 'qs'

export function getProjectUsers(params) {
  return request({
    url: '/projectusers/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function deleteProjectUsers(params) {
  return request({
    url: '/projectusers/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function addProjectUser(params) {
  return request({
    url: '/projectusers/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function editProjectUser(params) {
  return request({
    url: '/projectusers/update',
    method: 'post',
    data: qs.stringify(params)
  })
}
