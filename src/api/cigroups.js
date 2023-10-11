import request from '@/utils/request'
import qs from 'qs'
/**
 * @Description:  编辑当前id开关的组绑定信息
 * @Date: 2022/5/24
 **/
export function updateCiGroup(Params) {
  return request({
    url: '/cigroups/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function CiGroupDetail(Params) {
  return request({
    url: '/cigroups/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}
