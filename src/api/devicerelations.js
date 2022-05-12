import request from '@/utils/request'
import qs from 'qs'

// 获取联动关系信息
export function getDevicerelationsList(params) {
  return request({
    url: '/devicerelations/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取某一设备的所有联动关系
export function getDevicerelationsList2(params) {
  return request({
    url: '/devicerelations/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加联动关系信息
export function addDevicerelations(params) {
  return request({
    url: '/devicerelations/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除联动关系信息
export function deleteDevicerelations(params) {
  return request({
    url: '/devicerelations/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导入联动关系信息
export function importDevicerelations(params) {
  return request({
    url: '/devicerelations/import',
    method: 'post',
    data: params
  })
}

// 导出联动关系信息
export function exportDevicerelations(params) {
  return request({
    url: '/devicerelations/export',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify(params)
  })
}

