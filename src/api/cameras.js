import request from '@/utils/request'
import qs from 'qs'

// 获取火眼设备信息
export function getCamerasList(params) {
  return request({
    url: '/cameras/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取火眼设备信息（物联终端）
export function getCamerasList2(params) {
  return request({
    url: '/cameras/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加火眼设备信息
export function addCameras(params) {
  return request({
    url: '/cameras/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除火眼设备信息
export function deleteCameras(params) {
  return request({
    url: '/cameras/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改火眼设备信息
export function updateCameras(params) {
  return request({
    url: '/cameras/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 火眼设备统计
export function detailCameras(params) {
  return request({
    url: '/cameras/detail',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 火眼设备详情
export function camerasInfo(params) {
  return request({
    url: '/cameras/read2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 单个火眼报警记录
export function camerasRecord(params) {
  return request({
    url: '/historycameras/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
