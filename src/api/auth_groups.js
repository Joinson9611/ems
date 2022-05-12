import request from '@/utils/request'
import qs from 'qs'

// 获取项目的权限角色列表 下拉框使用
export function getProjectUserGroups(params) {
  return request({
    url: '/authgroups/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目的权限角色信息
export function getProjectGroups(params) {
  return request({
    url: '/authgroups/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新增项目的角色权限
export function addProjectGroups(param) {
  return request({
    url: '/authgroups/save',
    method: 'post',
    data: qs.stringify(param)
  })
}

// 删除项目的权限角色
export function deleteProjectGroups(params) {
  return request({
    url: '/authgroups/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑项目的权限角色
export function editProjectGroups(params) {
  return request({
    url: '/authgroups/update',
    method: 'post',
    data: qs.stringify(params)
  })
}
