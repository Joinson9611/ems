import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取通道信息列表
 * @Date: 2022/5/24
 **/
export function getChannelsenorsInfoList(Params) {
  return request({
    url: '/channelsenors/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取通道列表(下拉菜单)
 * @Date: 2022/5/24
 **/
export function getChannelsenorsList(Params) {
  return request({
    url: '/channelsenors/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取通道详情(下拉菜单)
 * @Date: 2022/5/24
 **/
export function getChannelsenorsInfo(Params) {
  return request({
    url: '/channelsenors/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加通道
 * @Date: 2022/5/24
 **/
export function addChannelsenors(Params) {
  return request({
    url: '/channelsenors/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的通道
 * @Date: 2022/5/24
 **/
export function deleteChannelsenors(Params) {
  return request({
    url: '/channelsenors/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的通道信息
 * @Date: 2022/5/24
 **/
export function updateChannelsenors(Params) {
  return request({
    url: '/channelsenors/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 根据设备类型和所属网关获取通道列表
 * @Date: 2022/5/24
 **/
export function getChannelListByID(Params) {
  return request({
    url: '/channelsenors/transferlist',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 控制页面传感器列表
 * @Date: 2022/7/21
 **/
export function getSenorctrllist(Params) {
  return request({
    url: '/channelsenors/ctrllist',
    method: 'post',
    data: qs.stringify(Params)
  })
}
