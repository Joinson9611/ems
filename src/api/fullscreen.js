import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取水源系统当月统计(饼图)
 * @Date: 2019/5/31
 **/
export function getWaterStatss(params) {
  return request({
    url: '/statss/historywater',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取任务系统近两月统计(柱状图)
 * @Date: 2019/5/31
 **/
export function getTasksStatss(params) {
  return request({
    url: '/statss/historytask',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取巡检记录统计(饼图)
 * @Date: 2019/5/31
 **/
export function getMaintenanceStatss(params) {
  return request({
    url: '/statss/historytaskdevice',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取火灾报警统计(折线图)
 * @Date: 2019/5/31
 **/
export function getFasStatss(params) {
  return request({
    url: '/statss/historyfas',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取地图点位信息
 * @Date: 2019/5/31
 **/
export function getMapData(params) {
  return request({
    url: '/statss/project',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取消息展示
 * @Date: 2019/5/31
 **/
export function getMessagesData(params) {
  return request({
    url: '/statss/message',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取项目概况
 * @Date: 2019/5/30
 **/
export function getProjectInfo(params) {
  return request({
    url: '/statss/projectdetail',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取当月报修统计
 * @Date: 2020/6/3
 **/
export function getMonthMaintenanceChart(params) {
  return request({
    url: '/statss/taskmb',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取当月设备巡查统计
 * @Date: 2020/6/4
 **/
export function getHistorytaskdevice(params) {
  return request({
    url: '/statss/historytask',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取当月安保巡查统计
 * @Date: 2020/6/4
 **/
export function getSecuritytaskdevice(params) {
  return request({
    url: '/statss/historytask3',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取设备巡查分析
 * @Date: 2020/6/4
 **/
export function getTaskDeviceInfo(params) {
  return request({
    url: '/statss/historytaskdevice',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取安保巡查分析
 * @Date: 2020/6/4
 **/
export function getTaskSecurityInfo(params) {
  return request({
    url: '/statss/historytaskdevice3',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取各类统计
 * @Date: 2020/6/5
 **/
export function getCountInfo(params) {
  return request({
    url: '/statss/count',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: fas报警记录
 * @Date: 2020/6/5
 **/
export function getHistoryFas(params) {
  return request({
    url: '/statsfass/historyindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: fas报警记录
 * @Date: 2020/6/8
 **/
export function getMemberList(params) {
  return request({
    url: '/statss/projectuser',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取月年水位水压设备统计数据
 * @Date: 2020/6/8
 **/
export function getDeviceWaterFault(params) {
  return request({
    url: '/statswaters/historydetail2',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取月年水位水压设备统计数据
 * @Date: 2020/6/8
 **/
export function getDeviceWaterList(params) {
  return request({
    url: '/statswaters/deviceindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取单个设备水位检测图
 * @Date: 2020/6/8
 **/
export function getDeviceGraph(params) {
  return request({
    url: '/statswaters/historydetail',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取故障信息
 * @Date: 2020/6/8
 **/
export function getDeviceWaterFaultInfo(params) {
  return request({
    url: '/statswaters/devicedetail',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取某一设备的所有联动关系
 * @Date: 2020/6/8
 **/
export function getDevicerelationList(params) {
  return request({
    url: '/statsfass/devicerelationindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取人员备案列表
 * @Date: 2020/6/23
 **/
export function getStaffList(params) {
  return request({
    url: '/statss/staffindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取微型消防站信息
 * @Date: 2020/7/1
 **/
export function getFireStationInfo(params) {
  return request({
    url: '/statss/fsindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取重点部位信息
 * @Date: 2020/7/1
 **/
export function getKeypartList(params) {
  return request({
    url: '/statss/keypartindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取水浸监测饼图数据
 * @Date: 2020/9/2
 **/
export function getWater2Graph(params) {
  return request({
    url: '/statss/water2index',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 获取火警信息
 * @Date: 2020/9/25
 **/
export function getFasInfo(params) {
  return request({
    url: '/statss/countfas',
    method: 'post',
    data: qs.stringify(params)
  })
}
