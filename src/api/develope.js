import request from '@/utils/request'

//开发部公告api
export function GetList(data) {
    return request({
      url: '/Topic/GetDelevopmentNotice',
      method: 'get',
      params:data
    })
  }