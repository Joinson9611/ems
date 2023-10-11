import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取通道信息列表
 * @Date: 2022/5/24
 **/
export function getChannelInInfoList(Params) {
  return request({
    url: '/channelins/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取通道详情
 * @Date: 2022/5/24
 **/
export function getChannelInInfo(Params) {
  return request({
    url: '/channelins/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加通道
 * @Date: 2022/5/24
 **/
export function addChannelIn(Params) {
  return request({
    url: '/channelins/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的通道
 * @Date: 2022/5/24
 **/
export function deleteChannelIn(Params) {
  return request({
    url: '/channelins/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的通道信息
 * @Date: 2022/5/24
 **/
export function updateChannelIn(Params) {
  return request({
    url: '/channelins/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取指定类型输入设备下所有通道
 * @Date: 2022/5/27
 **/
export function getChannelInlist(Params) {
  return request({
    url: '/channelins/list',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function channelInConfig(Params) {
  return request({
    url: '/channelins/config',
    method: 'post',
    data: qs.stringify(Params)
  })
}
