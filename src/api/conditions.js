import request from '@/utils/request'
import qs from 'qs'

// 获取自动化条件列表 自动化条件管理使用
export function getConditionInfoList(params) {
  return request({
    url: '/conditions/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取自动化条件列表 下拉框使用
export function getConditionList(params) {
  return request({
    url: '/conditions/menu',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除自动化条件
export function deleteCondition(params) {
  return request({
    url: '/conditions/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建自动化条件
export function addCondition(params) {
  return request({
    url: '/conditions/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取自动化条件详细信息
export function getConditionInfo(params) {
  return request({
    url: '/conditions/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 更新自动化条件信息
export function updateCondition(params) {
  return request({
    url: '/conditions/update',
    method: 'post',
    data: qs.stringify(params)
  })
}
