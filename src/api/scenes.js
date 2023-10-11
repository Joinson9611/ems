import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取场景信息列表
 * @Date: 2022/6/7
 **/
export function getScenesInfoList(Params) {
  return request({
    url: '/scenes/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 场景列表(下拉菜单)
 * @Date: 2022/6/7
 **/
export function getScenesList(Params) {
  return request({
    url: '/scenes/menu',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 添加场景
 * @Date: 2022/6/7
 **/
export function addScenes(Params) {
  return request({
    url: '/scenes/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 删除指定ID的场景
 * @Date: 2022/6/7
 **/
export function deleteScenes(Params) {
  return request({
    url: '/scenes/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}
/**
 * @Description: 修改对应ID 的场景信息
 * @Date: 2022/6/7
 **/
export function updateScenes(Params) {
  return request({
    url: '/scenes/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 场景控制
 * @Date: 2022/6/7
 **/
export function scenesCtrl(Params) {
  return request({
    url: '/scenes/ctrl',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 场景详情
 * @Date: 2022/6/7
 **/
export function detailScenes(Params) {
  return request({
    url: '/scenes/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function getScenesCtrlList(Params) {
  return request({
    url: '/scenes/ctrllist',
    method: 'post',
    data: qs.stringify(Params)
  })
}

