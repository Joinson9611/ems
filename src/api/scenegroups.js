import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取当前场景组绑定关系
 * @Date: 2022/6/7
 **/
export function getScenesgroupsInfoList(Params) {
  return request({
    url: '/scenegroups/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 新增新的绑定关系
 * @Date: 2022/6/7
 **/
export function addScenesgroups(Params) {
  return request({
    url: '/scenegroups/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除当前场景下的绑定关系
 * @Date: 2022/6/7
 **/
export function deleteScenesgroups(Params) {
  return request({
    url: '/scenegroups/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description:  修改当前场景下的绑定关系
 * @Date: 2022/6/7
 **/
export function updateScenesgroups(Params) {
  return request({
    url: '/scenegroups/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取当前场景下的绑定关系详情
 * @Date: 2022/6/7
 **/
export function detailScenesgroups(Params) {
  return request({
    url: '/scenegroups/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}
