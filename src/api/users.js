import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export function login(loginParams) {
  return request({
    url: '/users/logon',
    method: 'post',
    data: qs.stringify(loginParams)
  })
}

export function setUserInfo(params) {
  return request({
    url: '/users/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 用户等级信息获取
export function getUserInfo(params) {
  return request({
    url: '/users/getuserinfo2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 用户信息获取接口
export function getUserLevel() {
  return request({
    url: '/users/getuserinfo',
    method: 'post'
  })
}

// 用户登出接口
export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

// 获取项目管理员列表
export function getAdministrator(params) {
  return request({
    url: '/users/index1',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加项目管理员信息
export function addAdministrator(params) {
  return request({
    url: '/users/save1',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除项目管理员信息
export function deleteAdministrator(params) {
  return request({
    url: '/users/delete1',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改项目管理员信息
export function updateAdministrator(params) {
  return request({
    url: '/users/update1',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目成员列表
export function getUserList(params) {
  return request({
    url: '/users/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加项目成员信息
export function addUser(params) {
  return request({
    url: '/users/save2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除项目成员信息
export function deleteUser(params) {
  return request({
    url: '/users/delete2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改项目成员信息
export function updateUser(params) {
  return request({
    url: '/users/update2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目成员信息
export function getUserDetail(params) {
  return request({
    url: '/users/read2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取后台管理员列表
export function getAdminList(params) {
  return request({
    url: '/users/index0',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加后台管理员信息
export function addAdmin(params) {
  return request({
    url: '/users/save0',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除后台管理员信息
export function deleteAdmin(params) {
  return request({
    url: '/users/delete0',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改后台管理员信息
export function updateAdmin(params) {
  return request({
    url: '/users/update0',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取后台管理员信息
export function getAdminDetail(params) {
  return request({
    url: '/users/read0',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取后台用户等级列表信息
export function getLevelTypeList(params) {
  return request({
    url: '/userleveltypes/menu',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取模块列表（进入项目前，用于渠道商）
export function getUserModule(params) {
  return request({
    url: '/users/getusermodulelist',
    method: 'post',
    data: qs.stringify(params)
  })
}
