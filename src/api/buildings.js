import request from '@/utils/request'
import qs from 'qs'

// 获取建筑列表 建筑管理使用
export function getBuildingListByPage(params) {
  return request({
    url: '/buildings/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取建筑列表 下拉框使用
export function getBuildingList(params) {
  return request({
    url: '/buildings/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除建筑物
export function deleteBuildings(params) {
  return request({
    url: '/buildings/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建建筑物
export function addNewBuilding(params) {
  return request({
    url: '/buildings/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取建筑物详细信息
export function getBuildingInfo(params) {
  return request({
    url: '/buildings/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 更新建筑物信息
export function updateBuildingInfo(params) {
  return request({
    url: '/buildings/update',
    method: 'post',
    data: qs.stringify(params)
  })
}
