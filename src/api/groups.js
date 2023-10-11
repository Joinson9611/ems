import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取设备信息列表
 * @Date: 2022/5/18
 **/
export function getGroupsInfoList(Params) {
  return request({
    url: '/groups/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取设备列表(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getGroupsList(Params) {
  return request({
    url: '/groups/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取设备详情(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getGroupsInfo(Params) {
  return request({
    url: '/groups/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加设备
 * @Date: 2022/5/18
 **/
export function addGroups(Params) {
  return request({
    url: '/groups/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的设备
 * @Date: 2022/5/18
 **/
export function deleteGroups(Params) {
  return request({
    url: '/groups/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的设备信息
 * @Date: 2022/5/18
 **/
export function updateGroups(Params) {
  return request({
    url: '/groups/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
