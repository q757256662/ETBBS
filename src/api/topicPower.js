import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Topic/GetFuncNotice',
    method: 'get',
    params
  })
}
