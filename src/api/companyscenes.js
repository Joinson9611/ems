import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取网关信息列表
 * @Date: 2022/6/9
 **/
export function getCompanyscenesInfoList(Params) {
  return request({
    url: '/companyscenes/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 分配场景给指定单位
 * @Date: 2022/6/9
 **/
export function addCompanyscenes(Params) {
  return request({
    url: '/companyscenes/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除已分配给公司的场景
 * @Date: 2022/6/9
 **/
export function deleteCompanyscenes(Params) {
  return request({
    url: '/companyscenes/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}
