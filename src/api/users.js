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

// 用户信息获取接口
export function getUserInfo(params) {
  return request({
    url: '/users/getuserinfo2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 用户等级信息获取
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

// 获取执行人员列表
export function getExecutorList(params) {
  return request({
    url: '/users/index22',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目成员列表
export function getProjectUserList(params) {
  return request({
    url: '/users/menu',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单位成员管理页面返回 用户列表
export function getCompanyMembers(params) {
  return request({
    url: '/users/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单位成员管理页面新增 用户成员
export function addCompanyMember(params) {
  return request({
    url: '/users/save2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单位成员管理页面删除 用户成员
export function deleteCompanyMember(params) {
  return request({
    url: '/users/delete2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单位成员管理 账号信息编辑
export function editCompanyMember(params) {
  return request({
    url: '/users/update2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定单位的项目成员 下拉框使用
export function getUsersByCompany(params) {
  return request({
    url: '/users/index22',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取用用户详情
export function getUsersInfo(params) {
  return request({
    url: '/users/read2',
    method: 'post',
    data: qs.stringify(params)
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
    url: '/userleveltypes/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

