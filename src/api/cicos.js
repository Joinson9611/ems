import request from '@/utils/request'
import qs from 'qs'
/**
 * @Description:  编辑当前id开关的组绑定信息
 * @Date: 2022/5/24
 **/
export function updateCiCos(Params) {
  return request({
    url: '/cicos/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}

export function CiCosDetail(Params) {
  return request({
    url: '/cicos/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}
