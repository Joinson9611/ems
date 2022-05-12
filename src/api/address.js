import request from '@/utils/request'
import qs from 'qs'

export function getProvinces(params) {
  return request({
    url: '/addresss/provinceindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function getCities(params) {
  return request({
    url: '/addresss/cityindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function getDistricts(params) {
  return request({
    url: '/addresss/districtindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function getStreets(params) {
  return request({
    url: '/addresss/streetindex',
    method: 'post',
    data: qs.stringify(params)
  })
}
