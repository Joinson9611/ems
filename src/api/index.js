import request from '@/utils/request'
import qs from 'qs'

// 网站首页-获取最近两个月的任务状态统计(巡查任务)

export function getHistorytaskchart(params) {
  return request({
    url: '/index/historytask',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 网站首页-获取最近两个月的任务状态统计(保养任务)

export function getHisMaintenancechart(params) {
  return request({
    url: '/index/historytaskmc',
    method: 'post',
    data: qs.stringify(params)
  })
}
