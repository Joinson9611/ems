import request from '@/utils/request'
import qs from 'qs'

// 获取任务信息第一标签页中的待巡检列表
export function getTasksDevices(params) {
  return request({
    url: '/historytaskdevices/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取任务信息第二标签页的设备巡检记录信息
export function getDeviceCheckedInfo(params) {
  return request({
    url: '/historytaskdevices/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取巡检设备的详细设备巡检记录
export function getCheckedDeviceInfo(params) {
  return request({
    url: '/historytaskdevices/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取任务设备巡检记录
export function getTasksRecord(params) {
  return request({
    url: '/historytaskdevices/index3',
    method: 'post',
    data: qs.stringify(params)
  })
}
