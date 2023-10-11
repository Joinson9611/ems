import request from '@/utils/request'
import qs from 'qs'

// 获取当前项目下的一些统计信息
export function getProjectCount(params) {
  return request({
    url: '/index/count',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目详情
export function getProjectInfo(params) {
  return request({
    url: '/projects/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取概况详情
export function getSituation(params) {
  return request({
    url: '/projects/read2',
    method: 'post',
    data: qs.stringify(params)
  })
}
// 项目信息编辑
export function editProjectInfo(params) {
  return request({
    url: '/projects/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目列表
export function getProjects(params) {
  return request({
    url: '/projects/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 选择项目
export function selectProject(params) {
  return request({
    url: '/users/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除项目
export function deleteProject(params) {
  return request({
    url: '/projects/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 创建项目
export function addProject(params) {
  return request({
    url: '/projects/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function uploadLogoImage(data) {
  return request({
    url: '/projects/uploadimage',
    method: 'post',
    data
  })
}
