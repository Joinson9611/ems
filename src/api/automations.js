import request from '@/utils/request'
import qs from 'qs'

// 获取自动化方案列表 自动化方案管理使用
export function getAutomationInfoList(params) {
  return request({
    url: '/automations/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取自动化方案列表 下拉框使用
export function getAutomationList(params) {
  return request({
    url: '/automations/menu',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除自动化方案物
export function deleteAutomation(params) {
  return request({
    url: '/automations/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建自动化方案物
export function addAutomation(params) {
  return request({
    url: '/automations/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取自动化方案物详细信息
export function getAutomationInfo(params) {
  return request({
    url: '/automations/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 更新自动化方案物信息
export function updateAutomation(params) {
  return request({
    url: '/automations/update',
    method: 'post',
    data: qs.stringify(params)
  })
}
