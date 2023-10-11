import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取通道信息列表
 * @Date: 2022/5/24
 **/
export function getChannelOutInfoList(Params) {
  return request({
    url: '/channelouts/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取通道列表(下拉菜单)
 * @Date: 2022/5/24
 **/
export function getChannelOutList(Params) {
  return request({
    url: '/channelouts/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取通道详情(下拉菜单)
 * @Date: 2022/5/24
 **/
export function getChannelOutInfo(Params) {
  return request({
    url: '/channelouts/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加通道
 * @Date: 2022/5/24
 **/
export function addChannelOut(Params) {
  return request({
    url: '/channelouts/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的通道
 * @Date: 2022/5/24
 **/
export function deleteChannelOut(Params) {
  return request({
    url: '/channelouts/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的通道信息
 * @Date: 2022/5/24
 **/
export function updateChannelOut(Params) {
  return request({
    url: '/channelouts/update',
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
    url: '/channelouts/transferlist',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function getChannelOutLists(Params) {
  return request({
    url: '/channelouts/list',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function channelOutConfig(Params) {
  return request({
    url: '/channelouts/config',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function channelCtrl(Params) {
  return request({
    url: '/channelouts/ctrl',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function channelOutCtrlList(Params) {
  return request({
    url: '/channelouts/ctrllist',
    method: 'post',
    data: qs.stringify(Params)
  })
}
