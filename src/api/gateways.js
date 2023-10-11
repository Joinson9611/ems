import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取网关信息列表
 * @Date: 2022/5/18
 **/
export function getGatewaysInfoList(Params) {
  return request({
    url: '/gateways/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 网关列表(下拉菜单)
 * @Date: 2022/5/18
 **/
export function getGatewaysList(Params) {
  return request({
    url: '/gateways/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加网关
 * @Date: 2022/5/18
 **/
export function addGateways(Params) {
  return request({
    url: '/gateways/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的网关
 * @Date: 2022/5/18
 **/
export function deleteGateways(Params) {
  return request({
    url: '/gateways/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改对应ID 的网关信息
 * @Date: 2022/5/18
 **/
export function updateGateways(Params) {
  return request({
    url: '/gateways/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
