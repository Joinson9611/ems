import request from '@/utils/request'
import qs from 'qs'

// 获取单位列表 项目信息下拉框使用
export function getCompany(params) {
  return request({
    url: '/companys/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 创建新单位
export function createCompany(params) {
  return request({
    url: '/companys/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单位页面获取单位列表
export function getCompanyInfoList(params) {
  return request({
    url: '/companys/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除单位
export function deleteCompanys(params) {
  return request({
    url: '/companys/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑信息
export function editCompany(params) {
  return request({
    url: '/companys/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取单位类型列表 下拉框使用
export function getCompanyTypeList(params) {
  return request({
    url: '/companytypes/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取当前用户的单位列表
export function getCompanyByUser(params) {
  return request({
    url: '/companys/index3',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取项目相关的单位列表
export function getProjectCompany(params) {
  return request({
    url: '/companys/index4',
    method: 'post',
    data: qs.stringify(params)
  })
}
